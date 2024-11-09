/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ifcloud-storage",
        port: "3001",
        //hostname: "127.0.0.1",
        //port: "3002",
      }
    ],
  },
  output: "standalone",
  assetPrefix: process.env.ASSET_PREFIX,
};

export default nextConfig;
