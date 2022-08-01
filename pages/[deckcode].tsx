import { InferGetServerSidePropsType } from 'next'
import { FC, MouseEventHandler, useState } from 'react'
import { GetServerSidePropsContext } from 'next/types'
import { parseDeckcode, validateDeckcode } from '../lib/deckcode'
import { DeckInfograph } from '../components/DeckInfograph'
import { DeckMetadata } from '../components/DeckMetadata'
import { createTRPCClient } from '@trpc/client'
import { ServerRouter } from '../server/router'
import { useQuery } from 'react-query'
import { deckImageUrl } from '../lib/urls'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const DeckPage: FC<Props> = ({ deckcode, deck, error }) => {
  const { data: deckImageDataUri, isSuccess: isImageGenerated } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const blob = await fetch(deckImageUrl(deckcode!, true)).then((res) => res.blob())
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

  const [isDownloading, setIsDownloading] = useState(false)
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

  const downloadImageInterceptor: MouseEventHandler = (ev) => {
    if (isDownloading) {
      return ev.preventDefault()
    }

    setTimeout(() => {
      setIsDownloading(true)
    }, 0)
    setTimeout(() => {
      setIsDownloading(false)
    }, 5000)
  }

  const imageFilename = deck
    ? `${deck.title}_${deck.faction}_${deck.deckcodePruned}.png`
    : `${deckcode}.png`

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
          <button
            className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
            onClick={copyDeckcode}
          >
            Copy deckcode
          </button>
          <button
            className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
            onClick={copyImageUrl}
          >
            Copy image link
          </button>
          {isImageGenerated ? (
            <a
              className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
              href={deckImageDataUri}
              download={imageFilename}
            >
              Download as image
            </a>
          ) : (
            <a
              className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
              href={isDownloading ? '#' : deckImageUrl(deckcode!, true)}
              download={isDownloading ? undefined : imageFilename}
              onClick={downloadImageInterceptor}
            >
              Download as image
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { deckcode, snap } = context.query as { deckcode: string | undefined; snap: any }

  console.log({ deckcode, snap })
  const deck = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null
  const props = { deckcode, deck, error: deck === null ? 'Invalid deckcode' : null }

  const client = createTRPCClient<ServerRouter>({
    url: process.env.NEXT_PUBLIC_SITE_URL + '/api/trpc',
  })

  if (deckcode) {
    await client.mutation('ensureDeck', { deckcode })
  }

  return { props }
}

export default DeckPage
