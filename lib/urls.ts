export const deckUrl = (deckcode: string, relative = false) =>
  `${relative ? '' : process.env.NEXT_PUBLIC_SITE_URL}/${encodeURIComponent(deckcode)}`

export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`
