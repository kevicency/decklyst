import { useDeck } from '@/context/useDeck'
import { useSpriteLoader } from '@/context/useSpriteLoader'
import { startCase } from 'lodash'
import { useEffect, useRef } from 'react'

export const DeckTitle = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { general, title, faction, spiritCost, meta } = useDeck()
  const { setSpriteLoaded } = useSpriteLoader()

  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current
      if (image.complete) {
        setSpriteLoaded(general.id)
      } else {
        image.onload = () => {
          setSpriteLoaded(general.id)
        }
      }
    }
  }, [imageRef, setSpriteLoaded, general.id])
  return (
    <div className="relative grid w-full grid-cols-[6rem_minmax(0,1fr)]">
      <div className="absolute -bottom-1 -left-6 w-32 flex-shrink-0">
        <img
          ref={imageRef}
          src={`/assets/generals/${general.id}_hex.png`}
          srcSet={[
            `/assets/generals/${general.id}_hex.png 1x`,
            `/assets/generals/${general.id}_hex@2x.png 2x`,
          ].join(',')}
          alt={general.name}
          className="w-full"
        />
      </div>
      <div />
      <div className="flex w-full flex-col justify-center">
        <div className="mb-2 w-full min-w-0 truncate text-3xl font-bold">{title || 'Untitled'}</div>
        <div className={`mb-1 flex content-center items-center gap-x-2 text-xl`}>
          <span className={`text-${faction} font-semibold`}>{startCase(faction)}</span>
          {meta?.archetype && <span className={`text-gray-100`}>{startCase(meta?.archetype)}</span>}
        </div>
        <div className="flex items-center gap-x-2 text-lg">
          <span className={`text-${faction} font-semibold`}>{spiritCost}</span>
          <span className="text-gray-300">Spirit</span>
        </div>
      </div>
    </div>
  )
}
