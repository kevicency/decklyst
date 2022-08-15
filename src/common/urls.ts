const env = {
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV,
  deckRendererUrl:
    process.env.NEXT_PUBLIC_DECK_RENDERER_URL ||
    process.env.DECK_RENDERER_URL ||
    'https://duelyst-deck-renderer.azurewebsites.net',
}

export const siteUrl = env.vercelEnv === 'preview' ? `https://${env.vercelUrl}` : env.siteUrl

export const deckUrl = (deckcode: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(deckcode)}`

export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`

export const deckShareUrl = (sharecode: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(sharecode)}`

export const deckRenderUrl = (deckcode: string) =>
  `${env.deckRendererUrl}/api/render?deckcode=${encodeURIComponent(deckcode)}`
