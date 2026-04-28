import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  // VISTA FIX: Ensure Vercel doesn't try to bundle these heavy binaries, and forcefully include the binary folder
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
    outputFileTracingIncludes: {
      "/**/*": ["./node_modules/@sparticuz/chromium/bin/**/*"]
    }
  }
};

export default nextConfig;
