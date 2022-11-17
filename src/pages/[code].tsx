import { transformer } from '@/common/transformer'
import { DeckDetailsAside, DeckDetailsMain } from '@/components/DeckDetails/DeckDetailsMain'
import { DeckProvider } from '@/context/useDeck'
import { useRegisterView } from '@/context/useRegisterView'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { DeckExpanded } from '@/data/deck'
import { createDeckExpanded } from '@/data/deck'
import { appRouter } from '@/server'
import { createContextInner } from '@/server/trpc/context'
import { trpc } from '@/utils/trpc'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import { merge, uniqBy } from 'lodash'
import type { GetStaticPaths, GetStaticPropsContext } from 'next/types'
import type { FC } from 'react'

type Props = {
  deck: DeckExpanded
  isSnapshot: boolean
}

const DeckPage: FC<Props> = ({ deck }) => {
  const deckcode = deck.deckcode
  const meta = deck.meta ?? {}
  useRegisterView(deckcode)
  const { data: viewCount } = trpc.deckviews.get.useQuery({ deckcode })

  if (!deck) return null

  return (
    <DeckProvider deck={merge(deck, { meta: { ...meta, viewCount: viewCount || 1 } })}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <DeckDetailsMain />
        <DeckDetailsAside />
      </SpriteLoaderProvider>
    </DeckProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { prisma } = await createContextInner()
  const deckinfos = await prisma.deckinfo.findMany({
    select: { deckcode: true, sharecode: true },
  })

  return {
    paths: uniqBy(
      deckinfos
        .flatMap(({ deckcode, sharecode }) => [deckcode, sharecode])
        .map((code) => `/${encodeURIComponent(code)}`)
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
  const deckinfo = await ssg.deckinfo.get.fetch({ code, ensure: true })
  return deckinfo
    ? {
        props: {
          trpcState: ssg.dehydrate(),
          deck: createDeckExpanded(deckinfo.deckcode, {
            viewCount: 0,
            sharecode: deckinfo?.sharecode,
            createdAt: deckinfo?.createdAt,
          }),
        },
      }
    : { notFound: true, revalidate: true }
}

export default DeckPage
