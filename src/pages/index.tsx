import { transformer } from '@/common/transformer'
import { DeckPreview } from '@/components/DeckPreviewList'
import { DeckProvider } from '@/context/useDeck'
import { factions } from '@/data/cards'
import { createDeckFromDecklyst } from '@/data/deck'
import { appRouter, createContextInner } from '@/server'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import { useMemo } from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = ({ starterDecklysts }) => {
  const starterDeckGroups = useMemo(
    () =>
      starterDecklysts.map((group) => group.map((decklyst) => createDeckFromDecklyst(decklyst))),
    [starterDecklysts],
  )
  return (
    <div className="bg-image-home overflow-y-auto bg-gray-900 grid-in-main">
      <div className="content-container mt-16 flex flex-col px-6 lg:mt-32 lg:px-24">
        <h1 className="mb-3 text-center text-5xl leading-tight text-gray-100">
          <span className="inline-block whitespace-nowrap">Welcome to&nbsp;</span>
          <span className="font-thin text-accent-400">Decklyst</span>
        </h1>
        <p className="text-center text-xl text-gray-300">Your Duelyst 2 deck companion</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-x-12 gap-y-4 sm:flex-row">
          <Link className="btn btn--large bg-accent-700" href="/decks">
            Browse decks
          </Link>
          <span className="uppercase text-gray-400">or</span>
          <Link className="btn btn--large bg-accent-700" href="/build">
            Create deck
          </Link>
        </div>
      </div>
      <div className="content-container mt-32 mb-16 flex flex-col">
        <h2 className="mb-2 text-3xl">Popular starter decks</h2>
        <p className="mb-4 text-lg text-gray-400">
          Kickstart your Duelyst 2 journey with these starter decks
        </p>
        {starterDeckGroups.map((decks, i) => (
          <div key={i} className="mb-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {decks.map((deck) => (
              <DeckProvider key={deck.meta.id} deck={deck}>
                <DeckPreview type="card" />
              </DeckProvider>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer,
  })

  const decklysts = await Promise.all(
    factions
      .filter((faction) => faction !== 'neutral')
      .map((faction) =>
        ssg.decklyst.search.fetch({
          limit: 2,
          sorting: 'views:all',
          filters: {
            tags: ['starter'],
            factions: [faction],
            cardIds: [],
          },
        }),
      ),
  )

  return {
    props: {
      starterDecklysts: decklysts.map((x) =>
        x.decklysts.sort((a, b) => b.views - a.views).filter(Boolean),
      ),
    },
    revalidate: 60,
  }
}

export default Home
