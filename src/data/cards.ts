import { partition, sortBy } from 'lodash'

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
  description?: string

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

export const factions: Faction[] = [
  'lyonar',
  'songhai',
  'vetruvian',
  'abyssian',
  'magmar',
  'vanar',
  'neutral',
]

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
