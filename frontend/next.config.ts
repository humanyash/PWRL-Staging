import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "assets.ctfassets.net" },
      { protocol: "https", hostname: "images.ctfassets.net" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/education",
        destination: "/learn",
        permanent: true,
      },
      {
        source: "/education/:slug",
        destination: "/learn/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
