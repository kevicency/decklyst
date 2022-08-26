import type { Deckcode } from '@/data/deckcode'
import type { FC } from 'react'
import { createContext, useContext } from 'react'

export type DeckcodeContextValue = [
  Deckcode,
  {
    addCard: (cardId: number, count?: number) => Deckcode | Promise<Deckcode>
    removeCard: (cardId: number, count?: number) => Deckcode | Promise<Deckcode>
    replaceCard: (cardId: number, replaceWithCardId: number) => Deckcode | Promise<Deckcode>
    updateTitle: (title: string) => Deckcode | Promise<Deckcode>
  },
]
export const DeckcodeContext = createContext<DeckcodeContextValue>({} as DeckcodeContextValue)

export const DeckcodeProvider: FC<
  DeckcodeContextValue[1] & {
    deckcode: Deckcode
    children: any
  }
> = ({ children, deckcode, ...props }) => (
  <DeckcodeContext.Provider value={[deckcode, props]}>{children}</DeckcodeContext.Provider>
)

export const useDeckcode = () => useContext(DeckcodeContext)
