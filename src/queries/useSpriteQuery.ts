import { useSpriteLoader } from '@/context/useSpriteLoader'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

export const useSpriteQuery = (cardId: number) => {
  const { setSpriteLoaded } = useSpriteLoader()

  const spriteImageUrl = `/assets/sprites/${cardId}.png`

  const result = useQuery(['sprite', cardId], async () => {
    const response = await fetch(spriteImageUrl)
    const blob = await response.blob()
    const blobUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
    const img = new Image()
    const promise = new Promise<{ cardId: number; width: number; height: number; src: string }>(
      (resolve) => {
        img.onload = () => {
          resolve({
            cardId,
            width: img.naturalWidth,
            height: img.naturalHeight,
            src: blobUrl,
          })
        }
      },
    )
    img.src = blobUrl

    return promise
  })

  useEffect(() => {
    if (result.isSuccess) {
      setSpriteLoaded(cardId)
      console.log('sprite loaded', cardId)
    }
  }, [result.isSuccess, setSpriteLoaded, cardId])

  return result
}
