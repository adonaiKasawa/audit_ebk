/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `d31uetu06bkcms.cloudfront.net`,
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },
  async rewrites() {
    return [
      {
        source: "/church",
        destination: "http://localhost:3001/church",
      },
      {
        source: "/church/:path*",
        destination: "http://localhost:3001/church/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
