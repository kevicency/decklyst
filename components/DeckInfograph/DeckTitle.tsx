import { useDeck } from './useDeck'
import { startCase } from 'lodash'

export const DeckTitle = () => {
  const { general, title, faction } = useDeck()
  return (
    <div className="flex">
      <div className="w-24 mt-[-12px] ml-[-18px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/generals/${general.id}_hex@2x.png`}
          alt={general.title}
          className="w-24"
        />
      </div>
      <div className="flex flex-col flex-1 justify-around">
        <div className="font-bold text-3xl mb-2 ">{title}</div>
        <div className={`text-xl text-${faction}`}>{startCase(faction)}</div>
      </div>
    </div>
  )
}
