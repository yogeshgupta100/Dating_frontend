/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to enable dynamic routes
  trailingSlash: true,
  images: {
    // Configure for Vercel deployment
    domains: ['pro.abellarora.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize for Vercel
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
