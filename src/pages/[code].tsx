import { validateDeckcode } from '@/common/deckcode'
import { trpc } from '@/common/trpc'
import { deckImageUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import type { Deck } from '@/components/DeckInfograph/useDeck'
import { createDeck } from '@/components/DeckInfograph/useDeck'
import { DeckMetadata } from '@/components/DeckMetadata'
import { OneTimeButton } from '@/components/OneTimeButton'
import { getImageDataUri } from '@/common/getImageDataUri'
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

type Props = { deck: Deck; snapshot: boolean }

const DeckPage: FC<Props> = ({ deck, snapshot }) => {
  const [imageDataUri, setImageDataUri] = React.useState<string | null>(null)

  const deckcode = deck.deckcode
  const imageUrl = deckImageUrl(deckcode)
  const imageFilename = deck
    ? `${deck.title}_${deck.faction}_${deck.deckcodePruned}.png`
    : `${deckcode}.png`

  const { mutateAsync: regenerateDeckimage } = trpc.useMutation('renderDeckimage')
  const { refetch: refetchDeckimage } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const blob = await fetch(imageUrl).then((res) => res.blob())
      const reader = new FileReader()

      const dataUri = await new Promise<string>((resolve) => {
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
      })
      return /^data:image\/png;base64,/.test(dataUri)
        ? dataUri
        : Promise.reject(new Error('image retrieval failed'))
    },
    {
      enabled: !snapshot,
      staleTime: Infinity,
      retry: true,
      retryDelay: (retryCount) => 1000 * Math.pow(2, Math.max(0, retryCount - 5)),
      onSuccess: (dataUri) => setImageDataUri(dataUri),
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

  const handleRegenerateClick = () => async () => {
    setImageDataUri(null)
    try {
      const image = await regenerateDeckimage({ deckcode })
      setImageDataUri(getImageDataUri(image))
    } catch (e) {
      await refetchDeckimage()
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
        <OneTimeButton
          href={imageDataUri ?? undefined}
          download={imageFilename}
          disabled={!imageDataUri}
        >
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
      <div className="mt-4 flex gap-x-2 justify-end items-center text-slate-500 text-sm">
        <span>Image broken?</span>
        <button
          disabled={!imageDataUri}
          onClick={handleRegenerateClick()}
          className="text-slate-400 hover:text-sky-400"
        >
          Regenerate
        </button>
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

  return {
    props: {
      deck,
      snapshot: +snapshot,
    },
  }
}

export default DeckPage
