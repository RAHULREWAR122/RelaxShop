import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Women's Jeans",
  description: "Affordable women's jeans at RelaxShop: high-rise, straight and flared denim.",
  alternates: { canonical: "/Components/AllPages/Women/Jeans" },
};

export default function Page() {
  return <CategoryView categoryKey="GJeans" />;
}
