/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // path: `${process.env.ASSET_PREFIX}/_next/image`,
    path: process.env.ASSET_PREFIX ? `${process.env.ASSET_PREFIX}/_next/image` : "/_next/image",
    remotePatterns: [
      {
        hostname: "ifcloud-storage",
        port: "3000",
        //hostname: "127.0.0.1",
        //port: "3002",
      },
    ],
  },
  assetPrefix: process.env.ASSET_PREFIX,
};

export default nextConfig;
