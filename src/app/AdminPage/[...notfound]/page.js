import Link from "next/link";
import EmptyState from "@/components/EmptyState/EmptyState";

export default function Page() {
  return (
    <EmptyState
      title="This admin page doesn't exist"
      text="Pick a section from the sidebar."
      action={
        <Link href="/AdminPage/allProducts" className="btn">
          Go to products
        </Link>
      }
    />
  );
}
