import { getImageDataUri } from '@/common/getImageDataUri'
import { deckImageUrl, deckUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'
import { deckcodeWithoutTitle$, faction$, title$ } from '@/data/deck'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useDeckActions = () => {
  const deck = useDeck()

  return useMemo(() => {
    const deckcode = deck?.deckcode ?? ''

    const copyDeckcode = async () => {
      if (deckcode) {
        await navigator.clipboard.writeText(deckcode)
      }
    }
    const copyDeckImageUrl = async () => {
      if (deckcode) {
        await navigator.clipboard.writeText(deckImageUrl(deckcode))
      }
    }
    const copyDeckUrl = async () => {
      const code = deck.meta?.sharecode ?? deckcode
      if (deckcode) {
        await navigator.clipboard.writeText(deckUrl(code))
      }
    }

    return { copyDeckcode, copyDeckImageUrl, copyDeckUrl }
  }, [deck])
}

export const useDeckImage = ({ renderOnly }: { renderOnly?: boolean } = {}) => {
  const deck = useDeck()
  const { deckcode } = deck

  const imageFilename = useMemo(
    () => `${title$(deck)}_${faction$(deck)}_${deckcodeWithoutTitle$(deck)}.png`,
    [deck],
  )

  const { mutateAsync: ensureDeckImage } = trpc.deckImage.ensure.useMutation()
  const { data: imageDataUriFromQuery, refetch: refetchDeckImage } = useQuery(
    ['deck-image', deckcode, { renderOnly }],
    async () => {
      const image = await ensureDeckImage({
        code: deckcode,
        renderOnly,
        sharecode: deck.meta?.sharecode,
      })

      return getImageDataUri(image)
    },
    {
      retry: true,
      retryDelay: (retryCount) => 1000 * Math.pow(2, Math.max(0, retryCount - 5)),
    },
  )
  const [imageDataUri, setImageDataUri] = useState<string | null>(imageDataUriFromQuery ?? null)

  const regenerateImage = useCallback(async () => {
    setImageDataUri(null)
    try {
      const image = await ensureDeckImage({
        code: deckcode,
        forceRerender: true,
        sharecode: deck.meta?.sharecode,
      })
      setImageDataUri(getImageDataUri(image))
    } catch (e) {
      await refetchDeckImage()
    }
  }, [deck.meta?.sharecode, deckcode, ensureDeckImage, refetchDeckImage])

  useEffect(() => {
    if (imageDataUriFromQuery && imageDataUri !== imageDataUriFromQuery) {
      setImageDataUri(imageDataUriFromQuery)
    }
  }, [imageDataUri, imageDataUriFromQuery])

  return { imageDataUri, imageFilename, regenerateImage }
}
