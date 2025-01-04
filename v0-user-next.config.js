/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  output: 'export',
  distDir: '.next',
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig

