import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { DeckPreview } from '@/components/DeckPreviewList'
import type { Filters } from '@/components/Decksearch'
import { DecksearchAside, useRouteParams } from '@/components/Decksearch'
import { EndlessScroll } from '@/components/Decksearch/EndlessScroll'
import { PageHeader } from '@/components/PageHeader'
import { ProfileMetadata } from '@/components/ProfileMetadata'
import { DeckProvider } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { createDeckFromDecklyst } from '@/data/deck'
import { createContextInner, createSSGClient } from '@/server'
import type { WithRequired } from '@/types'
import { trpc } from '@/utils/trpc'
import type { Privacy } from '@prisma/client'
import { last, uniqBy } from 'lodash'
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { signOut, useSession } from 'next-auth/react'
import type { FC } from 'react'
import { useMemo, useRef, useState } from 'react'
import VisibilityObserver from 'react-visibility-observer'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const UserProfilePage: FC<Props> = ({ userId, searchParams }) => {
  const session = useSession()
  const [routeParams, updateRouteParams] = useRouteParams({} as any)
  const [endlessScrollTimeoutId, setEndlessScrollTimeoutId] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [deleteDialogState, setDeleteDialogState] = useState<{
    deck: WithRequired<DeckExpanded, 'meta'> | null
    open: boolean
  }>({ deck: null, open: false })
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

  const {
    data: endlessDecklysts,
    fetchNextPage,
    isFetching,
    isLoading,
    refetch,
  } = trpc.decklyst.search.useInfiniteQuery(
    {
      limit: searchParams.limit,
      filters: { ...routeParams.filters, authorId: userId },
      sorting: searchParams.sorting as any,
    },
    {
      getNextPageParam: (_, allPages) => allPages.length,
    },
  )
  const { data: userProfile } = trpc.userProfile.get.useQuery({ id: userId })
  const isMyProfile = userProfile?.id === session?.data?.user?.id

  const decks = useMemo(() => {
    const allDecks = (endlessDecklysts?.pages ?? [])
      .flatMap((page) => page.decklysts ?? [])
      .map((decklyst) => createDeckFromDecklyst(decklyst))
      .filter((x) => x.general)
    return uniqBy(allDecks, (x) => x.deckcode)
  }, [endlessDecklysts?.pages])
  const hasMore = useMemo(
    () => last(endlessDecklysts?.pages ?? [])?.hasMore ?? false,
    [endlessDecklysts?.pages],
  )

  const { mutateAsync: upsertDecklyst } = trpc.decklyst.upsert.useMutation()
  const { mutateAsync: deleteDecklyst } = trpc.decklyst.delete.useMutation()

  const confirmDelete = async () => {
    await deleteDecklyst({ sharecode: deleteDialogState.deck?.meta?.sharecode! })
    utils.decklyst.search.setInfiniteData(
      { filters: { ...routeParams.filters, ...searchParams.filters }, sorting: 'date:updated' },
      (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                decklysts: page.decklysts.filter(
                  (decklyst) => decklyst.sharecode !== deleteDialogState.deck?.meta?.sharecode,
                ),
              })),
            }
          : data,
    )
    await refetch()
  }
  const createPrivacyHandler = (deck: DeckExpanded) => async (privacy: Privacy) => {
    await upsertDecklyst(
      {
        deckcode: deck.deckcode,
        sharecode: deck.meta?.sharecode,
        privacy,
      },
      {
        onSuccess(data, variables, context) {
          deck.meta!.privacy = privacy
          refetch()
        },
      },
    )
  }

  return userProfile ? (
    <>
      <div className="bg-image-profile flex flex-1 flex-col overflow-hidden grid-in-main">
        <ProfileMetadata profile={userProfile} />
        <PageHeader showFilterToggle>
          <div className="flex items-end text-3xl text-gray-100">
            {userProfile.image ? (
              <img
                src={userProfile?.image}
                alt={userProfile.name ?? ''}
                className="mr-4 h-12 w-12 rounded-full"
              />
            ) : null}
            <span>{userProfile.name ?? ''}</span>
          </div>
          <div>
            {isMyProfile && (
              <button className="btn-outline" onClick={() => signOut()}>
                Sign out
              </button>
            )}
          </div>
        </PageHeader>
        <div className="overflow-y-auto">
          <div className="content-container mt-24 flex flex-col">
            <ul className="flex flex-col gap-y-4">
              {decks.map((deck) => (
                <li key={deck.meta?.id ?? deck.deckcode}>
                  <DeckProvider deck={deck}>
                    {isMyProfile ? (
                      <DeckPreview
                        type="list"
                        onDelete={() => setDeleteDialogState({ deck, open: true })}
                        onChangePrivacy={createPrivacyHandler(deck)}
                      />
                    ) : (
                      <DeckPreview type="list" />
                    )}
                  </DeckProvider>
                </li>
              ))}
            </ul>
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
      <DecksearchAside
        updateFilters={updateFilters}
        filters={routeParams.filters}
        hideIncludeAnonymous
      />
      <ConfirmDeleteDialog
        open={deleteDialogState.open}
        onClose={() => setDeleteDialogState((state) => ({ ...state, open: false }))}
        deck={deleteDialogState.deck}
        onDelete={() => confirmDelete()}
      />
    </>
  ) : null
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { prisma } = await createContextInner()
  const users = await prisma.user.findMany({
    where: { id: { not: 'anonymous' } },
    select: { id: true },
  })

  return {
    paths: users.map(({ id }) => `/profile/${encodeURIComponent(id)}`),
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ userId?: string }>) => {
  const userId = ctx.params?.userId as string | undefined

  if (!userId || userId === 'anonymous') {
    return { notFound: true }
  }

  const ssg = await createSSGClient()
  const userProfile = await ssg.userProfile.get.fetch({ id: userId })
  await ssg.decklyst.search.prefetchInfinite({
    limit: 15,
    filters: { authorId: userId },
    sorting: 'date:updated',
  })

  return userProfile
    ? {
        props: {
          userId,
          searchParams: {
            limit: 15,
            filters: { authorId: userId },
            sorting: 'date:updated',
          },
          trpcState: ssg.dehydrate(),
        },
        revalidate: 60,
      }
    : { notFound: true, revalidate: true }
}
export default UserProfilePage
