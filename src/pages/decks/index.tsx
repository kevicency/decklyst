import { DeckPreviewList } from '@/components/DeckPreviewList'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { factions } from '@/data/cards'
import { createDeckExpanded } from '@/data/deck'
import { createApiClient } from '@/server'
import { trpc } from '@/utils/trpc'
import { startCase } from 'lodash'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import { useMemo, useState } from 'react'

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Tab = 'most-viewed' | 'trending' | 'latest'
const allTabs: Tab[] = ['most-viewed', 'trending', 'latest']

const useRouterQuery = (initialQuery: Props['initialQuery']) => {
  const router = useRouter()
  const tab: Tab =
    ((router.query.tab as string | undefined)?.toLowerCase() as Tab) ??
    initialQuery.tab ??
    'trending'
  const count: number = +(router.query.count as string) || initialQuery.count
  const faction: string | undefined =
    (router.query.faction as string | undefined)?.toLowerCase() || undefined

  const updateQuery = async (partialQuery: Partial<typeof initialQuery>) => {
    const updatedQuery = Object.keys(partialQuery).reduce(
      (query, key) => {
        const value = partialQuery[key as keyof typeof partialQuery]
        if (value) {
          query[key] = value
        } else {
          delete query[key]
        }
        return query
      },
      { tab, faction, count } as Record<string, string | number>,
    )

    await router.push(
      {
        pathname: '/decks',
        query: updatedQuery,
      },
      undefined,
      { shallow: router.pathname === '/decks' },
    )
  }

  return [{ tab, count, faction }, updateQuery] as const
}

const DecksPage: NextPage<Props> = ({ initialDeckcodes, initialQuery }) => {
  const [{ tab, faction, count }, updateQuery] = useRouterQuery(initialQuery)
  const [deckcodes, setDeckcodes] = useState<Props['initialDeckcodes']>(initialDeckcodes ?? [])
  const decks = useMemo(() => {
    return (deckcodes ?? [])
      .map(({ deckcode, meta }) => createDeckExpanded(deckcode, meta))
      .filter((x) => x.general)
  }, [deckcodes])

  const handleTabChanged = async (input: Tab) => await updateQuery({ tab: input })
  const handleCountChanged = async (count: string) => await updateQuery({ count: +count })
  const handleFactionChanged = async (faction?: string) => await updateQuery({ faction })

  trpc.decks.latest.useQuery(
    { count, faction },
    {
      enabled: tab === 'latest',
      initialData: tab === initialQuery.tab ? initialDeckcodes : [],
      onSuccess: setDeckcodes,
    },
  )
  trpc.decks.mostViewed.useQuery(
    { count, faction, sinceDaysAgo: tab === 'trending' ? 3 : undefined },
    {
      enabled: tab !== 'latest',
      initialData: tab === initialQuery.tab ? initialDeckcodes : [],
      onSuccess: setDeckcodes,
    },
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader>
        <div className="flex flex-1 justify-between">
          <div className="flex gap-x-4 text-3xl">
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
          <div className="flex gap-x-4">
            <select
              className="bg-slate-900 px-2 text-lg"
              value={`${faction}`}
              onChange={(ev) => handleFactionChanged(ev.target.value)}
              aria-label="Faction"
            >
              <option value="">All Factions</option>
              {factions.map((faction) => (
                <option key={faction} value={faction}>
                  {startCase(faction)}
                </option>
              ))}
            </select>
            <select
              className="bg-slate-900 px-2 text-lg"
              value={`${count}`}
              onChange={(ev) => handleCountChanged(ev.target.value)}
              aria-label="Count"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
      </PageHeader>
      <div
        className="flex flex-1 flex-col overflow-y-auto bg-gray-900 bg-fixed bg-no-repeat pb-8 bg-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/backgrounds/default.png)',
          backgroundPosition: 'center top',
          backgroundSize: '100%',
        }}
      >
        <div className="content-container mt-8 flex flex-col">
          <DeckPreviewList decks={decks ?? []} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createApiClient()
  const count = +(query.count as string) || 5
  const tab: Tab = allTabs.find((tab) => tab === (query.tab as string)) ?? 'trending'
  const faction: string | undefined =
    (query.faction as string | undefined)?.toLowerCase() || undefined

  const initialDeckcodes = await ((tab: Tab) => {
    if (tab === 'trending') {
      return client.decks.mostViewed({
        count,
        faction,
        sinceDaysAgo: 3,
      })
    } else if (tab === 'most-viewed') {
      return client.decks.mostViewed({ count, faction })
    } else return client.decks.latest({ count, faction })
  })(tab)

  return {
    props: {
      initialQuery: { tab, count, faction },
      initialDeckcodes,
    },
  }
}

export default DecksPage
