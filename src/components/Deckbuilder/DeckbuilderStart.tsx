import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { cards, factions } from '@/data/cards'
import { groupBy, startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo } from 'react'

export const DeckbuilderStart: FC<{
  onSelectGeneral: CardHandler
}> = ({ onSelectGeneral }) => {
  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-end justify-between gap-x-8 pb-4 pt-6 px-8 bg-gray-800 shadow-lg shadow-dark z-20">
        <div className="text-4xl font-light">Deckbuilder</div>
        <div className="text-2xl text-black-200">Choose a general to start</div>
      </div>
      <div className="flex flex-wrap flex-1 justify-center text-center overflow-y-auto pt-8">
        {factions.map((faction) => (
          <div key={faction} className="flex flex-col mb-16">
            <h3 className={`text-4xl text-${faction} font-mono mb-4`}>{startCase(faction)}</h3>
            <div className="flex justify-around ml-8 mr-3">
              {generalsByFaction[faction].map((general) => (
                <GeneralCard key={general.id} general={general} onSelect={onSelectGeneral} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
