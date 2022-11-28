import { transformer } from '@/common/transformer'
import { appRouter, createContextInner } from '@/server'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { NextPage } from 'next'
import type { Props } from './decks'
import DecksPage from './decks'

const Home: NextPage<Props> = ({ initialDecklysts, initialRouteParams }) => (
  <DecksPage initialDecklysts={initialDecklysts} initialRouteParams={initialRouteParams} />
)

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer,
  })

  const decklysts = await ssg.decklyst.search.fetch({
    sorting: 'views:recent',
  })

  return {
    props: {
      initialDeckcodes: decklysts,
      initialRouteParams: {
        listing: 'hot',
        filters: { factions: [] },
      },
    },
    revalidate: 60,
  }
}

export default Home
