import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Server actions cap the body at 1 MB by default and uploads travel
    // through one. The gateway enforces the real limit.
    serverActions: { bodySizeLimit: "10mb" },
  },
  images: {
    // The gateway is only reachable from this server, never from a browser.
    // next/image fetches it here, optimises, caches on disk, and serves the
    // result from /_next/image — so the internal address never leaves the host.
    //
    // Next 16 refuses hosts that resolve to a private IP, which is every
    // container on this network. The path narrows it to the photo bytes so the
    // optimiser cannot be pointed at the rest of the API.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "http", hostname: "api-gateway", pathname: "/api/photos/**" },
      { protocol: "http", hostname: "localhost", pathname: "/api/photos/**" },
    ],
  },
};

export default nextConfig;
