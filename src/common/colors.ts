import type { Faction, Rarity } from '@/data/cards'

export const colors: Record<Faction | Rarity, string> = {
  lyonar: '#e5c56d',
  songhai: '#db4460',
  vetruvian: '#db8e2b',
  abyssian: '#bf20e1',
  magmar: '#3db586',
  vanar: '#2ba3db',

  neutral: '#f5f5f5',
  common: '#e5e5e5',
  token: '#e5e5e5',
  basic: '#d4d4d4',
  rare: '#396cfd',
  epic: '#bf20e1',
  legendary: '#e39f28',
}

export const lighten = (color: string, percent: number) => {
  const addHash = color[0] === '#'
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt
  const hex = (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)

  return `${addHash ? '#' : ''}${hex}`
}
