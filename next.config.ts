import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "robohash.org", "i.pinimg.com"],
  },
};

export default nextConfig;
