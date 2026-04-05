/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.retrowin.starfrag.co/:path*",
      },
    ];
  },
};

export default nextConfig;
