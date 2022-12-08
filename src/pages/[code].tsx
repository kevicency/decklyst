import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'

const DeckRedirectPage: FC = () => null

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ code?: string }>) => {
  const { env } = await import('@/env/server.mjs')
  const code = ctx.params?.code as string | undefined

  if (!code) return { notFound: true }

  return {
    redirect: {
      destination: `/decks/${encodeURIComponent(code)}`,
      permanent: true,
    },
  }

  // const client = await createSSRClient(ctx)
  // try {
  //   const decklyst = await client.decklyst.get({ code, ssrSecret: env.SSR_SECRET })

  //   return decklyst
  //     ? {
  //         redirect: {
  //           destination: `/decks/${encodeURIComponent(code)}`,
  //           permanent: true,
  //         },
  //       }
  //     : { notFound: true }
  // } catch (err) {
  //   if (err instanceof TRPCError) {
  //     console.log('is trpc error')
  //   }
  //   return { redirect: { destination: '/decks/invalid', permanent: false } }
  // }
}

export default DeckRedirectPage
