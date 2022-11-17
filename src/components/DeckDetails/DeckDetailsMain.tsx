import { DeckMetadata } from '@/components/DeckMetadata'
import { PageHeader } from '@/components/PageHeader'
import { useDeck } from '@/context/useDeck'
import { useDeckActions, useDeckImage } from '@/hooks/useDeckActions'
import { formatDistance } from 'date-fns'
import { noop } from 'lodash'
import type { FC, ReactNode } from 'react'
import { Aside } from '../Aside'
import { CardTooltip } from '../DeckInfograph/CardTooltip'
import { DeckArtifactList } from '../DeckInfograph/DeckArtifactList'
import { DeckCardList } from '../DeckInfograph/DeckCardList'
import { DeckCounts } from '../DeckInfograph/DeckCounts'
import { DeckManaCurve } from '../DeckInfograph/DeckManaCurve'
import { DeckMinionList } from '../DeckInfograph/DeckMinionList'
import { DeckSpellList } from '../DeckInfograph/DeckSpellList'

export const DeckDetailsMain: FC = () => {
  const deck = useDeck()
  const { imageDataUri, imageFilename, regenerateImage } = useDeckImage()
  const { copyDeckImageUrl, copyDeckcode } = useDeckActions()

  const meta = deck.meta!
  const general = deck.general

  return (
    <div className="bg-blur-image flex flex-1 flex-col overflow-hidden bg-gray-1000 grid-in-main">
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
        <div className="ml-24 flex flex-1 truncate text-3xl font-light">
          {deck.title || 'Untitled'}
        </div>
        <div className="flex flex-col items-end justify-end gap-y-1 text-sm text-gray-400">
          <div>
            shared &nbsp;
            <span className="font-semibold text-gray-300">
              {formatDistance(meta.createdAt!, new Date(), { addSuffix: true })}
            </span>
          </div>
          <div>
            created by &nbsp;
            <span className="font-semibold text-gray-300">Anonymous</span>
          </div>
        </div>
      </PageHeader>
      <DeckMetadata />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="content-container my-8">
          <div className="mb-24 flex flex-col">
            <DeckMinionList variant="details" />
            <div className="mb-8 flex justify-between">
              <DeckSpellList variant="details" />
              <DeckArtifactList variant="details" />
            </div>
            <DeckCardList />
          </div>
          <div className="flex gap-x-8">
            <label className="font-sm flex-1 cursor-pointer text-gray-300">
              Deckcode <span className="text-gray-400">(click to copy)</span>
              <input
                name="deckcode"
                className="page-header-input mt-2 w-full bg-alt-900 px-4 text-alt-200"
                value={deck.deckcode}
                onFocus={(ev) => {
                  copyDeckcode()
                  setTimeout(() => ev.target.select(), 50)
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
          {/* <div className="mt-4 mr-4 flex items-center justify-end gap-x-2 text-sm text-alt-500">
            <span>Image broken?</span>
            <button
              disabled={!imageDataUri}
              onClick={regenerateImage}
              className="text-alt-400 hover:text-accent-400 disabled:hover:text-alt-400"
            >
              Regenerate
            </button>
          </div> */}
        </div>
      </div>
      <CardTooltip />
    </div>
  )
}

export const DeckDetailsAside: FC = () => {
  return (
    <Aside>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 bg-alt-900 px-4 py-6">
          <h3 className="text-2xl">Stats</h3>
        </div>
        <DeckStat title="Mana Curve">
          <div className="flex justify-center">
            <DeckManaCurve />
          </div>
        </DeckStat>
        <DeckStat title="Card Types">
          <DeckCounts />
        </DeckStat>
      </div>
    </Aside>
  )
}

export const DeckStat: FC<{ title: ReactNode; children: ReactNode }> = ({ children, title }) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-y-2 px-4">
      <div className="text-semibold flex items-center justify-between font-semibold text-gray-300">
        {title}
      </div>
      {children}
    </div>
  )
}
{
  /* <div className="text-sm text-gray-300">
          {meta.viewCount && (
            <div className="flex items-center gap-x-2">
              <EyeIcon />
              <span className="font-bold">{meta.viewCount}</span>
              <span>{meta.viewCount === 1 ? 'view' : 'views'}</span>
            </div>
          )}
          {meta.createdAt && (
            <div className="flex items-center gap-x-2">
              <ClockIcon />
              Created
              <span className="font-bold">
                {formatDistance(meta.createdAt, new Date(), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-x-4">
          <OneTimeButton onClick={copyDeckcode} timeout={2500}>
            {(copied) => (
              <>
                {copied ? <DoneIcon /> : <CopyIcon />}
                Copy deckcode
              </>
            )}
          </OneTimeButton>
          <OneTimeButton onClick={copyDeckImageUrl} timeout={2500}>
            {(copied) => (
              <>
                {copied ? <DoneIcon /> : <LinkIcon />}
                Copy image url
              </>
            )}
          </OneTimeButton>
          <OneTimeButton
            href={imageDataUri ?? undefined}
            download={imageFilename}
            disabled={!imageDataUri}
          >
            {(isDownloading) =>
              imageDataUri ? (
                <>
                  {isDownloading ? <DownloadDoneIcon /> : <DownloadIcon />}
                  Download image &nbsp;
                </>
              ) : (
                <>
                  <BounceLoader
                    size={18}
                    speedMultiplier={0.66}
                    color={colors.gray['400']}
                    className="mr-2"
                  />
                  <span className="text-alt-400">Generating image</span>
                </>
              )
            }
          </OneTimeButton>
        </div>
        <div className="flex gap-x-4">
          <Link
            href={{ pathname: '/compare', query: { left: deck.deckcode } }}
            prefetch={false}
            className="btn"
          >
            <CompareIcon /> Compare
          </Link>
          <Link
            href={{
              pathname: '/build/[deckcode]',
              query: { deckcode: deck.deckcode },
            }}
            className="btn"
          >
            <BuildIcon /> Open in deckbuilder
          </Link>
        </div> */
}
