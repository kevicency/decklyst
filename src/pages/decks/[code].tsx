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
import { isInvalidDeckcodeError } from '@/server/utils'
import type { Decklyst } from '@/types'
import { trpc } from '@/utils/trpc'
import { uniqBy } from 'lodash'
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import type { FC } from 'react'
import InvalidDeckPage from './invalid'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const DeckPage: FC<Props> = ({ decklyst, code, invalid }) => {
  const [{ isMobile }] = useAppShell()
  const {
    data: deck,
    error,
    isSuccess,
  } = trpc.decklyst.get.useQuery(
    { code: decklyst?.sharecode ?? code },
    {
      placeholderData: decklyst,
      retry: (count, error) => (error.data?.code === 'UNAUTHORIZED' ? false : count < 3),
      select: (data) => createDeckFromDecklyst(data),
      enabled: !invalid,
    },
  )
  useRegisterView(deck?.meta.sharecode, { enabled: !!deck && isSuccess && !invalid })

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center grid-in-main">
        <div className="text-xl">Deck is private</div>
      </div>
    )

  if (invalid || (deck && !deck.valid)) return <InvalidDeckPage />
  if (!deck) return <PageLoader />

  return (
    <DeckProvider deck={deck}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <DeckDetailsMain />
        {!isMobile && <DeckDetailsAside />}
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
  let invalid = false

  try {
    decklyst = await ssg.decklyst.get.fetch({ code, ssrSecret: env.SSR_SECRET })
  } catch (err) {
    if (isInvalidDeckcodeError(err)) {
      invalid = true
    } else {
      throw err
    }
  }

  const isPrivate = decklyst?.privacy === 'private'

  return decklyst || invalid
    ? {
        props: {
          code,
          trpcState: ssg.dehydrate({ shouldDehydrateQuery: () => !isPrivate }),
          decklyst: isPrivate ? null : decklyst,
          invalid,
        },
      }
    : { notFound: true, revalidate: true }
}

export default DeckPage
