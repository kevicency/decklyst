import { useDeck } from '@/context/useDeck'
import { useSpriteLoader } from '@/context/useSpriteLoader'
import { startCase } from 'lodash'
import { useEffect, useRef } from 'react'
import { EyeIcon } from '../Icons'

export const DeckTitle = ({ showMeta }: { showMeta?: boolean }) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { general, title, faction, meta, spiritCost } = useDeck()
  const { setSpriteLoaded } = useSpriteLoader()
  const viewCount = meta?.viewCount

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
    <div className="flex flex-1">
      <div className="mt-[-24px] mb-[-16px] ml-[-24px] w-32 flex-shrink-0">
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
      <div className="ml-2 flex flex-1 flex-col justify-center">
        <div className="mb-2 overflow-hidden text-3xl font-bold">
          {title?.slice(0, 40) || 'Untitled'}
        </div>
        <div className={`flex content-center items-center gap-x-2 truncate text-xl`}>
          <span className={`text-${faction}`}>{startCase(faction)}</span>
          {showMeta && viewCount ? (
            <span className="flex items-center text-gray-400 group-hover:text-accent-600">
              <EyeIcon size={24} className="mr-2" />
              <span>
                {viewCount} {viewCount <= 1 ? 'view' : 'views'}
              </span>
            </span>
          ) : (
            <>
              <span className="h-full w-0.5 bg-alt-300"></span>
              <span className="flex items-center gap-x-1">
                <span className={`text-${faction} font-semibold`}>{spiritCost}</span> Spirit
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
