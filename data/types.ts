export type Faction =
  | 'lyonar'
  | 'songhai'
  | 'vetruvian'
  | 'abyssian'
  | 'magmar'
  | 'vanar'
  | 'neutral'
export type CardType = 'GENERAL' | 'MINION' | 'SPELL' | 'ARTIFACT'
export type Rarity = 'BASIC' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export interface CardData {
  id: number
  title: string
  faction: Faction
  type: CardType
  cost: number
  rarity?: Rarity
  spriteName?: string | null
}

const normalizeSpriteName = (name: string | undefined | null): string | null =>
  name ? name.replace('d2_', '') : null

export const card = (
  faction: Faction,
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => ({
  id,
  title,
  faction,
  cost,
  type,
  rarity,
  spriteName: normalizeSpriteName(spriteName),
})

export const lyonar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('lyonar', id, title, cost, type, rarity, spriteName)

export const songhai = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('songhai', id, title, cost, type, rarity, spriteName)

export const vetruvian = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('vetruvian', id, title, cost, type, rarity, spriteName)

export const abyssian = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('abyssian', id, title, cost, type, rarity, spriteName)

export const magmar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('magmar', id, title, cost, type, rarity, spriteName)

export const vanar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('vanar', id, title, cost, type, rarity, spriteName)

export const neutral = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): CardData => card('neutral', id, title, cost, type, rarity, spriteName)
