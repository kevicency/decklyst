import { DeckPreviewList } from '@/components/DeckPreviewList'
import { PivotButton } from '@/components/PivotButton'
import { createSsrClient } from '@/server'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Tab = 'most-viewed' | 'trending'

const Home: NextPage<Props> = ({ mostViewedDecks, trendingDecks, initialTab }) => {
  const router = useRouter()
  const tab: Tab = (router.query.tab as Tab | undefined) ?? initialTab ?? 'trending'

  const setTab = async (input: Tab) =>
    await router.push(`/?tab=${input}`, undefined, { shallow: true })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-end justify-between gap-x-8 pb-4 pt-6 px-8 bg-gray-800 shadow-lg shadow-dark-900 z-20">
        <div className="flex text-3xl gap-x-4">
          <PivotButton active={tab === 'trending'} onClick={() => setTab('trending')}>
            Trending
          </PivotButton>
          <PivotButton active={tab === 'most-viewed'} onClick={() => setTab('most-viewed')}>
            Most Viewed
          </PivotButton>
        </div>
      </div>
      <div className="flex flex-col flex-1 pb-8 overflow-y-auto">
        <div className="flex flex-col content-container mt-8">
          <DeckPreviewList decks={tab === 'trending' ? trendingDecks : mostViewedDecks} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createSsrClient()
  const mostViewedDecks = await client.query('mostViewedDecks', { count: 5 })
  const trendingDecks = await client.query('mostViewedDecks', { count: 5, recent: true })
  const initialTab: Tab = query.tab === 'most-viewed' ? 'most-viewed' : 'trending'

  return {
    props: {
      mostViewedDecks,
      trendingDecks,
      initialTab,
    },
  }
}

export default Home
