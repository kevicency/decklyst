import type { CardType, Faction, Rarity } from '@/data/cards'
import { noop } from 'lodash'
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useDeferredValue, useState } from 'react'

type CardFilters = {
  faction?: Faction
  query?: string
  mana: number[]
  cardType: CardType[]
  rarity: Rarity[]
  keyword?: string
}
type CardFiltersContextValue = [
  CardFilters,
  { updateCardFilters: (filters: Partial<CardFilters>) => void },
]

const initialCardFilters: CardFilters = { mana: [], rarity: [], cardType: [] }
export const CardFiltersContext = createContext<CardFiltersContextValue>([
  initialCardFilters,
  { updateCardFilters: noop },
])
export const useCardFilters = () => useContext(CardFiltersContext)

export const CardFiltersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [{ query, ...cardFilters }, setCardFilters] = useState<CardFilters>(initialCardFilters)
  const deferredQuery = useDeferredValue(query)

  const updateCardFilters = useCallback(
    (partialFilters: Partial<CardFilters>) => {
      setCardFilters((filters) => ({ ...filters, ...partialFilters }))
    },
    [setCardFilters],
  )

  return (
    <CardFiltersContext.Provider
      value={[{ query: deferredQuery, ...cardFilters }, { updateCardFilters }]}
    >
      {children}
    </CardFiltersContext.Provider>
  )
}
