const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: 'https://cdn.dnscron.com',
  images: {
    domains: ['cdn.dnscron.com'],
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },
  experimental: {
    h2: true
  },
  compress: true,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

module.exports = withBundleAnalyzer(nextConfig)

