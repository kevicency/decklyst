import { DeckPreviewList } from '@/components/DeckPreviewList'
import type { Filters, Listing } from '@/components/Decksearch'
import { listings, parseRouteParams, useRouteParams } from '@/components/Decksearch'
import { EndlessScroll } from '@/components/Decksearch/EndlessScroll'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { createDeckExpanded } from '@/data/deck'
import { createApiClient } from '@/server'
import type { RouterInputs } from '@/utils/trpc'
import { trpc } from '@/utils/trpc'
import { last, startCase } from 'lodash'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { useMemo, useRef, useState } from 'react'
import VisibilityObserver from 'react-visibility-observer'
import { DecksearchAside } from '../../components/Decksearch/DecksearchAside'

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const toSorting = (listing: Listing): RouterInputs['decks']['search']['sorting'] => {
  switch (listing) {
    case 'hot':
      return 'views:recent'
    case 'popular':
      return 'views:all'
    case 'new':
      return 'date:created'
  }
}

const DecksPage: NextPage<Props> = ({ initialDeckcodes, initialRouteParams }) => {
  const [routeParams, updateRouteParams] = useRouteParams(initialRouteParams)
  const [showEndlessScroll, setShowEndlessScroll] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useContext()

  const updateFilters = async (partialFilters: Partial<Filters>) => {
    utils.decks.search.cancel()
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setShowEndlessScroll(false)
    updateRouteParams({ ...routeParams, filters: { ...routeParams.filters, ...partialFilters } })

    setTimeout(() => {
      setShowEndlessScroll(true)
    }, 500)
  }
  const createListingChangedHandler = (listing: Listing) => () =>
    updateRouteParams({ ...routeParams, listing })

  const { data, fetchNextPage, isFetching, isLoading } = trpc.decks.search.useInfiniteQuery(
    { sorting: toSorting(routeParams.listing), filters: routeParams.filters },
    {
      getNextPageParam: (_, allPages) => allPages.length,
      initialData: initialDeckcodes ? { pages: [initialDeckcodes], pageParams: [] } : undefined,
    },
  )

  const decks = useMemo(() => {
    return (data?.pages ?? [])
      .flatMap((page) => page.decks ?? [])
      .map(({ deckcode, meta }) => createDeckExpanded(deckcode, meta))
      .filter((x) => x.general)
  }, [data?.pages])
  const hasMore = useMemo(() => last(data?.pages ?? [])?.hasMore ?? false, [data?.pages])

  return (
    <>
      <div className="bg-image-decksearch flex flex-1 flex-col overflow-hidden grid-in-main">
        <PageHeader showFilterToggle>
          <div className="flex flex-1 justify-between">
            <div className="flex gap-x-4 text-3xl">
              {listings.map((listing) => (
                <PivotButton
                  key={listing}
                  active={listing === routeParams.listing}
                  onClick={createListingChangedHandler(listing)}
                >
                  {startCase(listing)}
                </PivotButton>
              ))}
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
                  <div className="flex justify-center font-semibold">
                    No {decks.length ? 'more' : 'matching'} decks found
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <DecksearchAside updateFilters={updateFilters} filters={routeParams.filters} />
    </>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createApiClient()
  const routeParams = parseRouteParams(query)
  const initialDeckcodes = await client.decks.search({
    filters: routeParams.filters,
    sorting: toSorting(routeParams.listing),
  })

  return {
    props: {
      initialRouteParams: routeParams,
      initialDeckcodes,
    },
  }
}

export default DecksPage
