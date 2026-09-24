import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Shoes",
  description: "Budget-friendly shoes and sneakers for everyday wear at RelaxShop.",
  alternates: { canonical: "/Components/AllPages/Shoes" },
};

export default function Page() {
  return <CategoryView categoryKey="shoes" />;
}
