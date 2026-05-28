import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@codemelt/core",
    "@codemelt/shared"
  ]
};

export default nextConfig;
