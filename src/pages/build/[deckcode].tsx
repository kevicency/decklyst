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
} from '@/data/deckcode'
import { noop } from 'lodash'
import type { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const useRouteQuery = (deckcode: string | null) => {
  const { query, replace, pathname } = useRouter()
  const deckcodeFromRoute = (query.deckcode as string | undefined) ?? deckcode ?? ''
  const [baseDeckcode] = useState((query.base as string | undefined) ?? deckcodeFromRoute)

  useEffect(() => {
    if (baseDeckcode !== query.base) {
      replace(
        {
          pathname,
          query: {
            ...query,
            base: baseDeckcode,
          },
        },
        undefined,
        { shallow: true },
      ).catch(noop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { deckcodeFromRoute, baseDeckcode }
}

const BuildPage: FC<Props> = (props) => {
  const router = useRouter()
  const { deckcodeFromRoute, baseDeckcode } = useRouteQuery(props.deckcode)
  const deckcode = useMemo(() => parseDeckcode(deckcodeFromRoute), [deckcodeFromRoute])
  const deck = useMemo(() => createDeck(deckcode), [deckcode])

  const updateDeckcode = useCallback(
    async (deckcode: Deckcode) => {
      const encodedDeckcode = encodeDeckcode(deckcode)
      await router.push(
        encodedDeckcode
          ? {
              pathname: '/build/[deckcode]',
              query: {
                ...router.query,
                deckcode: encodedDeckcode,
              },
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

  return (
    <DeckcodeProvider deckcode={deckcode} baseDeckcode={baseDeckcode} {...handlers}>
      <DeckProvider deck={deck}>
        <>
          <DeckMetadata />
          <Deckbuilder />
        </>
      </DeckProvider>
    </DeckcodeProvider>
  )
}

export default BuildPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const deckcode = (ctx.query.deckcode as string | undefined) ?? null

  return {
    props: {
      deckcode,
    },
  }
}
