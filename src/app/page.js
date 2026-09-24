import HomeView from "./HomeView";
import { SITE_URL as siteUrl } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

// Tells search engines who runs the site, for the brand panel in results.
const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebSite", name: "RelaxShop", url: siteUrl },
  { "@context": "https://schema.org", "@type": "Organization", name: "RelaxShop", url: siteUrl, logo: `${siteUrl}/logo.png` },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeView />
    </>
  );
}
