/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["picsum.photos"],
  },
};

module.exports = nextConfig;
