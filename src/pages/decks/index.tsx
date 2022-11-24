import { Aside } from '@/components/Aside'
import { DeckPreviewList } from '@/components/DeckPreviewList'
import { Filter } from '@/components/Filter'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { factions } from '@/data/cards'
import { createDeckExpanded } from '@/data/deck'
import { createApiClient } from '@/server'
import { trpc } from '@/utils/trpc'
import { last, startCase } from 'lodash'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PacmanLoader } from 'react-spinners'
import VisibilityObserver, { useVisibilityObserver } from 'react-visibility-observer'
import colors from 'tailwindcss/colors'

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
  const [showEndlessScroll, setShowEndlessScroll] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useContext()

  const updateFilter: typeof updateQuery = async (filters) => {
    utils.decks.search.cancel()
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setShowEndlessScroll(false)
    updateQuery(filters)

    setTimeout(() => {
      setShowEndlessScroll(true)
    }, 500)
  }

  const handleTabChanged = async (input: Tab) => await updateFilter({ tab: input })
  const handleFactionChanged = async (faction?: string) => {
    updateFilter({ faction })
  }

  const { data, fetchNextPage, isFetching, isLoading } = trpc.decks.search.useInfiniteQuery(
    {
      limit: count,
      filters: {
        faction: faction ? [faction] : [],
      },
    },
    {
      getNextPageParam: (_, allPages) => allPages.length,
      initialData: initialDeckcodes ? { pages: [initialDeckcodes], pageParams: [] } : undefined,
    },
  )

  const decks = useMemo(() => {
    return (data?.pages ?? [])
      .flatMap((page) => page)
      .map(({ deckcode, meta }) => createDeckExpanded(deckcode, meta))
      .filter((x) => x.general)
  }, [data?.pages])
  const hasMore = useMemo(() => last(data?.pages ?? [])?.length === count, [data?.pages, count])

  return (
    <>
      <div className="bg-image-decksearch flex flex-1 flex-col overflow-hidden grid-in-main">
        <PageHeader showFilterToggle>
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
            <div className="flex gap-x-4"></div>
          </div>
        </PageHeader>
        <div className="flex flex-1 flex-col overflow-y-auto pb-8" ref={scrollContainerRef}>
          <div className="content-container mt-8 flex flex-col">
            <DeckPreviewList decks={decks ?? []} />
            <div className="my-8 flex justify-center">
              {showEndlessScroll &&
                (hasMore ? (
                  <VisibilityObserver root={scrollContainerRef.current} rootMargin="0px">
                    <EndlessScroll
                      fetch={() => fetchNextPage()}
                      isFetching={isFetching || isLoading}
                    />
                  </VisibilityObserver>
                ) : (
                  <div className="flex justify-center font-semibold">No more decks found</div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Aside
        filters={
          <>
            <Filter title="Faction" onClear={() => handleFactionChanged(undefined)}>
              <select
                className="bg-alt-1000 px-4 py-2 text-lg"
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
            </Filter>
          </>
        }
      />
    </>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createApiClient()
  const count = +(query.count as string) || 10
  const tab: Tab = allTabs.find((tab) => tab === (query.tab as string)) ?? 'trending'
  const faction: string | undefined =
    (query.faction as string | undefined)?.toLowerCase() || undefined

  // const initialDeckcodes = await ((tab: Tab) => {
  //   if (tab === 'trending') {
  //     return client.decks.mostViewed({
  //       count,
  //       faction,
  //       sinceDaysAgo: 3,
  //     })
  //   } else if (tab === 'most-viewed') {
  //     return client.decks.mostViewed({ count, faction })
  //   } else return client.decks.latest({ count, faction })
  // })(tab)

  const initialDeckcodes = await client.decks.search({
    limit: count,
  })

  return {
    props: {
      initialQuery: { tab, count, faction },
      initialDeckcodes,
    },
  }
}

const EndlessScroll: React.FC<{ fetch: () => void; isFetching?: boolean }> = ({
  fetch,
  isFetching,
}) => {
  const { isVisible } = useVisibilityObserver()

  useEffect(() => {
    if (isVisible && !isFetching) {
      fetch()
    }
  }, [fetch, isFetching, isVisible])

  return <PacmanLoader size={24} color={colors.teal['400']} />
}

export default DecksPage
