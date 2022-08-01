import { groupBy, max, sortBy, sumBy } from 'lodash'
import { CardData, cardDataById } from '../data/cards'
import { CardType, Faction } from '../data/types'

export type CardOccurence = CardData & {
  count: number
}

export type ManaCurveEntry = {
  abs: number
  rel: number
}

export type DeckData = {
  deckcode: string
  deckcodePruned: string
  title: string
  faction: Faction
  general: CardData
  cards: {
    minions: CardOccurence[]
    spells: CardOccurence[]
    artifacts: CardOccurence[]
  }
  counts: {
    total: number
    minions: number
    spells: number
    artifacts: number
  }
  manaCurve: ManaCurveEntry[]
}

const deckcodeRegex = /^(\[(.*)])?((?:[A-Za-z\d+]{4})+(?:[A-Za-z\d+]{3}=|[A-Za-z\d+]{2}==)?)$/

export const normalizeDeckcode = (deckcode?: string) => (deckcode ? deckcode.trim() : undefined)

export const validateDeckcode = (deckcode?: string): deckcode is string =>
  deckcodeRegex.test(deckcode ?? '')

export const parseDeckcode = (deckcode: string): DeckData | null => {
  const [, , maybeTitle, base64] = deckcode.match(deckcodeRegex)!
  const title = maybeTitle ?? 'Untitled'
  const csv = Buffer.from(base64, 'base64').toString()
  const allCards = csv
    .split(',')
    .map((pair) => pair.split(':'))
    .map(([count, id]) => ({ id: +id, count: +count }))
    .filter(({ id }) => cardDataById[id])
    .map(({ id, ...rest }) => ({ ...cardDataById[id], ...rest }))
  const size = sumBy(allCards, (card) => card.count)
  const cardGroups = groupBy(allCards, (card) => card.type) as unknown as Record<
    CardType,
    CardOccurence[]
  >
  const general = cardGroups['GENERAL']?.[0]

  if (!general) {
    return null
  }

  const minions = sortBy(cardGroups['MINION'], ['cost', 'id'])
  const spells = sortBy(cardGroups['SPELL'], ['cost', 'id'])
  const artifacts = sortBy(cardGroups['ARTIFACT'], ['cost', 'id'])

  const manaCurve = [...minions, ...spells, ...artifacts].reduce((acc, card) => {
    acc[card.cost] = (acc[card.cost] ?? 0) + card.count

    return acc
  }, new Array(10).fill(0))
  const manaCurveMax = max(manaCurve)

  return {
    deckcode,
    deckcodePruned: base64,
    title,
    faction: general.faction,
    general,
    cards: {
      minions,
      spells,
      artifacts,
    },
    counts: {
      total: size,
      minions: sumBy(minions, (card) => card.count),
      spells: sumBy(spells, (card) => card.count),
      artifacts: sumBy(artifacts, (card) => card.count),
    },
    manaCurve: manaCurve.map((count) => ({ abs: count, rel: count / manaCurveMax })),
  }
}
