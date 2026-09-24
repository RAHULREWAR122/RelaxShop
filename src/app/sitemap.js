import { CATEGORIES, productHref } from "@/lib/catalog";
import { getStoreProducts } from "@/lib/server/storeProducts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const products = await getStoreProducts().catch(() => []);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}${c.href}`, changeFrequency: "daily", priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}${productHref(p._id)}`, changeFrequency: "weekly", priority: 0.6 })),
  ];
}
