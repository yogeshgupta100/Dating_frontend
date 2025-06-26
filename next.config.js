/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to enable true dynamic routing
  trailingSlash: true,
  images: {
    domains: ['pro.abellarora.com'], // Add your image domains here
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
