import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  // VISTA FIX: Ensure Vercel doesn't try to bundle these heavy binaries
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  }
};

export default nextConfig;
