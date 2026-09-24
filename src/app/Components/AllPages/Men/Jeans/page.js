import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Men's Jeans",
  description: "Shop men's jeans at RelaxShop: slim, straight and relaxed fits in every wash, at low prices.",
  alternates: { canonical: "/Components/AllPages/Men/Jeans" },
};

export default function Page() {
  return <CategoryView categoryKey="mJeans" />;
}
