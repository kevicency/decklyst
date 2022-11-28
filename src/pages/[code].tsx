import { createApiClient } from '@/server'
import { createContext } from '@/server/trpc/context'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'

const DeckRedirectPage: FC = () => null

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ code?: string }>) => {
  const { env } = await import('@/env/server.mjs')
  const code = ctx.params?.code as string | undefined

  if (!code) return { notFound: true }

  const client = await createApiClient(await createContext(ctx as any))
  const decklyst = await client.decklyst.get({ code, ssrSecret: env.SSR_SECRET })

  return decklyst
    ? {
        redirect: {
          destination: `/decks/${encodeURIComponent(code)}`,
          permanent: true,
        },
      }
    : { notFound: true }
}

export default DeckRedirectPage
