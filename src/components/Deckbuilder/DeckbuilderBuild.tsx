import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { CardFilterContext } from '@/context/useCardFilter'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import { cards } from '@/data/cards'
import useOnScreen from '@/hooks/useOnScreen'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { FC } from 'react'
import { useDeferredValue, useMemo, useRef, useState } from 'react'

const PivotButton: FC<{
  onClick: () => void
  active?: boolean
  activeClassName?: string
  children: any
}> = ({ onClick, active, activeClassName, children }) => (
  <button
    onClick={onClick}
    className={cx(
      'hover:text-sky-400 cursor-pointer',
      active ? activeClassName ?? 'text-slate-100' : 'text-slate-500',
    )}
  >
    {children}
  </button>
)

export const DeckbuilderBuild: FC<{ onGeneralSelected: CardHandler }> = ({ onGeneralSelected }) => {
  const [, { addCard, removeCard }] = useDeckcode()
  const deck = useDeck()
  const factionCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardsOnScreen = useOnScreen(neutralCardListRef)
  const [cardQuery, setCardQuery] = useState('')
  const deferredCardQuery = useDeferredValue(cardQuery)
  const generals = useMemo(
    () =>
      cards.filter(({ cardType, faction }) => faction === deck.faction && cardType === 'General'),
    [deck.faction],
  )

  const handleCardSelected: CardHandler = (card) => {
    addCard(card.id)
  }
  const handleCardDeselected: CardHandler = (card) => {
    removeCard(card.id)
  }
  return (
    <>
      <div className="flex gap-x-8 items-end px-8 shadow-lg shadow-dark z-20">
        <div className="flex gap-x-4 text-3xl mb-2.5">
          <PivotButton
            active={!neutralCardsOnScreen}
            activeClassName={`text-${deck.faction}`}
            onClick={() => factionCardListRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            {startCase(deck.faction)}
          </PivotButton>
          <PivotButton
            active={neutralCardsOnScreen}
            activeClassName={`text-neutral`}
            onClick={() => neutralCardListRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            {startCase('neutral')}
          </PivotButton>
        </div>
        <div className="flex flex-1 justify-center mb-3">
          <input
            className="w-full max-w-xl bg-slate-900 border border-slate-700 px-4 py-2"
            placeholder="Search"
            value={cardQuery}
            onChange={(ev) => setCardQuery(ev.target.value)}
          />
        </div>
        <div className="flex justify-around -mr-1 mt-4 -mb-4 z-10">
          {generals.map((general) => (
            <GeneralCard
              size="sm"
              general={general}
              onSelect={onGeneralSelected}
              key={general.id}
              className={cx(
                'transition-all',
                general.id === deck.general.id
                  ? `brightness-100  text-${deck.faction}`
                  : 'brightness-50',
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-scroll pl-8 pr-4">
        <div ref={factionCardListRef}>
          <CardFilterContext.Provider value={{ faction: deck.faction, query: deferredCardQuery }}>
            <CardList onSelectCard={handleCardSelected} onDeselectCard={handleCardDeselected} />
          </CardFilterContext.Provider>
        </div>
        <div ref={neutralCardListRef}>
          <CardFilterContext.Provider value={{ faction: 'neutral', query: deferredCardQuery }}>
            <CardList onSelectCard={handleCardSelected} onDeselectCard={handleCardDeselected} />
          </CardFilterContext.Provider>
        </div>
      </div>
    </>
  )
}
