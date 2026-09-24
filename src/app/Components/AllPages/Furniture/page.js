import CategoryView from "@/components/CategoryView/CategoryView";

export const metadata = {
  title: "Furniture",
  description: "Inexpensive furniture for homes and small apartments at RelaxShop.",
  alternates: { canonical: "/Components/AllPages/Furniture" },
};

export default function Page() {
  return <CategoryView categoryKey="furniture" />;
}
