import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckProvider } from '@/context/useDeck'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { createApiClient } from '@/server'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types'
import type { FC } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

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
  const code = (query.code as string | undefined) ?? ''
  const ssrSecret = (query.ssrSecret as string | undefined) ?? ''
  const client = await createApiClient()

  const deck = await client.deck.get({ code, ssrSecret: ssrSecret })

  return deck
    ? {
        props: { deck },
      }
    : { notFound: true }
}

export default DeckPage
