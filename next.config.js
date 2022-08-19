/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE ? 'standalone' : 'serverless',
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/:deckcode.png',
        destination: '/api/snapshot/:deckcode',
      },
      {
        source: '/i/:deckcode.png',
        destination: '/api/snapshot/:deckcode',
      },
    ]
  },
}

module.exports = nextConfig
