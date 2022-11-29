import { DeckMetadata } from '@/components/DeckMetadata'
import { PageHeader } from '@/components/PageHeader'
import { useDeck } from '@/context/useDeck'
import { useDeckActions } from '@/hooks/useDeckActions'
import { formatDistance } from 'date-fns'
import { noop, startCase } from 'lodash'
import Link from 'next/link'
import type { FC } from 'react'
import { useState } from 'react'
import { CardTooltip } from '../DeckInfograph/CardTooltip'
import { DeckArtifactList } from '../DeckInfograph/DeckArtifactList'
import { DeckCardList } from '../DeckInfograph/DeckCardList'
import { DeckMinionList } from '../DeckInfograph/DeckMinionList'
import { DeckSpellList } from '../DeckInfograph/DeckSpellList'
import { CopyIcon, DoneIcon, EditIcon, EyeIcon, ShareIcon } from '../Icons'
import { OneTimeButton } from '../OneTimeButton'
import { ShareDeckDialog } from './ShareDeckDialog'

export const DeckDetailsMain: FC = () => {
  const deck = useDeck()
  const [isShareDialogOpen, setShareDialogOpen] = useState(false)
  const { copyDeckcode } = useDeckActions()

  const meta = deck.meta!
  const general = deck.general

  return (
    <div className="bg-image-deckdetails relative flex flex-1 flex-col overflow-hidden grid-in-main">
      <PageHeader>
        <div className="content-container">
          <div className="-mt-1 grid grid-cols-[6rem_minmax(0,1fr)_max-content]">
            <div className="relative">
              <div className="absolute -bottom-11 -left-4 z-50 w-24">
                <img
                  src={`/assets/generals/${general.id}_hex.png`}
                  srcSet={[
                    `/assets/generals/${general.id}_hex.png 1x`,
                    `/assets/generals/${general.id}_hex@2x.png 2x`,
                  ].join(',')}
                  alt={general.name}
                  className="h-full"
                />
              </div>
            </div>
            <div className="flex flex-1 truncate text-3xl font-light">
              {deck.title || 'Untitled'}
            </div>
            <div className="grid shrink-0 grid-cols-2 items-center gap-x-2">
              <Link
                href={{ pathname: '/build/[deckcode]', query: { deckcode: deck.deckcode } }}
                className="btn-outline"
              >
                <EditIcon />
                Edit
              </Link>
              <button
                className={`btn-outline border-${deck.faction} text-${deck.faction} hover:bg-${deck.faction} hover:text-gray-100`}
                onClick={() => setShareDialogOpen(true)}
              >
                <ShareIcon />
                Share
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
              <div className="flex items-end gap-x-2 pl-2 pb-1 text-xl font-semibold text-gray-100">
                <EyeIcon className="mb-[1px] text-gray-400" size={24} /> {meta.views}
              </div>
              <div className="flex flex-col gap-y-0">
                <div className="flex gap-x-2 text-xl text-gray-300">
                  <span className={`text-${deck.faction}`}>{startCase(deck.faction)}</span>
                  {startCase(deck.meta?.archetype ?? '')}
                </div>
                <div className=" text-gray-400">
                  <span>created by </span>
                  {meta.author ? (
                    <span className="font-semibold text-accent-400">{meta.author.name}</span>
                  ) : (
                    <span className="font-semibold text-gray-300">Anonymous</span>
                  )}
                  <span className={`mx-2 text-lg font-bold text-alt-400`}>•</span>
                  <span>last updated </span>
                  <span className="font-semibold text-gray-300">
                    {formatDistance(meta.updatedAt!, new Date(), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className={`font-mono text-3xl text-${deck.faction}`}>{meta.sharecode}</div>
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
            <DeckMinionList variant="details" />
            <div className="mb-8 flex justify-between">
              <DeckSpellList variant="details" />
              <DeckArtifactList variant="details" />
            </div>
            <div className="mt-2 px-2">
              <DeckCardList />
            </div>
          </div>
        </div>
      </div>
      <CardTooltip />
      <ShareDeckDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} />
    </div>
  )
}
