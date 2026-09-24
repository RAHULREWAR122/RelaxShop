import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Women's T-Shirts",
  description: "Trendy women's t-shirts and tops at RelaxShop, at prices you'll love.",
  alternates: { canonical: "/Components/AllPages/Women/t_Shirts" },
};

export default function Page() {
  return <CategoryView categoryKey="GTShirt" />;
}
