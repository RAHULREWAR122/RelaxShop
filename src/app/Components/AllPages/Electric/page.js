import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Electronics",
  description: "Affordable electronics at RelaxShop: watches, headphones and gadgets with great value.",
  alternates: { canonical: "/Components/AllPages/Electric" },
};

export default function Page() {
  return <CategoryView categoryKey="electric" />;
}
