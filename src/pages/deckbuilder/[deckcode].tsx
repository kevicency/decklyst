import { Deckbuilder } from '@/components/Deckbuilder/Deckbuilder'
import { DeckProvider } from '@/context/useDeck'
import type { DeckcodeContextValue } from '@/context/useDeckcode'
import { DeckcodeProvider } from '@/context/useDeckcode'
import { createDeck } from '@/data/deck'
import type { Deckcode } from '@/data/deckcode'
import {
  addCard,
  encodeDeckcode,
  parseDeckcode,
  removeCard,
  replaceCard,
  updateTitle,
} from '@/data/deckcode'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'

type Props = { deckcode?: string }

const DeckbuilderPage: FC<Props> = (props) => {
  const router = useRouter()
  const deckcode = useMemo(() => parseDeckcode(props.deckcode ?? ''), [props.deckcode])
  const deck = useMemo(() => createDeck(deckcode), [deckcode])

  const updateDeckcode = useCallback(
    async (deckcode: Deckcode) => {
      await router.push(
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
    replaceCard: async (card, replaceWithCard) =>
      await updateDeckcode(replaceCard(deckcode, card, replaceWithCard)),
    updateTitle: async (title) => await updateDeckcode(updateTitle(deckcode, title)),
    clear: async () => await updateDeckcode(parseDeckcode('')),
  }

  const handleShare = async () =>
    await router.push({
      pathname: '/[code]',
      query: { code: encodeDeckcode(deckcode) },
    })

  return (
    <DeckcodeProvider deckcode={deckcode} {...handlers}>
      <DeckProvider deck={deck}>
        <Deckbuilder share={handleShare} />
      </DeckProvider>
    </DeckcodeProvider>
  )
}

export default DeckbuilderPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const deckcode = ctx.query.deckcode as string | undefined
  return {
    props: {
      deckcode,
    },
  }
}