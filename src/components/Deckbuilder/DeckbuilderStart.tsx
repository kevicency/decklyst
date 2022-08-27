import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { cards, factions } from '@/data/cards'
import { validateDeckcode } from '@/data/deckcode'
import { groupBy, startCase } from 'lodash'
import type { FC, KeyboardEventHandler } from 'react'
import { useMemo, useState } from 'react'

export const DeckbuilderStart: FC<{
  onSelectGeneral: CardHandler
  onImportDeck: (deckcode: string) => void
}> = ({ onSelectGeneral, onImportDeck }) => {
  const [deckcode, setDeckcode] = useState<string>('')
  const valid = deckcode && validateDeckcode(deckcode)

  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter' && valid) {
      e.preventDefault()
      onImportDeck(deckcode)
    }
  }

  return (
    <>
      <div className="flex justify-center content-container">
        <div className="flex my-4 text-xl w-1/2">
          <input
            placeholder="Deckcode"
            className="flex-1 px-4 py-2"
            value={deckcode}
            onChange={(ev) => setDeckcode(ev.target.value)}
            onKeyDown={handleKeydown}
          />
          <button onClick={() => onImportDeck(deckcode)} disabled={!valid} className="btn px-4">
            Import Deck
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center items-center overflow-hidden">
        <div className="flex flex-wrap justify-center text-center overflow-y-auto">
          {factions
            .filter((faction) => generalsByFaction[faction])
            .map((faction) => (
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
    </>
  )
}
