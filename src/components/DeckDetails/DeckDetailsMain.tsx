import { DeckMetadata } from '@/components/DeckMetadata'
import { PageHeader } from '@/components/PageHeader'
import { useAppShell } from '@/context/useAppShell'
import { useDeck } from '@/context/useDeck'
import { useDeckActions } from '@/hooks/useDeckActions'
import { trpc } from '@/utils/trpc'
import cx from 'classnames'
import { noop, startCase } from 'lodash'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { FC } from 'react'
import { useState } from 'react'
import { CardTooltip } from '../DeckInfograph/CardTooltip'
import { DeckArtifactList } from '../DeckInfograph/DeckArtifactList'
import { DeckCardList } from '../DeckInfograph/DeckCardList'
import { DeckMinionList } from '../DeckInfograph/DeckMinionList'
import { DeckSpellList } from '../DeckInfograph/DeckSpellList'
import { DeckTags } from '../DeckInfograph/DeckTags'
import { CopyIcon, DoneIcon, EditIcon, EyeIcon, LikeIcon, ShareIcon } from '../Icons'
import { LikeDeckDialog } from '../LikeDeckDialog'
import { OneTimeButton } from '../OneTimeButton'
import { TimeAgo } from '../TimeAgo'
import { DeckStats } from './DeckDetailsAside'
import { ShareDeckDialog } from './ShareDeckDialog'

export const DeckUpvote: FC<{ className?: string }> = ({ className }) => {
  const [showDialog, setShowDialog] = useState(false)
  const deck = useDeck()
  const session = useSession()
  const sharecode = deck.meta?.sharecode ?? ''
  const isMyDeck = deck.meta?.authorId && deck.meta?.authorId === session?.data?.user?.id
  const utils = trpc.useContext()
  const signedIn = session.status === 'authenticated'
  const { data: myVote, refetch } = trpc.deckVote.getMyVote.useQuery(
    { sharecode },
    {
      enabled: !!sharecode && !isMyDeck && signedIn,
    },
  )
  const { mutateAsync: toggleUpvote, isLoading: isVoting } =
    trpc.deckVote.toggleUpvote.useMutation()
  const canVote = !isMyDeck

  const handleVote = async () => {
    if (isVoting) return
    if (!signedIn) {
      setShowDialog(true)
      return
    }
    await toggleUpvote({ sharecode })
    await utils.decklyst.get.invalidate({ code: sharecode })
    await refetch()
  }

  return canVote ? (
    <>
      <button
        onClick={handleVote}
        className={cx(
          className,
          myVote?.vote === 1
            ? `text-${deck.faction} scale-110 hover:scale-100 hover:text-gray-300`
            : `text-gray-300 hover:text-${deck.faction} scale-100 hover:scale-110`,
          !signedIn && '!text-gray-500',
        )}
      >
        <LikeIcon size={24} />
      </button>
      <LikeDeckDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  ) : null
}

export const DeckDetailsMain: FC = () => {
  const deck = useDeck()
  const session = useSession()
  const [isShareDialogOpen, setShareDialogOpen] = useState(false)
  const { copyDeckcode } = useDeckActions()
  const [{ isMobile }] = useAppShell()

  const meta = deck.meta!
  const general = deck.general
  const isMyDeck = meta.authorId && meta.authorId === session?.data?.user?.id

  const handleDeleteDeck = () => {}

  return (
    <div className="bg-image-deckdetails relative flex flex-1 flex-col overflow-hidden grid-in-main">
      <PageHeader className="!px-0">
        <div className="content-container">
          <div className="-mt-1 grid grid-cols-[6rem_minmax(0,1fr)_auto]">
            <div className="relative">
              <div className="absolute -bottom-11 -left-4 z-50 w-24">
                <img
                  src={`/assets/generals/${general.id}_hex.png`}
                  srcSet={[
                    `/assets/generals/${general.id}_hex.png 1x`,
                    `/assets/generals/${general.id}_hex@2x.png 2x`,
                  ].join(',')}
                  alt={general.name}
                />
              </div>
            </div>
            <div className="flex items-baseline gap-x-3 pr-4">
              <div className="truncate text-3xl font-light">{deck.title || 'Untitled'}</div>
              <DeckUpvote className="ml-4" />
            </div>
            <div className="ml-2 flex items-center gap-x-2">
              {/* {isMyDeck && (
                <button
                  onClick={handleDeleteDeck}
                  className="btn-outline border-danger text-danger hover:bg-danger hover:text-gray-100"
                >
                  <TrashIcon />
                  <span className="hidden md:inline">Delete</span>
                </button>
              )} */}
              <Link
                href={{ pathname: '/build/[deckcode]', query: { deckcode: deck.deckcode } }}
                className="btn-outline"
              >
                <EditIcon />
                <span className="hidden md:inline">Edit</span>
              </Link>
              <button
                className={`btn-outline border-${deck.faction} text-${deck.faction} hover:bg-${deck.faction} hover:text-gray-100`}
                onClick={() => setShareDialogOpen(true)}
              >
                <ShareIcon />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </PageHeader>
      <DeckMetadata />
      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <div className="content-container">
          <div className="flex flex-col gap-y-3">
            <div className="mt-2 grid grid-cols-[6rem_minmax(0,1fr)_auto] gap-x-1">
              <div
                className={`font-mono text-3xl text-${deck.faction} mt-4 -ml-1 w-20 text-center`}
              >
                {meta.sharecode}
              </div>
              <div className="flex flex-col gap-y-0">
                <div className="flex gap-x-2 text-xl text-gray-300">
                  <span className={`text-${deck.faction}`}>{startCase(deck.faction)}</span>
                  {startCase(deck.meta?.archetype ?? '')}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-gray-400">
                  <div>
                    <span>created by&nbsp;</span>
                    {meta.author ? (
                      <Link
                        href={{
                          pathname: '/profile/[userId]',
                          query: { userId: deck.meta?.authorId },
                        }}
                        className="font-semibold text-accent-400 hover:underline"
                      >
                        {meta.author.name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-300">Anonymous</span>
                    )}
                  </div>
                  <div className={`hidden text-lg font-bold text-alt-400 sm:inline-block`}>•</div>
                  <div>
                    <span>last updated&nbsp;</span>
                    <span className="font-semibold text-gray-300">
                      <TimeAgo date={meta.updatedAt} />
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-wrap items-end justify-center gap-2 px-4">
                {deck.meta?.tags?.map((tag) => (
                  <Tag tag={tag} key={tag} size={deck.meta?.tags.length! > 4 ? 'sm' : 'default'} />
                ))}
              </div> */}
              <div className="flex items-center gap-x-3 text-xl font-semibold text-gray-100">
                <div className="flex items-baseline gap-x-1">
                  <LikeIcon className="pt-1 text-gray-400" size={22} /> {meta.likes}
                </div>
                <div className="flex items-center gap-x-1.5">
                  <EyeIcon className="text-gray-400" size={22} /> {meta.views}
                </div>
                <div className={`font-mono text-3xl text-${deck.faction} w-20 text-center`}>
                  {meta.sharecode}
                </div>
              </div>
            </div>
            <div className="relative -mb-1 w-full">
              <input
                name="deckcode"
                className="page-header-input w-full bg-alt-800 px-4 pr-24 text-alt-200"
                value={deck.deckcode}
                onFocus={(ev) => {
                  ev.target.select()
                }}
                readOnly
                onChange={noop}
                aria-label="Deckcode"
              />
              <OneTimeButton
                className={`btn absolute bottom-0.5 right-0 top-0 bg-alt-900 `}
                onClick={copyDeckcode}
                timeout={2500}
              >
                {(copied) => (
                  <>
                    {copied ? <DoneIcon /> : <CopyIcon />}
                    Copy
                  </>
                )}
              </OneTimeButton>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-row-reverse justify-between gap-x-6">
                <div className="mt-0.5 flex items-center gap-x-2 text-lg">
                  <span className={`text-${deck.faction} font-semibold`}>{deck.spiritCost}</span>
                  <span className="text-gray-300">Spirit</span>
                </div>
                <DeckTags />
              </div>
              <DeckMinionList variant="details" />
              <div className="flex justify-between">
                <DeckSpellList variant="details" />
                <DeckArtifactList variant="details" />
              </div>
              <div className="mt-2 px-2">
                <DeckCardList />
              </div>
            </div>
          </div>
        </div>
        {isMobile && (
          <div className="mt-12 flex flex-col px-2">
            <h3 className="mb-6 px-4 text-3xl font-thin text-gray-100">Stats</h3>
            <div className="flex w-full flex-col gap-y-4">
              <DeckStats />
            </div>
          </div>
        )}
      </div>
      <CardTooltip />
      <ShareDeckDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} />
    </div>
  )
}
