export type Faction =
  | 'lyonar'
  | 'songhai'
  | 'vetruvian'
  | 'abyssian'
  | 'magmar'
  | 'vanar'
  | 'neutral'
export type CardType = 'GENERAL' | 'MINION' | 'SPELL' | 'ARTIFACT'

export interface CardData {
  id: number
  title: string
  faction: Faction
  type: CardType
  cost: number
}

export const lyonar = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'lyonar',
  cost,
  type,
})
export const songhai = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'songhai',
  cost,
  type,
})
export const vetruvian = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'vetruvian',
  cost,
  type,
})
export const abyssian = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'abyssian',
  cost,
  type,
})
export const magmar = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'magmar',
  cost,
  type,
})
export const vanar = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'vanar',
  cost,
  type,
})
export const neutral = (id: number, title: string, cost: number, type: CardType): CardData => ({
  id,
  title,
  faction: 'neutral',
  cost,
  type,
})
