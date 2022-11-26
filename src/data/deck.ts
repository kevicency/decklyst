import type { CardData, CardType, Faction, Rarity } from '@/data/cards'
import { cardsById, rarityCraftingCost, sortCards } from '@/data/cards'
import type { Deckcode } from '@/data/deckcode'
import { parseDeckcode, splitDeckcode } from '@/data/deckcode'
import { chain, groupBy, max, memoize, sumBy } from 'lodash'

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

export type DeckExpanded = Deck & {
  get valid(): boolean
  faction: Faction
  general: CardData
  minions: CardEntry[]
  spells: CardEntry[]
  artifacts: CardEntry[]
  counts: {
    total: number
    minions: number
    spells: number
    artifacts: number
  }
  manaCurve: ManaCurve
  spiritCost: number
  meta?: {
    sharecode: string
    version: number
    views: number
    likes: number
    archetype?: string | null
    author?: {
      id: string
      name: string | null
    } | null
    createdAt: Date
    updatedAt: Date

    viewCount?: number
  }
}
export type DeckMeta = DeckExpanded['meta']

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
export const spiritCost$ = $((deck) =>
  chain(deck.cards)
    .groupBy((card) => card.rarity)
    .entries()
    .map(([rarity, cards]) => [rarity as Rarity, sumBy(cards, ({ count }) => count)] as const)
    .map(([rarity, count]) => rarityCraftingCost(rarity) * count)
    .sum()
    .value(),
)

export const expandDeck = (deck: Deck, meta?: DeckExpanded['meta']): DeckExpanded => ({
  ...deck,
  faction: faction$(deck) ?? 'neutral',
  general: general$(deck)!,
  minions: minions$(deck),
  spells: spells$(deck),
  artifacts: artifacts$(deck),
  counts: {
    total: totalCount$(deck),
    minions: minionCount$(deck),
    spells: spellCount$(deck),
    artifacts: artifactCount$(deck),
  },
  manaCurve: manaCurve$(deck),
  spiritCost: spiritCost$(deck),
  meta,
  get valid(): boolean {
    return !!this.general
  },
})
export const createDeckExpanded = (
  deckcode?: string | Deckcode,
  meta?: DeckExpanded['meta'],
): DeckExpanded => expandDeck(createDeck(deckcode), meta)

export const isDeckExpanded = (deck: Deck | DeckExpanded): deck is DeckExpanded => 'valid' in deck
