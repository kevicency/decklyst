import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckProvider } from '@/context/useDeck'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { createDeckFromDecklyst } from '@/data/deck'
import { createApiClient } from '@/server'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types'
import type { FC } from 'react'
import { useMemo } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const DeckPage: FC<Props> = ({ decklyst }) => {
  const deck = useMemo(() => createDeckFromDecklyst(decklyst), [decklyst])
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

  const decklyst = await client.decklyst.get({ code, ssrSecret: ssrSecret })

  return decklyst
    ? {
        props: { decklyst },
      }
    : { notFound: true }
}

export default DeckPage
