import { DeckPreviewList } from '@/components/DeckPreviewList'
import type { Filters, Sorting, Timespan } from '@/components/Decksearch'
import { parseRouteParams, useRouteParams } from '@/components/Decksearch'
import { EndlessScroll } from '@/components/Decksearch/EndlessScroll'
import { TimespanCombobox } from '@/components/Inputs/TimespanCombobox'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { createDeckFromDecklyst } from '@/data/deck'
import { createSSGClient } from '@/server'
import { trpc } from '@/utils/trpc'
import { last, startCase, uniqBy } from 'lodash'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { useMemo, useRef, useState } from 'react'
import VisibilityObserver from 'react-visibility-observer'
import { DecksearchAside } from '../../components/Decksearch/DecksearchAside'

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const sortings: Sorting[] = ['views', 'likes', 'date:created']
const sortingLabel = (sorting: Sorting): string => {
  switch (sorting) {
    case 'date:created':
      return 'New'
    case 'date:updated':
      return 'Updated'
    default:
      return startCase(sorting)
  }
}

const DecksPage: NextPage<Props> = ({ initialRouteParams }) => {
  const [routeParams, updateRouteParams] = useRouteParams(initialRouteParams)
  const [endlessScrollTimeoutId, setEndlessScrollTimeoutId] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useContext()

  const updateFilters = async (partialFilters: Partial<Filters>) => {
    utils.decklyst.search.cancel()
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    updateRouteParams({ ...routeParams, filters: { ...routeParams.filters, ...partialFilters } })

    window.clearTimeout(endlessScrollTimeoutId)
    setEndlessScrollTimeoutId(
      window.setTimeout(() => {
        setEndlessScrollTimeoutId(0)
      }, 100),
    )
  }
  const createSortingChangeHandler = (sorting: Sorting) => () =>
    updateRouteParams({ ...routeParams, sorting })
  const createTimespanChangeHandler = (timespan: Timespan) => () =>
    updateRouteParams({ ...routeParams, timespan })

  const { data, fetchNextPage, isFetching, isLoading } = trpc.decklyst.search.useInfiniteQuery(
    routeParams,
    {
      getNextPageParam: (_, allPages) => allPages.length,
    },
  )

  const decks = useMemo(() => {
    const allDecks = (data?.pages ?? [])
      .flatMap((page) => page.decklysts ?? [])
      .map((decklyst) => createDeckFromDecklyst(decklyst))
      .filter((x) => x.general)
    return uniqBy(allDecks, (x) => x.deckcode)
  }, [data?.pages])
  const hasMore = useMemo(() => last(data?.pages ?? [])?.hasMore ?? false, [data?.pages])

  return (
    <>
      <div className="bg-image-decksearch flex flex-1 flex-col overflow-hidden grid-in-main">
        <PageHeader showFilterToggle>
          <div className="flex flex-1 justify-between">
            <div className="flex items-end gap-x-4">
              {sortings.map((sorting) => (
                <PivotButton
                  key={sorting}
                  active={sorting === routeParams.sorting}
                  onClick={createSortingChangeHandler(sorting)}
                  className="text-3xl"
                >
                  {sortingLabel(sorting)}
                </PivotButton>
              ))}
              <div className="ml-2">
                <TimespanCombobox
                  disabled={/^date/.test(routeParams.sorting)}
                  value={routeParams.timespan}
                  onChange={(timespan: Timespan) => updateRouteParams({ ...routeParams, timespan })}
                />
              </div>
            </div>
            <div className="flex gap-x-4"></div>
          </div>
        </PageHeader>
        <div className="flex flex-1 flex-col overflow-y-auto pb-8" ref={scrollContainerRef}>
          <div className="content-container mt-8 flex flex-col">
            <DeckPreviewList decks={decks ?? []} />
            <div className="my-8 flex justify-center">
              {hasMore ? (
                <VisibilityObserver
                  root={scrollContainerRef.current}
                  rootMargin="0px"
                  threshold={0.75}
                >
                  <EndlessScroll
                    hidden={endlessScrollTimeoutId !== 0}
                    fetch={fetchNextPage}
                    isFetching={isFetching || isLoading}
                  />
                </VisibilityObserver>
              ) : (
                <div className="flex justify-center font-semibold">
                  No {decks.length ? 'more' : 'matching'} decks found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DecksearchAside updateFilters={updateFilters} filters={routeParams.filters} />
    </>
  )
}

export const getServerSideProps = async ({ query, ...ctx }: GetServerSidePropsContext) => {
  const client = await createSSGClient(ctx)
  const routeParams = parseRouteParams(query)
  await client.decklyst.search.prefetchInfinite(routeParams)

  return {
    props: {
      initialRouteParams: routeParams,
      trpcState: client.dehydrate(),
    },
  }
}

export default DecksPage
