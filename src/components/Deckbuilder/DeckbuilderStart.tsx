import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { PageHeader } from '@/components/PageHeader'
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
    <>
      <PageHeader>
        <div className="text-4xl font-light">Deckbuilder</div>
        <div className="text-2xl text-gray-200">Choose a general to start</div>
      </PageHeader>
      <div className="flex flex-1 flex-wrap justify-center overflow-y-auto pt-8 text-center">
        {factions.map((faction) => (
          <div key={faction} className="mb-16 flex flex-col">
            <h3 className={`text-4xl text-${faction} mb-4 font-mono`}>{startCase(faction)}</h3>
            <div className="ml-8 mr-3 flex justify-around">
              {generalsByFaction[faction].map((general) => (
                <GeneralCard key={general.id} general={general} onSelect={onSelectGeneral} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
