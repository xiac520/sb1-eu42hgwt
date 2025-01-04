/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true
  },
  webpack: (config, { isServer }) => {
    // Cloudflare Workers 不支持 node:crypto
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false
      }
    }
    return config
  }
}

module.exports = nextConfig

