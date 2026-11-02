import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // The gateway is only reachable from this server, never from a browser.
    // next/image fetches it here, optimises, caches on disk, and serves the
    // result from /_next/image — so the internal address never leaves the host.
    remotePatterns: [
      { protocol: "http", hostname: "api-gateway" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
