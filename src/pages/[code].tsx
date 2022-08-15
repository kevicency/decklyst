import { validateDeckcode } from '@/common/deckcode'
import { deckImageUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import type { Deck } from '@/components/DeckInfograph/useDeck'
import { createDeck } from '@/components/DeckInfograph/useDeck'
import { DeckMetadata } from '@/components/DeckMetadata'
import { OneTimeButton } from '@/components/OneTimeButton'
import { createSsrClient } from '@/server'
import { getIpAddress } from '@/server/utils'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React from 'react'
import { IoCodeWorking } from 'react-icons/io5'
import { MdDone, MdDownload, MdDownloadDone, MdLink } from 'react-icons/md'
import { useQuery } from 'react-query'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'

type Props = { deck?: Deck; snapshot: boolean; imageDataUri?: string | null }

const DeckPage: FC<Props> = ({ deck, snapshot, imageDataUri: ssrImageDataUri }) => {
  const deckcode = deck?.deckcode ?? null
  const imageUrl = deckImageUrl(deckcode ?? '', true)
  const imageFilename = deck
    ? `${deck.title}_${deck.faction}_${deck.deckcodePruned}.png`
    : `${deckcode}.png`

  const { data: fetchedImageDataUri } = useQuery(
    ['deck-image', deckcode],
    async () => {
      let dataUri = ''
      let retries = 0

      while (retries++ < 3) {
        const blob = await fetch(imageUrl).then((res) => res.blob())
        const reader = new FileReader()

        dataUri = await new Promise<string>((resolve) => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
        })
        if (/^data:image\/png;base64,/.test(dataUri)) {
          return dataUri
        } else {
          await new Promise((resolve) => setTimeout(resolve, 250))
        }
      }
      return Promise.reject('image generation failed')
    },
    {
      enabled: Boolean(deckcode) && !ssrImageDataUri && !snapshot,
      staleTime: Infinity,
    },
  )

  const imageDataUri = ssrImageDataUri ?? fetchedImageDataUri ?? ''

  const copyDeckcode = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(deckcode)
    }
  }
  const copyImageUrl = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(deckImageUrl(deckcode))
    }
  }

  if (!deck) return null

  return (
    <div className="content-container mt-8">
      <DeckMetadata deck={deck} />
      <DeckInfograph deck={deck} />
      <div className="mt-6 grid grid-cols-3 auto-cols-auto gap-4">
        <OneTimeButton onClick={copyDeckcode} timeout={2500}>
          {(copied) => (
            <>
              {copied ? <MdDone className="mr-2" /> : <IoCodeWorking className="mr-2" />}
              Copy deckcode
            </>
          )}
        </OneTimeButton>
        <OneTimeButton onClick={copyImageUrl} timeout={2500}>
          {(copied) => (
            <>
              {copied ? <MdDone className="mr-2" /> : <MdLink className="mr-2" />}
              Copy image url
            </>
          )}
        </OneTimeButton>
        <OneTimeButton href={imageDataUri} download={imageFilename} disabled={!imageDataUri}>
          {(isDownloading) =>
            imageDataUri ? (
              <>
                {isDownloading ? (
                  <MdDownloadDone className="mr-2" />
                ) : (
                  <MdDownload className="mr-2" />
                )}
                Download image
              </>
            ) : (
              <>
                <BounceLoader
                  size={18}
                  speedMultiplier={0.66}
                  color={colors.slate['400']}
                  className="mr-2"
                />
                <span className="text-slate-400">Generating image</span>
              </>
            )
          }
        </OneTimeButton>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const code = query.code as string | undefined
  const snapshot = +((query.snapshot as string | undefined) ?? '0') === 1

  const client = await createSsrClient()

  let deckcode = code
  let sharecode = null

  if (code) {
    const deck = snapshot
      ? await client.query('getDeckinfo', { code })
      : await client.mutation('ensureDeckinfo', { code })

    deckcode = deck?.deckcode ?? deckcode
    sharecode = deck?.sharecode ?? sharecode
  }

  const deck = validateDeckcode(deckcode) ? createDeck(deckcode, { sharecode }) : null

  if (!deck) {
    return { notFound: true }
  }

  if (!snapshot) {
    await client.mutation('registerView', {
      deckcode: deckcode!,
      ipAddress: getIpAddress(req),
    })
  }

  const image = await client.query('getDeckimage', { deckcode: deckcode!, timeout: 250 })

  const imageDataUri = image ? `data:image/png;base64,${image.toString('base64')}` : null

  return {
    props: {
      deck,
      imageDataUri,
      snapshot: +snapshot,
    },
  }
}

export default DeckPage
