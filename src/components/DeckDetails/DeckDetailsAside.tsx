import type { FC } from 'react'
import { Aside } from '../Aside'
import { DeckManaCurve } from '../DeckInfograph/DeckManaCurve'
import { CardRarityChart } from './CardRarityChart'
import { CardTypeChart } from './CardTypeChart'
import { DeckStat } from './DeckStat'
import { FactionChart, OpeningHandChart } from './FactionChart'

export const DeckStats: FC = () => (
  <>
    <DeckStat title="Mana Curve">
      <div className="flex justify-center">
        <DeckManaCurve />
      </div>
    </DeckStat>
    <DeckStat title="Factions">
      <div className="w-full">
        <FactionChart />
      </div>
    </DeckStat>
    <DeckStat title="Opening Hand">
      <div className=" w-full">
        <OpeningHandChart />
      </div>
    </DeckStat>
    <DeckStat title="Card Types">
      <div className=" w-full">
        <CardTypeChart />
      </div>
    </DeckStat>
    <DeckStat title="Card Rarity">
      <div className="w-full">
        <CardRarityChart />
      </div>
    </DeckStat>
  </>
)

export const DeckDetailsAside: FC = () => {
  return (
    <Aside>
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-800 bg-alt-900 px-4 py-6">
          <h3 className="text-2xl">Stats</h3>
        </div>
        <div className="flex flex-col gap-y-4 overflow-y-auto py-4">
          <DeckStats />
        </div>
      </div>
    </Aside>
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
