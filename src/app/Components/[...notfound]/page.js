import { notFound } from "next/navigation";

// Unknown paths render the root not-found page with a real 404 status.
export default function Page() {
  notFound();
}
