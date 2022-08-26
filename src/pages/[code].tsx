import { getImageDataUri } from '@/common/getImageDataUri'
import { trpc } from '@/common/trpc'
import { deckImageUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckMetadata } from '@/components/DeckMetadata'
import { OneTimeButton } from '@/components/OneTimeButton'
import { DeckProvider } from '@/context/useDeck'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { Deck } from '@/data/deck'
import { createDeck, deckcodeWithoutTitle$, faction$, title$ } from '@/data/deck'
import { validateDeckcode } from '@/data/deckcode'
import { createSsrClient } from '@/server'
import { getIpAddress } from '@/server/utils'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import { IoCodeWorking } from 'react-icons/io5'
import { MdDone, MdDownload, MdDownloadDone, MdLink } from 'react-icons/md'
import { useQuery } from 'react-query'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'

type Props = { deck: Deck; meta: { sharecode?: string }; isSnapshot: boolean }

const DeckPage: FC<Props> = ({ deck, meta, isSnapshot }) => {
  const [imageDataUri, setImageDataUri] = React.useState<string | null>(null)

  const deckcode = deck.deckcode
  const imageFilename = useMemo(
    () => `${title$(deck)}_${faction$(deck)}_${deckcodeWithoutTitle$(deck)}.png`,
    [deck],
  )

  const { mutateAsync: ensureDeckimage } = trpc.useMutation('ensureDeckimage')
  const { refetch: refetchDeckimage } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const image = await ensureDeckimage({ deckcode })

      return getImageDataUri(image)
    },
    {
      enabled: !isSnapshot,
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
      const image = await ensureDeckimage({ deckcode, forceRender: true })
      setImageDataUri(getImageDataUri(image))
    } catch (e) {
      await refetchDeckimage()
    }
  }

  if (!deck) return null

  return (
    <DeckProvider deck={deck} meta={meta}>
      <div className="content-container my-8">
        <DeckMetadata />
        <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
          <DeckInfograph />
        </SpriteLoaderProvider>
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
            className="text-slate-400 hover:text-sky-400 disabled:hover:text-slate-400"
          >
            Regenerate
          </button>
        </div>
      </div>
    </DeckProvider>
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

  if (!validateDeckcode(deckcode)) {
    return { notFound: true }
  }

  const deck = createDeck(deckcode)

  if (deck.cards.length === 0) {
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
      meta: { sharecode },
      isSnapshot: Boolean(+snapshot),
    },
  }
}

export default DeckPage
