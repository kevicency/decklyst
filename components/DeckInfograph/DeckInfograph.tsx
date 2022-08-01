import { FC } from 'react'
import { DeckData } from '../../lib/deckcode'
import { DeckContext } from './useDeck'
import { DeckTitle } from './DeckTitle'
import { DeckCountsAlt } from './DeckCounts'
import { DeckManaCurve } from './DeckManaCurve'
import { DeckCardList } from './DeckCardList'
import { DeckMinionList } from './DeckMinionList'
import { DeckSpellList } from './DeckSpellList'
import { DeckArtifactList } from './DeckArtifactList'
import { DeckQRCode } from './DeckQRCode'

export const DeckInfograph: FC<{ deck: DeckData }> = ({ deck }) => {
  return (
    <DeckContext.Provider value={deck}>
      <div className="grid auto-rows-auto gap-6 text-slate-100">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'minmax(0, 1.5fr)  minmax(0, 0.5fr) minmax(0, 1fr) auto' }}
        >
          <DeckTitle />
          <div className="flex justify-center">
            <DeckCountsAlt />
          </div>
          <div className="flex justify-center">
            <DeckManaCurve />
          </div>
          <DeckQRCode />
        </div>
        <div className="flex flex-col">
          <DeckMinionList />
          <div className="flex justify-between">
            <DeckSpellList />
            <DeckArtifactList />
          </div>
        </div>
        <DeckCardList />
      </div>
    </DeckContext.Provider>
  )
}
