// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

import { withSuperjson } from 'next-superjson'

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE ? 'standalone' : undefined,
  reactStrictMode: false,
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
  async headers() {
    return [
      {
        source: '/api/snapshot/:deckcode*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
}

export default withSuperjson()(nextConfig)
