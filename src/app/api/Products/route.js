import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { getAuth, requireAdmin } from "@/lib/server/auth";
import { cleanProduct } from "@/lib/server/products";
import { Product } from "@/app/MongoDb/Products";
import { getStoreProducts, productsChanged } from "@/lib/server/storeProducts";

// Public: in-stock products, optionally ?category=shirts.
// Admins can pass ?all=1 to include sold-out items.
export const GET = handle(async (req) => {
  const params = req.nextUrl.searchParams;
  const all = params.get("all") && getAuth(req)?.role === "admin";
  // The plain storefront list is served from the shared cache.
  if (!all && !params.get("category")) return ok(await getStoreProducts());

  const filter = {};
  if (!all) filter.availableQty = { $gt: 0 };
  if (params.get("category")) filter.category = params.get("category");

  await connectDB();
  const products = await Product.find(filter).lean();
  return ok(products);
});

export const POST = handle(async (req) => {
  requireAdmin(req);
  const body = await readJson(req);
  const { data, error } = cleanProduct(body.formData ?? body, { partial: false });
  if (error) return fail(error, 400);

  await connectDB();
  const product = await Product.create(data);
  productsChanged();
  return ok(product, 201);
});
