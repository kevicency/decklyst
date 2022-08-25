import type { CardData, Faction } from '@/data/cards'
import type { CardEntry, Deck, ManaCurve } from '@/data/deck'
import {
  artifactCount$,
  artifacts$,
  createDeck,
  faction$,
  general$,
  manaCurve$,
  minionCount$,
  minions$,
  spellCount$,
  spells$,
  totalCount$,
} from '@/data/deck'
import type { FC } from 'react'
import { createContext, useContext } from 'react'

export type DeckExpanded = Deck & {
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
  meta?: {
    sharecode?: string
    viewCount?: number
  }
}

const expandDeck = (deck: Deck, meta?: DeckExpanded['meta']): DeckExpanded => ({
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
  meta,
})

const DeckContext = createContext<DeckExpanded>(expandDeck(createDeck()))

export const useDeck = () => useContext(DeckContext)
export const DeckProvider: FC<{
  deck: Deck
  meta?: DeckExpanded['meta']
  children: any
}> = ({ deck, meta, children }) => (
  <DeckContext.Provider value={expandDeck(deck, meta)}>{children}</DeckContext.Provider>
)
