import { transformer } from '@/common/transformer'
import { appRouter, createContext } from '@/server'
import { createProxySSGHelpers } from '@trpc/react/ssg'
import type { NextPage } from 'next'
import type { Props } from './decks'
import DecksPage from './decks'

const Home: NextPage<Props> = ({ initialDeckcodes, initialQuery }) => (
  <DecksPage initialDeckcodes={initialDeckcodes} initialQuery={initialQuery} />
)

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer,
  })

  const decks = await ssg.decks.mostViewed.fetch({
    count: 5,
    sinceDaysAgo: 3,
  })

  return {
    props: {
      initialDeckcodes: decks,
      initialQuery: {
        tab: 'trending',
        count: 5,
      },
    },
    revalidate: 60,
  }
}

export default Home
