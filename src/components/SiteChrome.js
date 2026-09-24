"use client";
import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

// The storefront header and footer wrap every page except the admin area.
export default function SiteChrome({ children }) {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/AdminPage")) return children;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
