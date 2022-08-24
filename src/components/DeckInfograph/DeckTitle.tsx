import { useDeck } from '@/context/useDeck'
import { startCase } from 'lodash'
import { FaRegEye } from 'react-icons/fa'

export const DeckTitle = () => {
  const { general, title, faction, meta } = useDeck()
  const viewCount = meta?.viewCount
  return (
    <div className="flex">
      <div className="w-32 mt-[-24px] mb-[-16px] ml-[-24px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/generals/${general.id}_hex@2x.png`}
          alt={general.title}
          className="w-full"
        />
      </div>
      <div className="flex flex-col flex-1 justify-center ml-2">
        <div className="font-bold text-3xl mb-2 truncate">{title}</div>
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
