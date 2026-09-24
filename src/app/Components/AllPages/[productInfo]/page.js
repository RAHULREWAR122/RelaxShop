import Link from "next/link";
import { notFound } from "next/navigation";
import { DbUnavailableError } from "@/lib/server/db";
import { getProductPage } from "@/lib/server/storeProducts";
import { categoryByKey, productHref } from "@/lib/catalog";
import EmptyState from "@/components/EmptyState/EmptyState";
import ProductDetail from "./ProductDetail";

// Rendered on first visit, then served from cache and refreshed when products change.
export const revalidate = 60;

// Structured data so search engines can show price and stock in results.
function productJsonLd(product) {
  const category = categoryByKey(product.category);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [...new Set([product.thumbnail, ...(product.imgs || [])].filter(Boolean))],
    description: String(product.desc || "").slice(0, 5000),
    sku: String(product._id),
    ...(category && { category: category.label }),
    brand: { "@type": "Brand", name: "RelaxShop" },
    offers: {
      "@type": "Offer",
      url: productHref(product._id),
      priceCurrency: "INR",
      price: product.price,
      availability: product.availableQty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export async function generateMetadata({ params }) {
  const data = await getProductPage(params.productInfo).catch(() => null);
  if (!data) return { title: "Product" };
  const { product } = data;
  const description = String(product.desc || "").replace(/\s+/g, " ").trim().slice(0, 160);
  return {
    title: product.title,
    description,
    alternates: { canonical: productHref(product._id) },
    openGraph: { type: "website", title: product.title, description, url: productHref(product._id), images: [product.thumbnail] },
    twitter: { card: "summary_large_image", title: product.title, description, images: [product.thumbnail] },
  };
}

export default async function ProductPage({ params }) {
  let data;
  try {
    data = await getProductPage(params.productInfo);
  } catch (err) {
    if (!(err instanceof DbUnavailableError)) throw err;
    console.error(err.message);
    return (
      <div className="container page">
        <EmptyState
          title="We can't load this product right now"
          text={process.env.NODE_ENV !== "production" ? err.message : "Please try again in a moment."}
          action={
            <Link href="/" className="btn">
              Back to home
            </Link>
          }
        />
      </div>
    );
  }
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(data.product)).replace(/</g, "\\u003c") }}
      />
      <ProductDetail product={data.product} related={data.related} />
    </>
  );
}
