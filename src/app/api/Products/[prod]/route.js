import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireAdmin } from "@/lib/server/auth";
import { cleanProduct } from "@/lib/server/products";
import { Product } from "@/app/MongoDb/Products";
import { productsChanged } from "@/lib/server/storeProducts";

export const GET = handle(async (req, { params }) => {
  await connectDB();
  const product = await Product.findById(params.prod).lean();
  return product ? ok(product) : fail("Product not found", 404);
});

export const PUT = handle(async (req, { params }) => {
  requireAdmin(req);
  const { data, error } = cleanProduct(await readJson(req), { partial: true });
  if (error) return fail(error, 400);

  await connectDB();
  const product = await Product.findByIdAndUpdate(params.prod, data, { new: true, runValidators: true });
  if (product) productsChanged();
  return product ? ok(product) : fail("Product not found", 404);
});

export const DELETE = handle(async (req, { params }) => {
  requireAdmin(req);
  await connectDB();
  const { deletedCount } = await Product.deleteOne({ _id: params.prod });
  if (deletedCount) productsChanged();
  return deletedCount ? ok("Deleted") : fail("Product not found", 404);
});
