import { createApiClient } from '@/server'
import { createContext } from '@/server/trpc/context'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'

const DeckRedirectPage: FC = () => null

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ code?: string }>) => {
  const code = ctx.params?.code as string | undefined

  if (!code) return { notFound: true }

  const clientContext = await createContext(ctx as any)
  const client = await createApiClient(clientContext)

  const deck = await client.deck.ensure({ code })

  return deck
    ? {
        redirect: {
          destination: `/decks/${encodeURIComponent(code)}`,
          permanent: true,
        },
      }
    : { notFound: true }
}

export default DeckRedirectPage
