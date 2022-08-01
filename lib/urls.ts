const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
export const siteUrl = vercelUrl ? `https://${vercelUrl}` : 'https://localhost:3000'
export const deckUrl = (deckcode: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(deckcode)}`

export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`
