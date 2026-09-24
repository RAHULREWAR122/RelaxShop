/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Let browsers keep the shop's static images for a week instead of re-checking each visit.
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return ["/navImgs/:path*", "/shopHeroImgs/:path*", "/logo.png", "/logo1.png"].map((source) => ({ source, headers: week }));
  },
};

export default nextConfig;
