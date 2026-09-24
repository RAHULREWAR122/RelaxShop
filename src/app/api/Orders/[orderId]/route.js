import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson, HttpError } from "@/lib/server/respond";
import { requireUser, requireAdmin } from "@/lib/server/auth";
import { ORDER_STATUSES } from "@/lib/catalog";
import { Orders } from "@/app/MongoDb/Orders";
import { Product } from "@/app/MongoDb/Products";
import { productsChanged } from "@/lib/server/storeProducts";

async function loadOrder(req, id) {
  const auth = requireUser(req);
  await connectDB();
  const order = await Orders.findById(id);
  // Hide other customers' orders behind a 404 rather than a 403.
  if (!order || (auth.role !== "admin" && order.email !== auth.email)) {
    throw new HttpError(404, "Order not found");
  }
  return { auth, order };
}

async function restock(order) {
  await Promise.all(
    (order.products || [])
      .filter((p) => p.productId)
      .map((p) => Product.updateOne({ _id: p.productId }, { $inc: { availableQty: p.qty } }))
  );
  productsChanged();
}

export const GET = handle(async (req, { params }) => {
  const { order } = await loadOrder(req, params.orderId);
  return ok(order);
});

// Admins can move an order through any status; customers can only cancel
// their own order while it is still pending.
export const PUT = handle(async (req, { params }) => {
  const { deliveryStatus } = await readJson(req);
  const { auth, order } = await loadOrder(req, params.orderId);

  if (!ORDER_STATUSES.includes(deliveryStatus)) return fail("Unknown status", 400);
  if (order.deliveryStatus === "Cancelled") return fail("This order was already cancelled.", 400);
  if (auth.role !== "admin") {
    if (deliveryStatus !== "Cancelled") return fail("You can only cancel an order.", 403);
    if (order.deliveryStatus !== "Pending") return fail("This order has already been packed and can't be cancelled.", 400);
  }

  if (deliveryStatus === "Cancelled") await restock(order);
  order.deliveryStatus = deliveryStatus;
  await order.save();
  return ok(order);
});

export const DELETE = handle(async (req, { params }) => {
  requireAdmin(req);
  await connectDB();
  const { deletedCount } = await Orders.deleteOne({ _id: params.orderId });
  return deletedCount ? ok("Deleted") : fail("Order not found", 404);
});
