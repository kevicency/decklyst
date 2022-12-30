import { atLeastOneProbability } from '@/common/combinatorics'
import type { CardData, CardType, Faction, Rarity } from '@/data/cards'
import { cardsById, rarityCraftingCost, sortCards } from '@/data/cards'
import type { Deckcode } from '@/data/deckcode'
import { encodeDeckcode, parseDeckcode, splitDeckcode } from '@/data/deckcode'
import type { WithRequired } from '@/types'
import type { Decklyst, User } from '@prisma/client'
import { chain, groupBy, max, memoize, startCase, sumBy } from 'lodash'

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
  meta?: Omit<Decklyst, 'title' | 'cardcode' | 'statsId'> & {
    author?: User | null
  }
}
export type DeckMeta = DeckExpanded['meta']

type DeckLens<T> = (deck: Deck) => T

const $ = <T>(fn: DeckLens<T>) => memoize(fn)

export const createDeck = (deckcode?: string | Deckcode): Deck => {
  if (!deckcode) return { title: '', cards: [], deckcode: '' }

  const { title, cards } = typeof deckcode === 'string' ? parseDeckcode(deckcode) : deckcode

  return {
    title,
    deckcode: encodeDeckcode({ title, cards }),
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
export const deckcodeNormalized$ = $((deck) =>
  encodeDeckcode(parseDeckcode(deckcodeWithoutTitle$(deck))),
)
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
  deckcode: meta?.deckcode ?? deck.deckcode,
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

export function createDeckExpanded(
  deckcode: string | Deckcode,
  meta: DeckExpanded['meta'],
): WithRequired<DeckExpanded, 'meta'>
export function createDeckExpanded(
  deckcode: string | Deckcode,
  meta?: DeckExpanded['meta'] | null,
): DeckExpanded
export function createDeckExpanded(
  deckcode: string | Deckcode,
  meta?: DeckExpanded['meta'] | null,
) {
  return expandDeck(createDeck(deckcode), meta ?? undefined)
}

export function createDeckFromDecklyst(decklyst: Decklyst): WithRequired<DeckExpanded, 'meta'>
export function createDeckFromDecklyst(
  decklyst?: Decklyst | null,
): WithRequired<DeckExpanded, 'meta'> | undefined
export function createDeckFromDecklyst(decklyst?: Decklyst | null) {
  return decklyst ? createDeckExpanded(decklyst.deckcode, decklyst) : undefined
}

export const isDeckExpanded = (deck: Deck | DeckExpanded): deck is DeckExpanded => 'valid' in deck

export const allTags = [
  'ladder',
  'tournament',
  'meta',
  'off-meta',
  'budget',
  'starter',
  's-rank',
  'swarm',
  'mechazor',
  'walls',
  'dying wish',
  'creep',
  'ranged',
  'obelysk',
  'arcanyst',
  'golem',
].sort()

export const humanizeTag = (tag: string) => tag.split('-').map(startCase).join('-')

export const minSpiritCost = 1560
export const maxSpiritCost = 25000

const drawSize = 3
const playableMinionChance = (deck: Deck, mana: number) => {
  const playableCards = deck.cards.filter((card) => card.cardType === 'Minion' && card.mana <= mana)
  const playableCardCount = sumBy(playableCards, (card) => card.count)
  const totalCount = totalCount$(deck) - 1

  const opening = atLeastOneProbability(totalCount, playableCardCount, drawSize)
  const mulligan = atLeastOneProbability(totalCount - drawSize, playableCardCount, drawSize)

  return opening + (1 - opening) * mulligan
}
export const playableMinionOnThePlayChance = (deck: Deck) => playableMinionChance(deck, 2)
export const playableMinionOnTheDrawChance = (deck: Deck) => playableMinionChance(deck, 3)
// export const twoPlayableMinionsOnTheDrawChance = (deck: Deck) => {
//   const [oneDrops, twoDrops, threeDrops] = [1, 2, 3].map((mana) =>
//     deck.cards
//       .filter((card) => card.cardType === 'Minion' && card.mana === mana)
//       .reduce((acc, card) => acc + card.count, 0),
//   )

//   const opening = atLeastOneProbability(totalCount, playableCardCount, drawSize)
//   const mulligan = atLeastOneProbability(totalCount - drawSize, playableCardCount, drawSize)

//   return opening + (1 - opening) * mulligan
// }
