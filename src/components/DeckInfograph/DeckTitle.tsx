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
    <div className="relative flex flex-1">
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
      <div className="ml-24 flex flex-1 flex-col justify-center">
        <div className="mb-2 overflow-hidden truncate text-3xl font-bold">
          {title?.slice(0, 40) || 'Untitled'}
        </div>
        <div className={`mb-1 flex content-center items-center gap-x-2 truncate text-xl`}>
          <span className={`text-${faction} font-semibold`}>{startCase(faction)}</span>
          {meta?.archetype && <span className={`text-gray-100`}>{startCase(meta?.archetype)}</span>}
          {/* <span className="mx-1 my-1 h-full w-0.5 bg-alt-500"></span>
          <span className={`text-${faction} font-semibold`}>{spiritCost}</span>
          <span className="text-gray-300">Spirit</span> */}
        </div>
        <div className="flex items-center gap-x-2 text-lg">
          <span className={`text-${faction} font-semibold`}>{spiritCost}</span>
          <span className="text-gray-300">Spirit</span>
        </div>
      </div>
    </div>
  )
}
