/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ifcloud-storage",
        port: "3001",
      }
    ],
  },
  output: "standalone",
  assetPrefix: process.env.ASSET_PREFIX || "",
};

export default nextConfig;
