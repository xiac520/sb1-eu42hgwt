/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    serverMinification: true,
    serverSourceMaps: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 24000000, // Keep chunks under 24MB
          cacheGroups: {
            default: false,
            vendors: false,
          }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig

