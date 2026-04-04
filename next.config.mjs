/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://retrowin-api.starfrag.co/:path*",
      },
    ];
  },
};

export default nextConfig;
