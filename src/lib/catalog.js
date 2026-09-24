// Single source of truth for store categories. `key` matches Product.category.
export const CATEGORIES = [
  { key: "mTshirt", label: "T-Shirts", group: "men", href: "/Components/AllPages/Men/t_Shirts", image: "/navImgs/mT1.webp", blurb: "Soft everyday tees, cut for easy weekends." },
  { key: "shirts", label: "Shirts", group: "men", href: "/Components/AllPages/Men/Shirts", image: "/navImgs/Shirt.webp", blurb: "Crisp casual and formal shirts that take you anywhere." },
  { key: "mJeans", label: "Jeans", group: "men", href: "/Components/AllPages/Men/Jeans", image: "/navImgs/mJ.webp", blurb: "Denim in every wash and fit, built to be lived in." },
  { key: "lower", label: "Lowers", group: "men", href: "/Components/AllPages/Men/Lower", image: "/navImgs/lower.webp", blurb: "Joggers and track pants for slow mornings." },
  { key: "GTShirt", label: "T-Shirts", group: "women", href: "/Components/AllPages/Women/t_Shirts", image: "/navImgs/wT.webp", blurb: "Relaxed tees and tops in easy colours." },
  { key: "GJeans", label: "Jeans", group: "women", href: "/Components/AllPages/Women/Jeans", image: "/navImgs/wJ.webp", blurb: "High-rise, straight or flared: denim you'll reach for daily." },
  { key: "sari", label: "Saris", group: "women", href: "/Components/AllPages/Women/Sari", image: "/navImgs/Sari.webp", blurb: "Graceful drapes for festivals and every day in between." },
  { key: "langha", label: "Lehengas", group: "women", href: "/Components/AllPages/Women/Langha", image: "/navImgs/Lehnga.webp", blurb: "Occasion lehengas with a celebratory flourish." },
  { key: "shoes", label: "Shoes", group: "more", href: "/Components/AllPages/Shoes", image: "/navImgs/shoes.webp", blurb: "Everyday sneakers and shoes for miles of comfort." },
  { key: "hoodies", label: "Hoodies", group: "more", href: "/Components/AllPages/Hoodies", image: "/navImgs/hoodie.webp", blurb: "Cosy layers for cool evenings." },
  { key: "jewelry", label: "Jewellery", group: "more", href: "/Components/AllPages/Jewelry", image: "/navImgs/Jewelry.webp", blurb: "Small, shining finishing touches." },
  { key: "electric", label: "Electronics", group: "more", href: "/Components/AllPages/Electric", image: "/navImgs/watch.webp", blurb: "Watches, audio and gadgets that make life easier." },
  { key: "furniture", label: "Furniture", group: "more", href: "/Components/AllPages/Furniture", image: "/navImgs/furniture.webp", blurb: "Pieces to make your space feel like a retreat." },
];

export const GROUPS = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "more", label: "Home & More" },
];

export function categoryByKey(key) {
  return CATEGORIES.find((c) => c.key === key);
}

export function productHref(id) {
  return `/Components/AllPages/${id}`;
}

export const ORDER_STAGES = ["Pending", "Packed", "Shipped", "Delivered"];
export const ORDER_STATUSES = [...ORDER_STAGES, "Cancelled"];
