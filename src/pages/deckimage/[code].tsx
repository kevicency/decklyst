import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckProvider } from '@/context/useDeck'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { DeckExpanded, DeckMeta } from '@/data/deck'
import { createDeck, expandDeck } from '@/data/deck'
import { createApiClient } from '@/server'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'

type Props = {
  deck: DeckExpanded
}

const DeckPage: FC<Props> = ({ deck }) => {
  if (!deck) return null

  return (
    <DeckProvider deck={deck}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <div className="content-container my-8">
          <DeckInfograph />
        </div>
      </SpriteLoaderProvider>
    </DeckProvider>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const code = query.code as string | undefined
  const client = await createApiClient()

  let deckcode = code
  const meta: DeckMeta = {
    viewCount: 0,
  }

  if (code) {
    const deckinfo = await client.deckinfo.get({ code })

    deckcode = deckinfo?.deckcode ?? deckcode
    meta.sharecode = deckinfo?.sharecode ?? meta.sharecode
    meta.createdAt = deckinfo?.createdAt ?? meta.createdAt
  }

  const deck = createDeck(deckcode)

  return {
    props: {
      deck: expandDeck(deck, meta),
    },
  }
}

export default DeckPage
