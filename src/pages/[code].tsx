import type { DeckExpanded } from '@/data/deck'
import { createApiClient } from '@/server'
import { createContext } from '@/server/trpc/context'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'

type Props = {
  deck: DeckExpanded
  isSnapshot: boolean
}

const DeckRedirectPage: FC = () => null

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ code?: string }>) => {
  const code = ctx.params?.code as string | undefined

  if (!code) return { notFound: true }

  const clientContext = await createContext(ctx as any)
  const client = await createApiClient(clientContext)

  await client.decklyst.ensure({ code })

  return {
    redirect: {
      destination: `/decks/${encodeURIComponent(code)}`,
      permanent: true,
    },
  }
}

export default DeckRedirectPage
