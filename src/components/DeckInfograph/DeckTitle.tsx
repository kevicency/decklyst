import { useDeck } from '@/context/useDeck'
import { useSpriteLoader } from '@/context/useSpriteLoader'
import { startCase } from 'lodash'
import { useEffect, useRef } from 'react'
import { FaRegEye } from 'react-icons/fa'

export const DeckTitle = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { general, title, faction, meta } = useDeck()
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
    <div className="flex">
      <div className="w-32 mt-[-24px] mb-[-16px] ml-[-24px] flex-shrink-0">
        <img
          ref={imageRef}
          src={`/assets/generals/${general.id}_hex@2x.png`}
          alt={general.name}
          className="w-full"
        />
      </div>
      <div className="flex flex-col flex-1 justify-center ml-2">
        <div className="font-bold text-3xl mb-2 truncate">{title || 'Untitled'}</div>
        <div className={`text-xl flex gap-2 content-center items-center text-slate-400 truncate`}>
          <span className={`text-${faction} w-24`}>{startCase(faction)}</span>
          {viewCount ? (
            <>
              <FaRegEye size={24} />
              <span className="">
                {viewCount} {viewCount <= 1 ? 'view' : 'views'}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
