import { RelatedCardsTooltip } from '@/components/Deckbuilder/Card'
import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { PageHeader } from '@/components/PageHeader'
import { PivotButton } from '@/components/PivotButton'
import { CardFiltersContext, useCardFilters } from '@/context/useCardFilters'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import { cards } from '@/data/cards'
import useOnScreen from '@/hooks/useOnScreen'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo, useRef } from 'react'

export const DeckbuilderMain: FC = () => {
  const [, { addCard, removeCard, replaceCard }] = useDeckcode()
  const deck = useDeck()
  const [cardFilters, { updateCardFilters }] = useCardFilters()
  const factionCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardsOnScreen = useOnScreen(neutralCardListRef)
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
    <div className="bg-image-deckbuilder flex flex-1 flex-col overflow-hidden grid-in-main">
      <PageHeader showFilterToggle>
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
        <div className="-mb-4 flex flex-1 justify-center">
          <input
            className="page-header-input max-w-md"
            placeholder="Search"
            value={cardFilters.query ?? ''}
            onChange={(ev) => updateCardFilters({ query: ev.target.value })}
          />
        </div>
        <div className="z-10 mr-2 mt-4 -mb-8 flex justify-around">
          {generals.map((general) => (
            <GeneralCard
              size="sm"
              general={general}
              onSelect={() => replaceCard(deck.general.id, general.id)}
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
        <div className="relative mt-0.5 flex flex-1 flex-col overflow-y-scroll pl-8 pr-4 pt-3.5">
          <div ref={factionCardListRef}>
            <CardFiltersContext.Provider
              value={[{ ...cardFilters, faction: deck.faction }, { updateCardFilters }]}
            >
              <CardList onSelectCard={handleCardSelected} onDeselectCard={handleCardDeselected} />
            </CardFiltersContext.Provider>
          </div>
          <div ref={neutralCardListRef}>
            <CardFiltersContext.Provider
              value={[{ ...cardFilters, faction: 'neutral' }, { updateCardFilters }]}
            >
              <CardList onSelectCard={handleCardSelected} onDeselectCard={handleCardDeselected} />
            </CardFiltersContext.Provider>
          </div>

          <RelatedCardsTooltip />
        </div>
      </div>
    </div>
  )
}
