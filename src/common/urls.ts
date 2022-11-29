import { env } from '@/env/client.mjs'

export const siteUrl = [
  env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && `https://${env.NEXT_PUBLIC_VERCEL_URL}`,
  env.NEXT_PUBLIC_SITE_URL,
  `http://localhost:${process.env.PORT ?? 3000}`,
].find(Boolean) as string

export const trpcUrl = `${typeof window === 'undefined' ? '' : siteUrl}/api/trpc`

export const deckUrl = (code: string, relative = false) =>
  `${relative ? '' : siteUrl}/decks/${encodeURIComponent(code)}`
export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`
