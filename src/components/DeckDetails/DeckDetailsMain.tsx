import { DeckMetadata } from '@/components/DeckMetadata'
import { PageHeader } from '@/components/PageHeader'
import { useDeck } from '@/context/useDeck'
import { useDeckActions, useDeckImage } from '@/hooks/useDeckActions'
import { formatDistance } from 'date-fns'
import { noop } from 'lodash'
import type { FC } from 'react'
import { CardTooltip } from '../DeckInfograph/CardTooltip'
import { DeckArtifactList } from '../DeckInfograph/DeckArtifactList'
import { DeckCardList } from '../DeckInfograph/DeckCardList'
import { DeckMinionList } from '../DeckInfograph/DeckMinionList'
import { DeckSpellList } from '../DeckInfograph/DeckSpellList'

export const DeckDetailsMain: FC = () => {
  const deck = useDeck()
  const { imageDataUri, imageFilename, regenerateImage } = useDeckImage()
  const { copyDeckImageUrl, copyDeckcode } = useDeckActions()

  const meta = deck.meta!
  const general = deck.general

  return (
    <div className="bg-blur-image relative flex flex-1 flex-col overflow-hidden bg-gray-1000 grid-in-main">
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
              <span className="font-semibold text-gray-300">Anonymous</span>
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
        <div className="content-container absolute inset-x-0 bottom-0 flex shrink-0 gap-x-6 pt-2">
          <label className="font-sm flex-1 cursor-pointer text-gray-300">
            &nbsp;
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
          </label>
          <div className="font-sm text-right text-gray-300">
            Sharecode
            <div className={`mt-2 font-mono text-3xl text-${deck.faction}`}>{meta.sharecode}</div>
          </div>
        </div>
      </div>
      <CardTooltip />
    </div>
  )
}
