import { Fraunces, Manrope } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { DataProvider } from "./Redux/provider";
import SiteChrome from "@/components/SiteChrome";
import { getStoreProducts } from "@/lib/server/storeProducts";
import { SITE_URL } from "@/lib/site";

// Pages are pre-rendered with the product list and refreshed at most once a minute.
export const revalidate = 60;

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RelaxShop",
    images: [{ url: "/logo1.png", width: 2000, height: 1500, alt: "RelaxShop" }],
  },
  title: {
    default: "RelaxShop | Affordable fashion, gadgets & home",
    template: "%s | RelaxShop",
  },
  description:
    "Shop affordable fashion, electronics and home furniture at RelaxShop. Men's and women's clothing, saris, lehengas, shoes, jewellery and more, with free delivery and bulk-order discounts.",
  keywords:
    "RelaxShop, affordable fashion, budget electronics, cheap furniture, men's t-shirts, women's jeans, saris, lehengas, shoes, jewellery, discount clothing",
  applicationName: "RelaxShop",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5efe6",
};

export default async function RootLayout({ children }) {
  // If the database can't be reached, the browser fetches the list itself instead.
  const products = await getStoreProducts().catch((err) => {
    console.error(err.message);
    return null;
  });

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <DataProvider initialProducts={products}>
          <SiteChrome>{children}</SiteChrome>
        </DataProvider>
      </body>
    </html>
  );
}
