import { parseDeckcode, validateDeckcode } from '@/common/deckcode'
import { deckImageUrl, siteUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckMetadata } from '@/components/DeckMetadata'
import { OneTimeButton } from '@/components/OneTimeButton'
import type { ServerRouter } from '@/server/router'
import { createTRPCClient } from '@trpc/client'
import type { InferGetServerSidePropsType } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React from 'react'
import { IoCodeWorking } from 'react-icons/io5'
import { MdDone, MdDownload, MdDownloadDone, MdLink } from 'react-icons/md'
import { useQuery } from 'react-query'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const DeckPage: FC<Props> = ({ deckcode, deck, error }) => {
  const imageUrl = deckImageUrl(deckcode ?? '', true)
  const imageFilename = deck
    ? `${deck.title}_${deck.faction}_${deck.deckcodePruned}.png`
    : `${deckcode}.png`

  const { data: imageDataUri, isSuccess: isImageGenerated } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const blob = await fetch(imageUrl).then((res) => res.blob())
      const reader = new FileReader()

      return await new Promise<string>((resolve) => {
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
      })
    },
    {
      enabled: Boolean(deckcode),
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

  return (
    <div className="content-container">
      <DeckMetadata deck={deck} />
      {deck ? (
        <div className="p-6 bg-slate-900" id="snap">
          <DeckInfograph deck={deck} />
        </div>
      ) : (
        <div className="px-4 my-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      {deck && (
        <div className="mt-4 grid grid-cols-3 auto-cols-auto gap-4">
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
      )}
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { deckcode, snapshot } = context.query as { deckcode: string | undefined; snapshot: any }
  const deck = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null
  const props = { deckcode, deck, error: deck === null ? 'Invalid deckcode' : null }

  if (deckcode && !+snapshot) {
    const client = createTRPCClient<ServerRouter>({
      url: `${siteUrl}/api/trpc`,
    })

    await client.mutation('ensureDeck', { deckcode })
  }

  return { props }
}

export default DeckPage
