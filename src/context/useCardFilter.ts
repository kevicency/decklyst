import type { Faction } from '@/data/cards'
import { createContext, useContext } from 'react'

type CardFilterContextValue = {
  faction?: Faction
  query?: string
}

export const CardFilterContext = createContext<CardFilterContextValue>({})
export const useCardFilter = () => useContext(CardFilterContext)
