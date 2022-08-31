import { trpc } from '@/common/trpc'
import { DeckPreviewList } from '@/components/DeckPreviewList'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { createDeckExpanded } from '@/data/deck'
import { createSsrClient } from '@/server'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import { useMemo, useState } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Tab = 'most-viewed' | 'trending' | 'latest'
const allTabs: Tab[] = ['most-viewed', 'trending', 'latest']

const Home: NextPage<Props> = ({ initialTab, initialDeckcodes, initialCount }) => {
  const router = useRouter()
  const tab: Tab = (router.query.tab as Tab | undefined) ?? initialTab ?? 'trending'
  const count: number = +(router.query.count as string) || initialCount

  const handleTabChanged = async (input: Tab) =>
    await router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tab: input,
        },
      },
      undefined,
      { shallow: true },
    )
  const handleCountChanged = async (count: string) =>
    await router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          count,
        },
      },
      undefined,
      { shallow: true },
    )

  const [deckcodes, setDeckcodes] = useState<Props['initialDeckcodes']>(initialDeckcodes ?? [])
  const decks = useMemo(() => {
    return (deckcodes ?? [])
      .map(({ deckcode, meta }) => createDeckExpanded(deckcode, meta))
      .filter((x) => x.general)
  }, [deckcodes])

  trpc.useQuery(
    tab === 'latest'
      ? ['decks.latest', { count }]
      : [
          'decks.mostViewed',
          {
            count,
            sinceDaysAgo: tab === 'trending' ? 3 : undefined,
          },
        ],
    {
      initialData: tab === initialTab ? initialDeckcodes : [],
      onSuccess: setDeckcodes,
    },
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader>
        <div className="flex flex-1 justify-between">
          <div className="flex text-3xl gap-x-4">
            <PivotButton active={tab === 'trending'} onClick={() => handleTabChanged('trending')}>
              Trending
            </PivotButton>
            <PivotButton
              active={tab === 'most-viewed'}
              onClick={() => handleTabChanged('most-viewed')}
            >
              Most Viewed
            </PivotButton>
            <PivotButton active={tab === 'latest'} onClick={() => handleTabChanged('latest')}>
              Latest
            </PivotButton>
          </div>
          <select
            className="px-2 bg-slate-900 text-lg"
            value={`${count}`}
            onChange={(ev) => handleCountChanged(ev.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </div>
      </PageHeader>
      <div className="flex flex-col flex-1 pb-8 overflow-y-auto">
        <div className="flex flex-col content-container mt-8">
          <DeckPreviewList decks={decks ?? []} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createSsrClient()
  const initialCount = +(query.count as string) || 5
  const initialTab: Tab = allTabs.find((tab) => tab === (query.tab as string)) ?? 'trending'
  const initialDeckcodes = await ((tab: Tab) => {
    if (tab === 'trending') {
      return client.query('decks.mostViewed', { count: initialCount, sinceDaysAgo: 3 })
    } else if (tab === 'most-viewed') {
      return client.query('decks.mostViewed', { count: initialCount })
    } else return client.query('decks.latest', { count: initialCount })
  })(initialTab)

  return {
    props: {
      initialTab,
      initialDeckcodes,
      initialCount,
    },
  }
}

export default Home
