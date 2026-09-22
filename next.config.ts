import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "127.0.0.1:3000", "localhost:3000", "10.138.183.98", "10.138.183.98:3000", "10.57.228.98", "10.57.228.98:3000"],
};

export default nextConfig;
