import { SITE_URL } from "@/lib/site";

// Keep account, bag, checkout and admin pages out of search results.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/AdminPage",
        "/Components/Auth",
        "/Components/Cart",
        "/Components/Checkout",
        "/Components/Orders",
        "/Components/UserProfile",
        "/Components/forgotPassword",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
