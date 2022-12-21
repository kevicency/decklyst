import type { Deck } from '@/data/deck'
import { noop } from 'lodash'
import { createContext, useContext, useState } from 'react'

type SpriteLoaderContextValue = {
  allSpritesLoaded: boolean
  setSpriteLoaded: (cardId: number) => void
}

const SpriteLoaderContext = createContext<SpriteLoaderContextValue>({
  allSpritesLoaded: true,
  setSpriteLoaded: noop,
})

export const SpriteLoaderProvider = ({ deck, children }: { deck?: Deck; children: any }) => {
  const [requestedImageIds] = useState(new Set(deck?.cards.map(({ id }) => id) ?? []))
  const [loadedImageIds, setLoadedImageIds] = useState(new Set<number>())
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <SpriteLoaderContext.Provider
      value={{
        allSpritesLoaded: isLoaded,
        setSpriteLoaded: (id) => {
          const next = loadedImageIds.add(id)
          setLoadedImageIds(next)
          setIsLoaded(next.size === requestedImageIds.size)
        },
      }}
    >
      {children}
    </SpriteLoaderContext.Provider>
  )
}

export const useSpriteLoader = () => useContext(SpriteLoaderContext)
