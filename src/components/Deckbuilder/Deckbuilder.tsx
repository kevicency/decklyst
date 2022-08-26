import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { Sidebar } from '@/components/Deckbuilder/Sidebar'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import { cards, factions } from '@/data/cards'
import { groupBy, startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo } from 'react'

export const PickAGeneral: FC<{ selectGeneral: CardHandler }> = ({ selectGeneral }) => {
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

export const Deckbuilder: FC<{ share: () => void }> = ({ share }) => {
  const [deckcode, { addCard, removeCard, replaceCard, clear }] = useDeckcode()
  const deck = useDeck()

  const selectGeneral = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
  }

  const handleCardSelected: CardHandler = (card) => {
    addCard(card.id)
  }
  const handleCardDeselected: CardHandler = (card) => {
    removeCard(card.id)
  }
  const handleReset = () => {
    clear()
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(deckcode.$encoded!)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {deck.general ? (
          <div>
            <CardList
              faction={deck.faction}
              onSelectCard={handleCardSelected}
              onDeselectCard={handleCardDeselected}
            />
            <CardList
              faction="neutral"
              onSelectCard={handleCardSelected}
              onDeselectCard={handleCardDeselected}
            />
          </div>
        ) : (
          <PickAGeneral selectGeneral={selectGeneral} />
        )}
      </div>
      {deck.general && (
        <Sidebar
          onSelectGeneral={selectGeneral}
          onReset={handleReset}
          onCopy={handleCopy}
          onShare={share}
        />
      )}
    </div>
  )
}
