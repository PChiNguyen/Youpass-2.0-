import type { NextConfig } from "next";

const nextConfig: NextConfig = {allowedDevOrigins: ['172.16.0.2', 'localhost:3000','192.168.1.14'],
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
