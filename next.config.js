/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    domains: ["hi.pokkoo.in"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  compress: true,
  poweredByHeader: false,
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimize video loading
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/callgirlvideo.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(mp4|webm|ogg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/_next/static/videos",
              outputPath: "static/videos",
              name: "[name].[hash].[ext]",
            },
          },
        ],
      }
    );
    return config;
  },
};

module.exports = nextConfig;
