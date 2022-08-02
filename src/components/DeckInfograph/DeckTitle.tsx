import { startCase } from 'lodash'
import { useDeck } from './useDeck'

export const DeckTitle = () => {
  const { general, title, faction } = useDeck()
  return (
    <div className="flex">
      <div className="w-32 mt-[-16px] mb-[-16px] ml-[-32px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/generals/${general.id}_hex@2x.png`}
          alt={general.title}
          className="w-full"
        />
      </div>
      <div className="flex flex-col flex-1 justify-center ml-2">
        <div className="font-bold text-3xl mb-2 ">{title}</div>
        <div className={`text-xl text-${faction}`}>{startCase(faction)}</div>
      </div>
    </div>
  )
}
