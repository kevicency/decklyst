import { DeckMetadata } from '@/components/DeckMetadata'
import { PageHeader } from '@/components/PageHeader'
import { useDeck } from '@/context/useDeck'
import { useDeckActions } from '@/hooks/useDeckActions'
import { formatDistance } from 'date-fns'
import { noop } from 'lodash'
import Link from 'next/link'
import type { FC } from 'react'
import { useState } from 'react'
import { CardTooltip } from '../DeckInfograph/CardTooltip'
import { DeckArtifactList } from '../DeckInfograph/DeckArtifactList'
import { DeckCardList } from '../DeckInfograph/DeckCardList'
import { DeckMinionList } from '../DeckInfograph/DeckMinionList'
import { DeckSpellList } from '../DeckInfograph/DeckSpellList'
import { CompareIcon, CopyIcon, DoneIcon, EditIcon, ShareIcon } from '../Icons'
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
        <div className="absolute left-2 -top-4 z-40 h-32 flex-shrink-0">
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
        <div className="ml-24 -mb-12 flex flex-1 flex-col gap-y-4">
          <div className="flex flex-1 truncate text-3xl font-light">{deck.title || 'Untitled'}</div>
          <div className="flex items-center gap-x-4 text-sm text-gray-400">
            <div>
              <span>shared by </span>
              {meta.author ? (
                <span className="font-semibold text-accent-400">{meta.author.name}</span>
              ) : (
                <span className="font-semibold text-gray-300">Anonymous</span>
              )}
            </div>
            <div className={`text-lg font-bold text-${deck.faction}`}>•</div>
            <div>
              <span>created </span>
              <span className="font-semibold text-gray-300">
                {formatDistance(meta.createdAt!, new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            href={{ pathname: '/compare', query: { left: deck.deckcode } }}
            className="btn-outline"
          >
            <CompareIcon />
            Compare
          </Link>
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
      </PageHeader>
      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <div className="content-container mt-8 ">
          <DeckMetadata />
          <div className="mb-24 flex flex-col">
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
        <div className="content-container absolute inset-x-0 bottom-0 flex shrink-0 items-end gap-x-6 pt-2">
          <div className="font-sm flex-1 cursor-pointer text-gray-300">
            <div className="flex items-end">
              <OneTimeButton
                className={`btn border-b-2 border-alt-600 bg-alt-800 !py-2 hover:bg-${deck.faction}`}
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
              <input
                name="deckcode"
                className="page-header-input mt-2 w-full bg-alt-900 px-4 text-alt-200"
                value={deck.deckcode}
                onFocus={(ev) => {
                  ev.target.select()
                }}
                readOnly
                onChange={noop}
                aria-label="Deckcode"
              />
            </div>
          </div>
          <div className="font-sm text-right text-gray-300">
            Sharecode
            <div className={`mt-2 font-mono text-3xl text-${deck.faction}`}>{meta.sharecode}</div>
          </div>
        </div>
      </div>
      <CardTooltip />
      <ShareDeckDialog open={isShareDialogOpen} onClose={() => setShareDialogOpen(false)} />
    </div>
  )
}
