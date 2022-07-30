import { CardData, cardDataById } from '../data/cards'
import { groupBy, max, sortBy, sumBy } from 'lodash'
import { CardType, Faction } from '../data/types'

type CardOccurence = CardData & {
  count: number
}

export type DeckData = {
  title: string
  size: number
  faction: Faction
  general: CardData
  cards: {
    minions: CardOccurence[]
    spells: CardOccurence[]
    artifacts: CardOccurence[]
  }
  manaCurve: { abs: number; rel: number }[]
}

const deckcodeRegex = /^(\[(.*)])((?:[A-Za-z\d+]{4})+(?:[A-Za-z\d+]{3}=|[A-Za-z\d+]{2}==)?)$/

export const validateDeckcode = (deckcode?: string): deckcode is string =>
  deckcodeRegex.test(deckcode ?? '')

export const parseDeckcode = (deckcode: string): DeckData | null => {
  const [, , title, base64] = deckcode.match(deckcodeRegex)!
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
    title,
    size,
    faction: general.faction,
    general,
    cards: {
      minions,
      spells,
      artifacts,
    },
    manaCurve: manaCurve.map((count) => ({ abs: count, rel: count / manaCurveMax })),
  }
}
