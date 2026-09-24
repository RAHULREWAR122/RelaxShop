import { unstable_cache, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Product } from "@/app/MongoDb/Products";

export const PRODUCTS_TAG = "products";

// Everything a product card, the search box and the bag need; leaves out the long
// description and gallery so every page's payload stays small.
export const LIST_FIELDS = "title price thumbnail rating availableQty category";

// Cached for a minute, and dropped straight away whenever products or stock change.
const CACHE = { tags: [PRODUCTS_TAG], revalidate: 60 };

const plain = (doc) => JSON.parse(JSON.stringify(doc));

// In-stock products for the storefront.
export const getStoreProducts = unstable_cache(
  async () => {
    await connectDB();
    return plain(await Product.find({ availableQty: { $gt: 0 } }).select(LIST_FIELDS).lean());
  },
  ["store-products"],
  CACHE
);

const loadProduct = unstable_cache(
  async (id) => {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    const related = await Product.find({ category: product.category, _id: { $ne: product._id }, availableQty: { $gt: 0 } })
      .select(LIST_FIELDS)
      .limit(8)
      .lean();
    return plain({ product, related });
  },
  ["store-product"],
  CACHE
);

// One product with a few others from its category, or null if the id is unknown.
export async function getProductPage(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return loadProduct(String(id));
}

// Call after anything that adds, edits or removes products or changes stock.
export function productsChanged() {
  try {
    revalidateTag(PRODUCTS_TAG);
  } catch {}
}
