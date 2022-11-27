import { transformer } from '@/common/transformer'
import { DeckDetailsAside } from '@/components/DeckDetails/DeckDetailsAside'
import { DeckDetailsMain } from '@/components/DeckDetails/DeckDetailsMain'
import { PageLoader } from '@/components/PageLoader'
import { DeckProvider } from '@/context/useDeck'
import { useRegisterView } from '@/context/useRegisterView'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { appRouter } from '@/server'
import { createContextInner } from '@/server/trpc/context'
import { trpc } from '@/utils/trpc'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import { uniqBy } from 'lodash'
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import type { FC } from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const DeckPage: FC<Props> = ({ deck: initialDeck, sharecode }) => {
  useRegisterView(sharecode)

  const { data: deck, error } = trpc.deck.get.useQuery(
    { code: sharecode },
    {
      initialData: initialDeck,
      retry: (count, error) => (error.data?.code === 'UNAUTHORIZED' ? false : count < 3),
    },
  )

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center grid-in-main">
        <div className="text-xl">Deck is private</div>
      </div>
    )
  if (!deck) return <PageLoader />

  return (
    <DeckProvider deck={deck}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <DeckDetailsMain />
        <DeckDetailsAside />
      </SpriteLoaderProvider>
    </DeckProvider>
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
        .map((code) => `/decks/${encodeURIComponent(code)}`)
        .filter((code) => code?.length > 0 && code.length <= 205),
      (code) => code.toLowerCase(),
    ),
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ code?: string }>) => {
  const code = ctx.params?.code as string | undefined

  if (!code) {
    return { notFound: true }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer,
  })
  const deck = await ssg.deck.get.fetch({ code })

  return deck
    ? {
        props: {
          trpcState: ssg.dehydrate(),
          sharecode: deck.meta.sharecode,
          deck: deck.meta.privacy === 'private' ? null : deck,
        },
      }
    : { notFound: true, revalidate: true }
}

export default DeckPage
