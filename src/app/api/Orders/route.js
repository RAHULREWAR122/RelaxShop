import crypto from "crypto";
import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireUser } from "@/lib/server/auth";
import { priceLines } from "@/lib/pricing";
import { Orders } from "@/app/MongoDb/Orders";
import { Product } from "@/app/MongoDb/Products";
import { productsChanged } from "@/lib/server/storeProducts";

// Admins get every order; customers get their own.
export const GET = handle(async (req) => {
  const auth = requireUser(req);
  await connectDB();
  const filter = auth.role === "admin" ? {} : { email: auth.email };
  const orders = await Orders.find(filter).sort({ createdAt: -1 }).lean();
  return ok(orders);
});

// Place an order. Prices and stock come from the database, never the client.
// Body: { items: [{ id, qty }], address: {...}, paymentMethod: "cod" | "online" }
export const POST = handle(async (req) => {
  const body = await readJson(req);
  const auth = requireUser(req, body);
  if (auth.role === "admin") return fail("Admins can't place orders.", 403);

  const items = Array.isArray(body.items) ? body.items : [];
  const address = body.address || {};
  const paymentMethod = body.paymentMethod === "cod" ? "cod" : "online";

  if (!items.length) return fail("Your bag is empty.", 400);
  if (!/^\d{10}$/.test(String(address.phone || ""))) return fail("Please enter a 10-digit phone number.", 400);
  if (!/^\d{6}$/.test(String(address.pinCode || ""))) return fail("Please enter a 6-digit PIN code.", 400);
  if (!String(address.line || "").trim()) return fail("Please enter your street address.", 400);

  const wanted = new Map();
  for (const { id, qty } of items) {
    const n = Math.floor(Number(qty));
    if (!id || !Number.isFinite(n) || n < 1) return fail("Invalid item in bag.", 400);
    wanted.set(String(id), (wanted.get(String(id)) || 0) + n);
  }

  await connectDB();
  const products = await Product.find({ _id: { $in: [...wanted.keys()] } }).lean();
  if (products.length !== wanted.size) return fail("Some items are no longer available.", 409);

  // Reserve stock item by item; roll back if any item runs out mid-way.
  const reserved = [];
  for (const product of products) {
    const qty = wanted.get(String(product._id));
    const res = await Product.updateOne(
      { _id: product._id, availableQty: { $gte: qty } },
      { $inc: { availableQty: -qty } }
    );
    if (res.modifiedCount !== 1) {
      await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { availableQty: r.qty } })));
      return fail(`Only ${product.availableQty} left of "${product.title}". Please update your bag.`, 409);
    }
    reserved.push({ id: product._id, qty });
  }

  const lines = products.map((p) => ({
    productId: String(p._id),
    title: p.title,
    price: p.price,
    qty: wanted.get(String(p._id)),
    img: p.thumbnail,
  }));
  const { discount, total } = priceLines(lines);

  const fullAddress = [address.line, address.city, address.district, address.state, address.country]
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .join(", ") + ` - ${address.pinCode}`;

  try {
    const order = await Orders.create({
      email: auth.email,
      name: String(address.name || auth.name || "").trim(),
      phone: String(address.phone),
      orderId: "RS-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
      // No payment gateway is wired up: online payments are simulated.
      paymentInfo: paymentMethod === "cod" ? "COD" : "SUCCESS",
      paymentMethod,
      products: lines,
      address: fullAddress,
      amount: total,
      dis: discount,
      status: "SUCCESS",
      deliveryStatus: "Pending",
    });
    productsChanged();
    return ok(order, 201);
  } catch (err) {
    await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { availableQty: r.qty } })));
    throw err;
  }
});
