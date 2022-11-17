import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckMetadata } from '@/components/DeckMetadata'
import {
  BuildIcon,
  ClockIcon,
  CompareIcon,
  CopyIcon,
  DoneIcon,
  DownloadDoneIcon,
  DownloadIcon,
  EyeIcon,
  LinkIcon,
} from '@/components/Icons'
import { OneTimeButton } from '@/components/OneTimeButton'
import { PageHeader } from '@/components/PageHeader'
import { useDeck } from '@/context/useDeck'
import { useDeckActions, useDeckImage } from '@/hooks/useDeckActions'
import { formatDistance } from 'date-fns'
import { noop } from 'lodash'
import Link from 'next/link'
import type { FC } from 'react'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'
import { Aside } from '../Aside'

export const DeckDetailsMain: FC = () => {
  const deck = useDeck()
  const { imageDataUri, imageFilename, regenerateImage } = useDeckImage()
  const { copyDeckImageUrl, copyDeckcode } = useDeckActions()

  const meta = deck.meta ?? {}

  return (
    <div className="flex flex-1 flex-col overflow-hidden grid-in-main">
      <PageHeader>
        <div className="text-sm text-gray-300">
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
        </div>
      </PageHeader>
      <DeckMetadata />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="content-container my-8">
          <DeckInfograph />
          <div>
            <input
              name="deckcode"
              className="page-header-input w-full bg-alt-900 px-4 text-alt-200"
              value={deck.deckcode}
              onFocus={(ev) => setTimeout(() => ev.target.select(), 50)}
              readOnly
              onChange={noop}
              aria-label="Deckcode"
            />
          </div>
          <div className="mt-4 mr-4 flex items-center justify-end gap-x-2 text-sm text-alt-500">
            <span>Image broken?</span>
            <button
              disabled={!imageDataUri}
              onClick={regenerateImage}
              className="text-alt-400 hover:text-accent-400 disabled:hover:text-alt-400"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DeckDetailsAside: FC = () => {
  return (
    <Aside>
      <span>NYI</span>
    </Aside>
  )
}
