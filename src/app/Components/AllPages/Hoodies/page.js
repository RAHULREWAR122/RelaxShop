import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Hoodies",
  description: "Cosy, affordable hoodies and sweatshirts at RelaxShop.",
  alternates: { canonical: "/Components/AllPages/Hoodies" },
};

export default function Page() {
  return <CategoryView categoryKey="hoodies" />;
}
