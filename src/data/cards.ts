import { memoize, partition, sortBy } from 'lodash'

export const cards: CardData[] = require('./cards.json')

export interface CardData {
  name: string
  id: number
  cardSet: CardSet
  tribes: string[]
  rarity: Rarity
  relatedCards: number[]
  resource: SpriteResource
  mana: number
  attack?: number
  health?: number
  cardType: CardType
  description: string

  faction: Faction
  factionId: number
  spriteName?: string
}

export type CardSet = 'core'
export type CardType = 'Artifact' | 'General' | 'Minion' | 'Spell'
export type Rarity = 'basic' | 'common' | 'epic' | 'legendary' | 'rare' | 'token'
export type Faction =
  | 'lyonar'
  | 'songhai'
  | 'vetruvian'
  | 'abyssian'
  | 'magmar'
  | 'vanar'
  | 'neutral'

export const factions: Faction[] = ['lyonar', 'songhai', 'vetruvian', 'abyssian', 'magmar', 'vanar']
export const factionsWithNeutral: Faction[] = [...factions, 'neutral']

export interface SpriteResource {
  breathing?: string
  idle: string
  walk?: string
  attack?: string
  damage?: string
  death?: string
  castStart?: string
  castEnd?: string
  castLoop?: string
  cast?: string
  active?: string
}

export const cardsById = cards.reduce(
  (acc, cardJson) => ({
    ...acc,
    [cardJson.id]: cardJson,
  }),
  {} as Record<number, CardData>,
)

export const sortCards = <T extends CardData>(cards: T[], includeGeneral = false): T[] => {
  if (includeGeneral) {
    const [generals, rest] = partition(cards, (card) => card.cardType === 'General')

    return [...generals, ...sortCards(rest)]
  }

  return sortBy(cards, ['mana', 'id'])
}

export const cardCompareFn = (a: CardData, b: CardData) => {
  if (a.mana !== b.mana) return a.mana - b.mana
  if (a.id !== b.id) return a.id - b.id

  return 0
}

export const keywords = [
  'stun',
  'shadow creep',
  'airdrop',
  'celerity',
  'provoke',
  'zeal',
  'rush',
  'ranged',
  'flying',
  'opening gambit',
  'activate',
  'backstab',
  'frenzy',
  'veil',
  'blast',
  'dying wish',
  'rebirth',
  'grow',
  'deathwatch',
]

export const highlightKeywords = memoize((description?: string) => {
  if (!description) return ''
  const regex = new RegExp(keywords.map((keyword) => `\\b${keyword}\\b`).join('|'), 'gi')
  return description.replace(
    regex,
    (match) => `<span class="font-bold text-zinc-100">${match}</span>`,
  )
})
