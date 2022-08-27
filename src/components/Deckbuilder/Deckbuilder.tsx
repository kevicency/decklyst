import { DeckbuilderBuild } from '@/components/Deckbuilder/DeckbuilderBuild'
import { DeckbuilderStart } from '@/components/Deckbuilder/DeckbuilderStart'
import { Sidebar } from '@/components/Deckbuilder/Sidebar'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import type { Deckcode } from '@/data/deckcode'
import type { FC } from 'react'

export const Deckbuilder: FC<{
  onShare: () => void
  onImport: (code: string) => Promise<Deckcode>
}> = ({ onShare }) => {
  const [deckcode, { addCard, replaceCard, clear }] = useDeckcode()
  const deck = useDeck()

  const handleGeneralSelected = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
  }
  const handleReset = () => {
    clear()
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(deckcode.$encoded!)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {deck.general ? (
          <DeckbuilderBuild onGeneralSelected={handleGeneralSelected} />
        ) : (
          <DeckbuilderStart onSelectGeneral={handleGeneralSelected} />
        )}
      </div>
      {deck.general && <Sidebar onReset={handleReset} onCopy={handleCopy} onShare={onShare} />}
    </div>
  )
}
