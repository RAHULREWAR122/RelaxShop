import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Men's Lowers",
  description: "Comfortable men's joggers, track pants and lowers at RelaxShop, with free delivery.",
  alternates: { canonical: "/Components/AllPages/Men/Lower" },
};

export default function Page() {
  return <CategoryView categoryKey="lower" />;
}
