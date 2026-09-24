import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Jewellery",
  description: "Affordable jewellery and accessories at RelaxShop.",
  alternates: { canonical: "/Components/AllPages/Jewelry" },
};

export default function Page() {
  return <CategoryView categoryKey="jewelry" />;
}
