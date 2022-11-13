import { useDeck } from '@/context/useDeck'
import { useSpriteLoader } from '@/context/useSpriteLoader'
import { startCase } from 'lodash'
import Image from 'next/image'
import { useRef } from 'react'
import { EyeIcon } from '../Icons'

export const DeckTitle = ({ showMeta }: { showMeta?: boolean }) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { general, title, faction, meta } = useDeck()
  const { setSpriteLoaded } = useSpriteLoader()
  const viewCount = meta?.viewCount

  // useEffect(() => {
  //   if (imageRef.current) {
  //     const image = imageRef.current
  //     if (image.complete) {
  //       setSpriteLoaded(general.id)
  //     } else {
  //       image.onload = () => {
  //         setSpriteLoaded(general.id)
  //       }
  //     }
  //   }
  // }, [imageRef, setSpriteLoaded, general.id])
  return (
    <div className="flex flex-1">
      <div className="relative w-32 mt-[-24px] mb-[-16px] ml-[-24px] flex-shrink-0">
        <Image src={`/assets/generals/${general.id}_hex@2x.png`} fill alt={general.name} />
      </div>
      <div className="flex flex-col flex-1 justify-center ml-2">
        <div className="font-bold text-3xl mb-2 overflow-hidden">
          {title?.slice(0, 40) || 'Untitled'}
        </div>
        <div className={`text-xl flex gap-x-2 content-center items-center truncate`}>
          <span className={`text-${faction} w-24`}>{startCase(faction)}</span>
          {showMeta && viewCount ? (
            <span className="flex items-center text-black-400 group-hover:text-teal-600">
              <EyeIcon size={24} className="mr-2" />
              <span>
                {viewCount} {viewCount <= 1 ? 'view' : 'views'}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
