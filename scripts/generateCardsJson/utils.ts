import type { CardType, Faction, Rarity } from '@/data/cards'
import type { ScrapedCard } from './scrapedCards'

export const card = (
  faction: Faction,
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => ({
  id,
  name: title,
  faction,
  cost,
  type,
  rarity,
  spriteName: spriteName ?? undefined,
})

export const lyonar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('lyonar', id, title, cost, type, rarity, spriteName)

export const songhai = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('songhai', id, title, cost, type, rarity, spriteName)

export const vetruvian = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('vetruvian', id, title, cost, type, rarity, spriteName)

export const abyssian = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('abyssian', id, title, cost, type, rarity, spriteName)

export const magmar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('magmar', id, title, cost, type, rarity, spriteName)

export const vanar = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('vanar', id, title, cost, type, rarity, spriteName)

export const neutral = (
  id: number,
  title: string,
  cost: number,
  type: CardType,
  rarity: Rarity,
  spriteName?: string,
): ScrapedCard => card('neutral', id, title, cost, type, rarity, spriteName)
