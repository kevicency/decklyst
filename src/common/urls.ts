const env = {
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL,
  siteUrl: process.env.NEXT_PUBLIC_URL || process.env.URL || 'http://localhost:3000',
  vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV,
}

export const siteUrl = env.vercelEnv === 'preview' ? `https://${env.vercelUrl}` : env.siteUrl

export const deckUrl = (deckcode: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(deckcode)}`

export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`

export const deckShortUrl = (shortId: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(shortId)}`
