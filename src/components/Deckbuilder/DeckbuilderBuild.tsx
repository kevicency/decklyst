import { RelatedCardsTooltip } from '@/components/Deckbuilder/Card'
import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { CardFilterContext } from '@/context/useCardFilter'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import { cards } from '@/data/cards'
import useOnScreen from '@/hooks/useOnScreen'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { FC, ReactNode } from 'react'
import { useDeferredValue, useMemo, useRef, useState } from 'react'

export const DeckbuilderBuild: FC<{ onGeneralSelected: CardHandler; sidebar: ReactNode }> = ({
  onGeneralSelected,
  sidebar,
}) => {
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

  const handleCardSelected: CardHandler = (card, all?: boolean) => {
    addCard(card.id, all ? 3 : 1)
  }
  const handleCardDeselected: CardHandler = (card, all?: boolean) => {
    removeCard(card.id, all ? 3 : 1)
  }
  return (
    <>
      <PageHeader>
        <div className="flex gap-x-4 text-3xl">
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
        <div className="flex flex-1 justify-center -mb-4">
          <input
            className="page-header-input max-w-md"
            placeholder="Search"
            value={cardQuery}
            onChange={(ev) => setCardQuery(ev.target.value)}
          />
        </div>
        <div className="flex justify-around mr-7 mt-4 -mb-8 z-10">
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
      </PageHeader>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-scroll pl-8 pr-4 pt-3.5 mt-0.5 relative">
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

          <RelatedCardsTooltip />
        </div>
        {sidebar}
      </div>
    </>
  )
}
