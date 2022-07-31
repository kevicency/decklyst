import { FC } from 'react'
import { CardOccurence, DeckData } from '../../lib/deckcode'
import { DeckContext, useDeck } from './useDeck'
import { DeckTitle } from './DeckTitle'
import { DeckCounts } from './DeckCounts'
import { DeckManaCurve } from './DeckManaCurve'
import { DeckCardList } from './DeckCardList'

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

export const DeckMinionList = () => {
  const {
    cards: { minions },
  } = useDeck()
  const columnCount = Math.max(10, minions.length)

  return (
    <div
      className="bg-slate-800 h-32 grid"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {minions.map((card) => (
        <MinionCard card={card} key={card.id} />
      ))}
    </div>
  )
}

export const MinionCard: FC<{ card: CardOccurence }> = ({ card }) => (
  <div className="flex flex-col">
    <div className="flex flex-1 align-bottom"></div>
    <div className="text-center py-1 bg-slate-700">{card.count}</div>
  </div>
)

export const DeckSpellList = () => {
  const {
    cards: { spells },
  } = useDeck()
  return <SmallCardList cards={spells} />
}

export const DeckArtifactList = () => {
  const {
    cards: { artifacts },
  } = useDeck()
  return <SmallCardList cards={artifacts} />
}

export const SmallCardList: FC<{ cards: CardOccurence[] }> = ({ cards }) => {
  return (
    <div
      className="bg-slate-800 h-24 grid"
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <SmallCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const SmallCard: FC<{ card: CardOccurence }> = ({ card }) => (
  <div className="flex flex-col w-16">
    <div className="flex flex-1 align-bottom"></div>
    <div className="text-center py-0.5 bg-slate-700">{card.count}</div>
  </div>
)
