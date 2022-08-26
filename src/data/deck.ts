import type { CardData, CardType } from '@/data/cards'
import { cardsById, sortCards } from '@/data/cards'
import type { Deckcode } from '@/data/deckcode'
import { parseDeckcode, splitDeckcode } from '@/data/deckcode'
import { groupBy, max, memoize, sumBy } from 'lodash'

export type CardEntry = CardData & { count: number }
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
  if (!deckcode) return { title: '', cards: [], deckcode: '' }

  const { title, $encoded, cards } =
    typeof deckcode === 'string' ? parseDeckcode(deckcode) : deckcode

  return {
    title,
    deckcode: $encoded!,
    cards: sortCards(
      Object.keys(cards)
        .map((id) => +id)
        .filter((id) => cardsById[id])
        .map((id) => ({ ...cardsById[id], count: cards[id] })),
      true,
    ),
  }
}

export const title$ = $(({ title }) => title)
export const cards$ = $(({ cards }) => cards)
export const deckcode$ = $(({ deckcode }) => deckcode)
export const deckcodeWithoutTitle$ = $(({ deckcode }) => splitDeckcode(deckcode)[1])
export const general$ = $((deck) => deck.cards.find((card) => card.cardType === 'General'))
export const faction$ = $((deck) => general$(deck)?.faction)

const cardGroups$ = $(
  (deck) =>
    groupBy(deck.cards, (card) => card.cardType) as unknown as Record<CardType, CardEntry[]>,
)
export const minions$ = $((deck) => sortCards(cardGroups$(deck)['Minion'] ?? []))
export const spells$ = $((deck) => sortCards(cardGroups$(deck)['Spell'] ?? []))
export const artifacts$ = $((deck) => sortCards(cardGroups$(deck)['Artifact'] ?? []))
export const manaCurve$ = $((deck): ManaCurve => {
  const manaCurve = [...minions$(deck), ...spells$(deck), ...artifacts$(deck)].reduce(
    (acc, card) => {
      acc[card.mana] = (acc[card.mana] ?? 0) + card.count

      return acc
    },
    new Array(10).fill(0),
  )
  const manaCurveMax = max(manaCurve) || 1
  return manaCurve.map((count) => ({ abs: count, rel: count / manaCurveMax }))
})

export const totalCount$ = $((deck) => sumBy(deck.cards, (card) => card.count))
export const minionCount$ = $((deck) => sumBy(minions$(deck), (card) => card.count))
export const spellCount$ = $((deck) => sumBy(spells$(deck), (card) => card.count))
export const artifactCount$ = $((deck) => sumBy(artifacts$(deck), (card) => card.count))
