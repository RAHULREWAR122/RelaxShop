import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Saris",
  description: "Shop beautiful, affordable saris at RelaxShop for festivals, weddings and every day.",
  alternates: { canonical: "/Components/AllPages/Women/Sari" },
};

export default function Page() {
  return <CategoryView categoryKey="sari" />;
}
