import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { Sidebar } from '@/components/Deckbuilder/Sidebar'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import { cards, factions } from '@/data/cards'
import { groupBy, startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo } from 'react'

export const PickAGeneral: FC<{ selectGeneral: (general: CardData) => void }> = ({
  selectGeneral,
}) => {
  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="flex flex-wrap content-center justify-center">
          {factions
            .filter((faction) => generalsByFaction[faction])
            .map((faction) => (
              <div key={faction} className="flex flex-col mb-16">
                <h3 className={`text-4xl text-${faction} font-mono mb-4`}>{startCase(faction)}</h3>
                <div className="flex justify-around ml-8 mr-3">
                  {generalsByFaction[faction].map((general) => (
                    <GeneralCard key={general.id} general={general} onSelect={selectGeneral} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export const Deckbuilder = () => {
  const [deckcode, { addCard, removeCard, replaceCard }] = useDeckcode()
  const deck = useDeck()

  const selectGeneral = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="truncate">{JSON.stringify(deckcode)}</div>
        <button onClick={() => addCard(11245)}>Add card</button>
        <button onClick={() => removeCard(11245)}>Remove card</button>
        {deck.general ? <div /> : <PickAGeneral selectGeneral={selectGeneral} />}
      </div>
      {deck.general && <Sidebar selectGeneral={selectGeneral} />}
    </div>
  )
}
