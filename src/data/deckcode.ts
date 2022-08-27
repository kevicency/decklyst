import { debase64 } from '@/data/base64'
import { cardsById, sortCards } from '@/data/cards'
import type { CardEntry } from '@/data/deck'
import { memoize } from 'lodash'

export type Deckcode = {
  readonly $encoded?: string
  title: string
  cards: Record<number, number>
}

const deckcodeRegex = /^(\[(.*)])?((?:[A-Za-z\d+]{4})+(?:[A-Za-z\d+]{3}=|[A-Za-z\d+]{2}==)?)$/

export const normalizeDeckcode = (deckcode?: string) => (deckcode ? deckcode.trim() : undefined)
export const validateDeckcode = (deckcode?: string): deckcode is string =>
  deckcodeRegex.test(deckcode ?? '')

export const splitDeckcode = (deckcode: string) =>
  (deckcode.match(deckcodeRegex)?.slice(2, 4) ?? ['', '']) as [string, string]

export const addCard = (deckcode: Deckcode, cardId: number, count = 1, max = 3) => ({
  ...deckcode,
  cards: {
    ...deckcode.cards,
    [cardId]: Math.min(max, (deckcode.cards[cardId] ?? 0) + count),
  },
})
export const removeCard = (deckdata: Deckcode, cardId: number, count = 1) => ({
  ...deckdata,
  cards: {
    ...deckdata.cards,
    [cardId]: Math.max(0, (deckdata.cards[cardId] ?? 0) - count),
  },
})
export const replaceCard = (deckdata: Deckcode, cardId: number, replaceWithCardId: number) => ({
  ...deckdata,
  cards: {
    ...deckdata.cards,
    [cardId]: 0,
    [replaceWithCardId]: deckdata.cards[cardId],
  },
})
export const updateTitle = (deckdata: Deckcode, title: string) => ({ ...deckdata, title })

export const parseDeckcode = memoize((deckcode: string) => {
  const [title, base64] = splitDeckcode(deckcode)
  return {
    title: title ?? '',
    $encoded: deckcode,
    cards: debase64(base64)
      .split(',')
      .map((pair) => pair.split(':'))
      .reduce<Deckcode['cards']>(
        (acc, [count, id]) => (id && +count ? { ...acc, [id]: +count } : acc),
        {},
      ),
  }
})

export const encodeDeckcode = (deckcode: Deckcode) => {
  const { title, cards } = deckcode
  const sortedCards = sortCards(
    Object.keys(cards)
      .map((id): CardEntry => ({ ...cardsById[+id], count: cards[+id] }))
      .filter((card) => card && card.count),
  )
  const csv = sortedCards.map((card) => `${card.count}:${card.id}`).join(',')
  const prefix = title ? `[${title}]` : ''

  return `${prefix}${Buffer.from(csv).toString('base64')}`
}
