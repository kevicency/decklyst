import { Deckbuilder } from '@/components/Deckbuilder/Deckbuilder'
import { createDeck } from '@/data/deck'
import type { Deckcode } from '@/data/deckcode'
import { parseDeckcode } from '@/data/deckcode'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React, { useMemo } from 'react'

type Props = { deckcode?: Deckcode }

const DeckbuilderPage: FC<Props> = ({ deckcode }) => {
  const deck = useMemo(() => createDeck(deckcode), [deckcode])
  return <Deckbuilder deckcode={deck?.deckcode} />
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const deckcode = query.deckcode as string | undefined

  if (!deckcode) {
    return { props: { deckcode: null } }
  }

  return {
    props: {
      deckcode: parseDeckcode(deckcode),
    },
  }
}

export default DeckbuilderPage
