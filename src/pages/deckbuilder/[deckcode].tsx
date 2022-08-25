import { Deckbuilder } from '@/components/Deckbuilder/Deckbuilder'
import { DeckProvider } from '@/context/useDeck'
import type { DeckcodeContextValue } from '@/context/useDeckcode'
import { DeckcodeProvider } from '@/context/useDeckcode'
import { createDeck } from '@/data/deck'
import type { Deckcode } from '@/data/deckcode'
import { addCard, encodeDeckcode, parseDeckcode, removeCard, updateTitle } from '@/data/deckcode'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'

const DeckbuilderPage: FC = () => {
  const router = useRouter()
  const deckcode = useMemo(
    () => parseDeckcode((router.query.deckcode as string) ?? ''),
    [router.query.deckcode],
  )
  const deck = useMemo(() => createDeck(deckcode), [deckcode])

  const updateDeckcode = useCallback(
    async (deckcode: Deckcode) => {
      await router.replace(
        {
          pathname: '/deckbuilder/[deckcode]',
          query: { deckcode: encodeDeckcode(deckcode) },
        },
        undefined,
        { shallow: true },
      )
      return deckcode
    },
    [router],
  )

  const handlers: DeckcodeContextValue[1] = {
    addCard: async (card, count) => await updateDeckcode(addCard(deckcode, card, count)),
    removeCard: async (card, count) => await updateDeckcode(removeCard(deckcode, card, count)),
    updateTitle: async (title) => await updateDeckcode(updateTitle(deckcode, title)),
  }

  return (
    <DeckcodeProvider deckcode={deckcode} {...handlers}>
      <DeckProvider deck={deck}>
        <Deckbuilder />
      </DeckProvider>
    </DeckcodeProvider>
  )
}

export default DeckbuilderPage
