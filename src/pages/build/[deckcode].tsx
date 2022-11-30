import { DeckbuilderAside, DeckbuilderMain } from '@/components/Deckbuilder'
import { DeckMetadata } from '@/components/DeckMetadata'
import { CardFiltersProvider } from '@/context/useCardFilters'
import { DeckProvider } from '@/context/useDeck'
import type { DeckcodeContextValue } from '@/context/useDeckcode'
import { DeckcodeProvider } from '@/context/useDeckcode'
import { createDeckExpanded, createDeckFromDecklyst } from '@/data/deck'
import type { Deckcode } from '@/data/deckcode'
import {
  addCard,
  encodeDeckcode,
  parseDeckcode,
  removeCard,
  replaceCard,
  updateTitle,
} from '@/data/deckcode'
import { trpc } from '@/utils/trpc'
import { noop } from 'lodash'
import type { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const useRouteQuery = (initialDeckcode: string | null) => {
  const { query, replace, pathname } = useRouter()
  const deckcodeQuery = (query.deckcode as string | undefined) ?? initialDeckcode ?? ''
  const baseDeckcodeQuery = query.base as string | undefined

  const deckcode = useMemo(() => parseDeckcode(deckcodeQuery), [deckcodeQuery])
  const deck = useMemo(() => createDeckExpanded(deckcode), [deckcode])
  const baseDeckcode = useMemo(
    () => baseDeckcodeQuery ?? (deck.counts.total > 1 ? deck.deckcode : undefined),
    [deck, baseDeckcodeQuery],
  )

  const { data: baseDeck } = trpc.decklyst.get.useQuery(
    { code: baseDeckcode!, scope: 'user' },
    {
      enabled: !!baseDeckcode,
      select: (data) => createDeckFromDecklyst(data),
    },
  )

  useEffect(() => {
    if (!baseDeckcodeQuery && baseDeckcode) {
      replace(
        {
          pathname,
          query: {
            ...query,
            base: baseDeckcode,
          },
        },
        undefined,
      ).catch(noop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { deckcode, deck, baseDeck }
}

const DeckbuilderBuildPage: FC<Props> = (props) => {
  const router = useRouter()
  const { deck, deckcode, baseDeck } = useRouteQuery(props.deckcode)

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
    <DeckcodeProvider deckcode={deckcode} {...handlers}>
      <DeckProvider deck={deck}>
        <CardFiltersProvider>
          <>
            <DeckMetadata />
            <DeckbuilderMain />
            <DeckbuilderAside baseDeck={baseDeck} />
          </>
        </CardFiltersProvider>
      </DeckProvider>
    </DeckcodeProvider>
  )
}

export default DeckbuilderBuildPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const deckcode = (ctx.query.deckcode as string | undefined) ?? null

  return {
    props: {
      deckcode,
    },
  }
}
