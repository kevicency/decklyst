/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/:deckcode.png',
        destination: '/api/snapshot/:deckcode',
      },
    ]
  },
}

module.exports = nextConfig
