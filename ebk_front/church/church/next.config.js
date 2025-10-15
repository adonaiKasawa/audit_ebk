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
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // ✅ Ajout ici pour autoriser les vidéos
    },
  },
  // basePath: '/church',
  // assetPrefix: '/church',
};

module.exports = nextConfig;
