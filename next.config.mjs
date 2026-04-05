/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    // Skip rewrites in development to allow MSW to intercept requests
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "https://api.retrowin.starfrag.co/:path*",
      },
    ];
  },
};

export default nextConfig;
