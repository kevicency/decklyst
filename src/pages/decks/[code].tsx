import { DeckDetailsAside } from '@/components/DeckDetails/DeckDetailsAside'
import { DeckDetailsMain } from '@/components/DeckDetails/DeckDetailsMain'
import { PageLoader } from '@/components/PageLoader'
import { useAppShell } from '@/context/useAppShell'
import { DeckProvider } from '@/context/useDeck'
import { useRegisterView } from '@/context/useRegisterView'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { createDeckFromDecklyst } from '@/data/deck'
import { createSSGClient } from '@/server'
import { createContextInner } from '@/server/trpc/context'
import type { Decklyst } from '@/types'
import { trpc } from '@/utils/trpc'
import { TRPCError } from '@trpc/server'
import { uniqBy } from 'lodash'
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import type { FC } from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const DeckPage: FC<Props> = ({ decklyst, code }) => {
  const [{ isMobile }] = useAppShell()
  const {
    data: deck,
    error,
    isSuccess,
  } = trpc.decklyst.get.useQuery(
    { code },
    {
      initialData: decklyst,
      retry: (count, error) => (error.data?.code === 'UNAUTHORIZED' ? false : count < 3),
      select: (data) => createDeckFromDecklyst(data),
    },
  )
  useRegisterView(deck?.meta.sharecode, { enabled: !!deck && isSuccess })

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center grid-in-main">
        <div className="text-xl">Deck is private</div>
      </div>
    )
  if (!deck) return <PageLoader />

  return deck.valid ? (
    <DeckProvider deck={deck}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <DeckDetailsMain />
        {!isMobile && <DeckDetailsAside />}
      </SpriteLoaderProvider>
    </DeckProvider>
  ) : (
    <div className="flex items-center justify-center grid-in-main">invalid deckcode</div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { prisma } = await createContextInner()
  const decklysts = await prisma.decklyst.findMany({
    select: { deckcode: true, sharecode: true },
    where: { privacy: { not: 'private' } },
  })

  return {
    paths: uniqBy(
      decklysts
        .flatMap(({ deckcode, sharecode }) => [deckcode, sharecode])
        .map((code) => code?.trim())
        .filter((code): code is string => code?.length > 0)
        .map((code) => `/decks/${encodeURIComponent(code)}`)
        .filter((code) => code?.length > 0 && code.length <= 205),
      (code) => code.toLowerCase(),
    ),
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ code?: string }>) => {
  const { env } = await import('@/env/server.mjs')
  const code = ctx.params?.code as string | undefined

  if (!code) {
    return { notFound: true }
  }

  const ssg = await createSSGClient()

  let decklyst: Decklyst | null = null
  let invalid = true

  try {
    decklyst = await ssg.decklyst.get.fetch({ code, ssrSecret: env.SSR_SECRET })
  } catch (err) {
    if (err instanceof TRPCError) {
      console.log(err.message, err.cause, err.name)
      invalid = /invalid/i.test(err.message)
    }
  }

  const isPrivate = decklyst?.privacy === 'private'

  return decklyst
    ? {
        props: {
          code,
          trpcState: ssg.dehydrate({ shouldDehydrateQuery: () => !isPrivate }),
          decklyst: isPrivate ? null : decklyst,
        },
      }
    : invalid
    ? { redirect: { destination: '/decks/invalid', permanent: false } }
    : { notFound: true, revalidate: true }
}

export default DeckPage
