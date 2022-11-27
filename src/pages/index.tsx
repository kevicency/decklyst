import { transformer } from '@/common/transformer'
import { appRouter, createContextInner } from '@/server'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { NextPage } from 'next'
import type { Props } from './decks'
import DecksPage from './decks'

const Home: NextPage<Props> = ({ initialDeckcodes, initialRouteParams }) => (
  <DecksPage initialDeckcodes={initialDeckcodes} initialRouteParams={initialRouteParams} />
)

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer,
  })

  const decks = await ssg.deck.search.fetch({
    sorting: 'views:recent',
  })

  return {
    props: {
      initialDeckcodes: decks,
      initialRouteParams: {
        listing: 'hot',
        filters: { factions: [] },
      },
    },
    revalidate: 60,
  }
}

export default Home
