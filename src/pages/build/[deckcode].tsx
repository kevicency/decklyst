import { Deckbuilder } from '@/components/Deckbuilder/Deckbuilder'
import { DeckMetadata } from '@/components/DeckMetadata'
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
  validateDeckcode,
} from '@/data/deckcode'
import type { Deckinfo } from '@prisma/client'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'

type Props = { deckcode?: string }

const BuildPage: FC<Props> = (props) => {
  const router = useRouter()
  const deckcodeFromRoute = (router.query.deckcode as string) ?? props.deckcode ?? ''
  const deckcode = useMemo(() => parseDeckcode(deckcodeFromRoute), [deckcodeFromRoute])
  const deck = useMemo(() => createDeck(deckcode), [deckcode])

  const updateDeckcode = useCallback(
    async (deckcode: Deckcode) => {
      const encodedDeckcode = encodeDeckcode(deckcode)
      await router.push(
        encodedDeckcode
          ? {
              pathname: '/build/[deckcode]',
              query: { deckcode: encodedDeckcode },
            }
          : { pathname: '/build' },
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
    replace: async (deckcode) => await updateDeckcode(parseDeckcode(deckcode)),
  }

  const handleShare = async () =>
    await router.push({
      pathname: '/[code]',
      query: { code: encodeDeckcode(deckcode) },
    })

  const handleImport = async (deckcode: string) => {
    if (validateDeckcode(deckcode)) {
      return handlers.replace(deckcode)
    }
    const deckinfo = await fetch(`/api/deckinfo/${deckcode}`).then(
      (res) => res.json() as Promise<Deckinfo | null>,
    )
    if (deckinfo?.deckcode) {
      return handlers.replace(deckinfo.deckcode)
    }
    return Promise.reject(new Error('Invalid deckcode'))
  }

  return (
    <DeckcodeProvider deckcode={deckcode} {...handlers}>
      <DeckProvider deck={deck}>
        <>
          <DeckMetadata />
          <Deckbuilder onShare={handleShare} onImport={handleImport} />
        </>
      </DeckProvider>
    </DeckcodeProvider>
  )
}

export default BuildPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const deckcode = ctx.query.deckcode as string | undefined
  return {
    props: {
      deckcode,
    },
  }
}
