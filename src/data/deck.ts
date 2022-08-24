import type { CardType, Faction, Rarity } from '@/data/cards'
import { cardDataById, sortCards } from '@/data/cards'
import type { Deckcode } from '@/data/deckcode'
import { parseDeckcode, splitDeckcode } from '@/data/deckcode'
import { groupBy, max, memoize, sumBy } from 'lodash'

export type Card = {
  id: number
  title: string
  faction: Faction
  type: CardType
  cost: number
  rarity: Rarity
  spriteName?: string | null
}
export type CardEntry = Card & { count: number }
export type Deck = {
  title: string
  deckcode: string
  cards: CardEntry[]
}
export type ManaCurve = Array<{
  abs: number
  rel: number
}>

type DeckLens<T> = (deck: Deck) => T

const $ = <T>(fn: DeckLens<T>) => memoize(fn)

export const createDeck = (deckcode?: string | Deckcode): Deck => {
  if (!deckcode) return { title: 'Untitled', cards: [], deckcode: '' }

  const { title, $from, ...cards } =
    typeof deckcode === 'string' ? parseDeckcode(deckcode) : deckcode

  return {
    title,
    deckcode: $from!,
    cards: sortCards(
      Object.keys(cards)
        .map((id) => +id)
        .filter((id) => cardDataById[id])
        .map((id) => ({ ...cardDataById[id], count: cards[id] })),
      true,
    ),
  }
}

export const title$ = $(({ title }) => title)
export const cards$ = $(({ cards }) => cards)
export const deckcode$ = $(({ deckcode }) => deckcode)
export const deckcodeWithoutTitle$ = $(({ deckcode }) => splitDeckcode(deckcode)[1])
export const general$ = $((deck) => deck.cards.find((card) => card.type === 'GENERAL'))
export const faction$ = $((deck) => general$(deck)?.faction)

const cardGroups$ = $(
  (deck) => groupBy(deck.cards, (card) => card.type) as unknown as Record<CardType, CardEntry[]>,
)
export const minions$ = $((deck) => sortCards(cardGroups$(deck)['MINION'] ?? []))
export const spells$ = $((deck) => sortCards(cardGroups$(deck)['SPELL'] ?? []))
export const artifacts$ = $((deck) => sortCards(cardGroups$(deck)['ARTIFACT'] ?? []))
export const manaCurve$ = $((deck): ManaCurve => {
  const manaCurve = [...minions$(deck), ...spells$(deck), ...artifacts$(deck)].reduce(
    (acc, card) => {
      acc[card.cost] = (acc[card.cost] ?? 0) + card.count

      return acc
    },
    new Array(10).fill(0),
  )
  const manaCurveMax = max(manaCurve)
  return manaCurve.map((count) => ({ abs: count, rel: count / manaCurveMax }))
})

export const totalCount$ = $((deck) => sumBy(deck.cards, (card) => card.count))
export const minionCount$ = $((deck) => sumBy(minions$(deck), (card) => card.count))
export const spellCount$ = $((deck) => sumBy(spells$(deck), (card) => card.count))
export const artifactCount$ = $((deck) => sumBy(artifacts$(deck), (card) => card.count))
