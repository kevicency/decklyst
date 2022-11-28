import { DeckPreviewList } from '@/components/DeckPreviewList'
import { PageHeader } from '@/components/PageHeader'
import { createDeckFromDecklyst } from '@/data/deck'
import { createContextInner, createSSGClient } from '@/server'
import { trpc } from '@/utils/trpc'
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { signOut, useSession } from 'next-auth/react'
import type { FC } from 'react'
import { useMemo } from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const UserProfilePage: FC<Props> = (props) => {
  const session = useSession()
  const { data } = trpc.userProfile.get.useQuery(
    { id: props.userProfile.id },
    {
      initialData: props.userProfile,
    },
  )
  const userProfile = data ?? props.userProfile
  const isMyProfile = userProfile.id === session?.data?.user?.id

  const decks = useMemo(
    () => userProfile.decklysts.map((decklyst) => createDeckFromDecklyst(decklyst)),
    [userProfile.decklysts],
  )

  return (
    <div className="grid-in-main">
      <PageHeader>
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
        <div className="content-container mt-8 flex flex-col">
          <div className="text-center text-lg text-health">!!! HERE BE DRAGONS !!!</div>
          <div className="mb-6 text-2xl">{isMyProfile ? 'my' : `${userProfile.name}'s`} decks</div>
          {decks.length ? (
            <DeckPreviewList decks={decks} />
          ) : (
            <div className="text-center">No decks found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { prisma } = await createContextInner()
  const users = await prisma.user.findMany({
    select: { id: true },
  })

  return {
    paths: users.map(({ id }) => `/profile/${encodeURIComponent(id)}`),
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ userId?: string }>) => {
  const userId = ctx.params?.userId as string | undefined

  if (!userId) {
    return { notFound: true }
  }

  const ssg = await createSSGClient()
  const userProfile = await ssg.userProfile.get.fetch({ id: userId })

  return userProfile
    ? {
        props: {
          userProfile,
          trpcState: ssg.dehydrate(),
        },
      }
    : { notFound: true, revalidate: true }
}
export default UserProfilePage
