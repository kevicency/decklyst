import { FC } from 'react'
import { DeckData } from '../../lib/deckcode'
import { DeckContext } from './useDeck'
import { DeckTitle } from './DeckTitle'
import { DeckCounts } from './DeckCounts'
import { DeckManaCurve } from './DeckManaCurve'
import { DeckCardList } from './DeckCardList'

export const DeckInfograph: FC<{ deck: DeckData }> = ({ deck }) => {
  return (
    <DeckContext.Provider value={deck}>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <DeckTitle />
        <DeckCounts />
        <DeckManaCurve />
      </div>
      <DeckCardList />
    </DeckContext.Provider>
  )
}
