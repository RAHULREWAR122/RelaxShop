import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Men's Shirts",
  description: "Discover affordable men's shirts at RelaxShop: casual, formal and polo shirts at budget-friendly prices.",
  alternates: { canonical: "/Components/AllPages/Men/Shirts" },
};

export default function Page() {
  return <CategoryView categoryKey="shirts" />;
}
