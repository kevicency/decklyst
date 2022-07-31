import { FC } from 'react'
import { DeckData } from '../../lib/deckcode'
import { DeckContext } from './useDeck'
import { DeckTitle } from './DeckTitle'
import { DeckCounts } from './DeckCounts'
import { DeckManaCurve } from './DeckManaCurve'
import { DeckCardList } from './DeckCardList'
import { DeckMinionList } from './DeckMinionList'
import { DeckSpellList } from './DeckSpellList'
import { DeckArtifactList } from './DeckArtifactList'

export const DeckInfograph: FC<{ deck: DeckData }> = ({ deck }) => {
  return (
    <DeckContext.Provider value={deck}>
      <div className="grid auto-rows-auto gap-6">
        <div className="grid grid-cols-3 gap-4">
          <DeckTitle />
          <DeckCounts />
          <div className="flex justify-end">
            <DeckManaCurve />
          </div>
        </div>
        <DeckMinionList />
        <div className="flex justify-between">
          <DeckSpellList />
          <DeckArtifactList />
        </div>
        <DeckCardList />
      </div>
    </DeckContext.Provider>
  )
}
