import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Lehengas",
  description: "Low-cost lehengas for weddings and celebrations at RelaxShop.",
  alternates: { canonical: "/Components/AllPages/Women/Langha" },
};

export default function Page() {
  return <CategoryView categoryKey="langha" />;
}
