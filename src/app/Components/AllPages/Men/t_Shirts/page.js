import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Men's T-Shirts",
  description: "Affordable men's t-shirts at RelaxShop: soft cotton tees, graphic prints and everyday basics with free delivery.",
  alternates: { canonical: "/Components/AllPages/Men/t_Shirts" },
};

export default function Page() {
  return <CategoryView categoryKey="mTshirt" />;
}
