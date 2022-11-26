import type { CardData, CardType } from '@/data/cards'
import { cardCompareFn } from '@/data/cards'
import type { CardEntry, DeckExpanded } from '@/data/deck'
import { spiritCost$ } from '@/data/deck'
import { merge, sumBy } from 'lodash'
import { useMemo } from 'react'

export type DeckDiff = {
  $left: DeckExpanded
  $right: DeckExpanded
  minions: CardDiff[]
  spells: CardDiff[]
  artifacts: CardDiff[]
  deltas: {
    minions: number
    spells: number
    artifacts: number
  }
  changes: number
  spirit: number
}

export type CardDiff = {
  card: CardData
  left: number
  right: number
  delta: number
}

const diffCards = (leftCards: CardEntry[], rightCards: CardEntry[]): CardDiff[] => {
  const diffMap = rightCards.reduce(
    (map, { count, ...card }) => {
      const left = map.get(card.id)?.left ?? 0
      map.set(card.id, {
        card,
        left,
        right: count,
        delta: count - left,
      })
      return map
    },
    leftCards.reduce((map, { count, ...card }) => {
      map.set(card.id, {
        card,
        left: count,
        right: 0,
        delta: -count,
      })
      return map
    }, new Map<number, CardDiff>()),
  )
  return Array.from(diffMap.values()).sort((a, b) => cardCompareFn(a.card, b.card))
}

export const createDeckDiff = (left: DeckExpanded, right: DeckExpanded) => {
  const cardTypes = ['Minion', 'Spell', 'Artifact'] as CardType[]

  const deckDiff = cardTypes.reduce(
    (acc, cardType) => {
      const cardsPath = `${cardType.toLowerCase()}s` as keyof DeckExpanded
      const diff = diffCards(left[cardsPath] as CardEntry[], right[cardsPath] as CardEntry[])

      return merge(acc, {
        [cardsPath]: diff,
        deltas: {
          [cardsPath]: sumBy(diff, (x) => x.delta),
        },
        changes: (acc.changes ?? 0) + sumBy(diff, (x) => Math.abs(x.delta)),
      })
    },
    {
      spirit: spiritCost$(right) - spiritCost$(left),
      $left: left,
      $right: right,
    } as Partial<DeckDiff>,
  )

  return deckDiff as DeckDiff
}

export const useDeckDiff = (left: DeckExpanded, right: DeckExpanded) =>
  useMemo(() => createDeckDiff(left, right), [left, right])
