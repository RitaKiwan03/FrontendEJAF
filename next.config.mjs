/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["leaflet"],
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
