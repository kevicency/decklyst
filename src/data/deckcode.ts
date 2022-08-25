import { debase64 } from '@/data/base64'
import { memoize } from 'lodash'

export type Deckcode = {
  $from?: string
  title: string
  [id: number]: number
}

const deckcodeRegex = /^(\[(.*)])?((?:[A-Za-z\d+]{4})+(?:[A-Za-z\d+]{3}=|[A-Za-z\d+]{2}==)?)$/

export const normalizeDeckcode = (deckcode?: string) => (deckcode ? deckcode.trim() : undefined)
export const validateDeckcode = (deckcode?: string): deckcode is string =>
  deckcodeRegex.test(deckcode ?? '')

export const splitDeckcode = (deckcode: string) =>
  (deckcode.match(deckcodeRegex)?.slice(2, 4) ?? ['', '']) as [string, string]

export const addCard = (deckcode: Deckcode, cardId: number, count = 1, max = 3) => ({
  ...deckcode,
  [cardId]: Math.min(max, (deckcode[cardId] ?? 0) + count),
})
export const removeCard = (deckdata: Deckcode, cardId: number, count = 1) => ({
  ...deckdata,
  [cardId]: Math.max(0, (deckdata[cardId] ?? 0) - count),
})
export const updateTitle = (deckdata: Deckcode, title: string) => ({ ...deckdata, title })

export const parseDeckcode = memoize((deckcode: string) => {
  const [title, base64] = splitDeckcode(deckcode)
  return debase64(base64)
    .split(',')
    .map((pair) => pair.split(':'))
    .reduce<Deckcode>((acc, [count, id]) => ({ ...acc, [id]: +count }), {
      title: title ?? 'Untitled',
      $from: deckcode,
    })
})

export const encodeDeckcode = (deckcode: Deckcode) => {
  const { title, $from, ...cards } = deckcode
  const csv = Object.keys(cards)
    .sort()
    .map((id) => [+id, deckcode[+id]] as const)
    .filter(([id, count]) => id && count)
    .map(([id, count]) => `${count}:${id}`)
    .join(',')

  return `[${title}]${Buffer.from(csv).toString('base64')}`
}
