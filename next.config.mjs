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
  basePath: "/ifcloud",
};

export default nextConfig;
