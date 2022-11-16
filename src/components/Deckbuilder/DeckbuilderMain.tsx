import { DeckbuilderMainBuild } from '@/components/Deckbuilder/DeckbuilderMainBuild'
import { DeckbuilderMainStart } from '@/components/Deckbuilder/DeckbuilderMainStart'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import type { FC } from 'react'

export const DeckbuilderMain: FC = () => {
  const [, { addCard, replaceCard }] = useDeckcode()
  const deck = useDeck()

  const handleGeneralSelected = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-900 grid-in-main">
      {deck.general ? (
        <DeckbuilderMainBuild onSelectGeneral={handleGeneralSelected} />
      ) : (
        <DeckbuilderMainStart onSelectGeneral={handleGeneralSelected} />
      )}
    </div>
  )
}
