import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-hook-form"],
  compiler: {
    // Remove console.log calls in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Optimise lucide-react imports: only bundle the icons that are actually
    // imported instead of the entire icon library (~4 MB)
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
};

export default nextConfig;
