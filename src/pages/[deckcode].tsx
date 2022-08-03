import { parseDeckcode, validateDeckcode } from '@/common/deckcode'
import { deckImageUrl, siteUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import type { Deck } from '@/components/DeckInfograph/useDeck'
import { DeckMetadata } from '@/components/DeckMetadata'
import { OneTimeButton } from '@/components/OneTimeButton'
import type { ServerRouter } from '@/server/router'
import { createTRPCClient } from '@trpc/client'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React from 'react'
import { IoCodeWorking } from 'react-icons/io5'
import { MdDone, MdDownload, MdDownloadDone, MdLink } from 'react-icons/md'
import { useQuery } from 'react-query'

type Props = { deck?: Deck; snapshot: boolean }

const DeckPage: FC<Props> = ({ deck, snapshot }) => {
  const deckcode = deck?.deckcode ?? null
  const imageUrl = deckImageUrl(deckcode ?? '', true)
  const imageFilename = deck
    ? `${deck.title}_${deck.faction}_${deck.deckcodePruned}.png`
    : `${deckcode}.png`

  const { data: imageDataUri, isSuccess: isImageGenerated } = useQuery(
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
      enabled: Boolean(deckcode) && !snapshot,
      staleTime: Infinity,
    },
  )

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
        <OneTimeButton href={isImageGenerated ? imageDataUri : imageUrl} download={imageFilename}>
          {(isDownloading) => (
            <>
              {isDownloading ? (
                <MdDownloadDone className="mr-2" />
              ) : (
                <MdDownload className="mr-2" />
              )}
              Download image
            </>
          )}
        </OneTimeButton>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { deckcode: deckcodeOrShortid, snapshot } = context.query as {
    deckcode: string | undefined
    snapshot: any
  }
  let deckcode = deckcodeOrShortid
  let shortid = null

  if (deckcodeOrShortid) {
    const client = createTRPCClient<ServerRouter>({
      url: `${siteUrl}/api/trpc`,
    })

    const deck = +snapshot
      ? await client.query('resolveDeck', { deckcodeOrShortid })
      : await client.mutation('ensureDeck', { deckcodeOrShortid })

    if (deck) {
      deckcode = deck.deckcode
      shortid = deck.shortid
    }
  }
  const deckData = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null

  if (!deckData) {
    return { notFound: true }
  }

  return {
    props: {
      deck: { ...deckData, shortid },
      snapshot: +snapshot,
    },
  }
}

export default DeckPage
