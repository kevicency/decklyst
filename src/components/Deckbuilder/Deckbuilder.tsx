import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { Sidebar } from '@/components/Deckbuilder/Sidebar'
import { CardFilterContext } from '@/context/useCardFilter'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import { cards, factions } from '@/data/cards'
import { validateDeckcode } from '@/data/deckcode'
import useOnScreen from '@/hooks/useOnScreen'
import cx from 'classnames'
import { groupBy, startCase } from 'lodash'
import type { FC, KeyboardEventHandler } from 'react'
import { useDeferredValue, useMemo, useRef, useState } from 'react'

export const DeckbuilderStart: FC<{
  onSelectGeneral: CardHandler
  onImportDeck: (deckcode: string) => void
}> = ({ onSelectGeneral, onImportDeck }) => {
  const [deckcode, setDeckcode] = useState<string>('')
  const valid = deckcode && validateDeckcode(deckcode)

  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter' && valid) {
      e.preventDefault()
      onImportDeck(deckcode)
    }
  }

  return (
    <>
      <div className="flex justify-center content-container">
        <div className="flex my-4 text-xl w-1/2">
          <input
            placeholder="Deckcode"
            className="flex-1 px-4 py-2"
            value={deckcode}
            onChange={(ev) => setDeckcode(ev.target.value)}
            onKeyDown={handleKeydown}
          />
          <button onClick={() => onImportDeck(deckcode)} disabled={!valid} className="btn px-4">
            Import Deck
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center items-center overflow-hidden">
        <div className="flex flex-wrap justify-center text-center overflow-y-auto">
          {factions
            .filter((faction) => generalsByFaction[faction])
            .map((faction) => (
              <div key={faction} className="flex flex-col mb-16">
                <h3 className={`text-4xl text-${faction} font-mono mb-4`}>{startCase(faction)}</h3>
                <div className="flex justify-around ml-8 mr-3">
                  {generalsByFaction[faction].map((general) => (
                    <GeneralCard key={general.id} general={general} onSelect={onSelectGeneral} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

const PivotButton: FC<{ onClick: () => void; active?: boolean; children: any }> = ({
  onClick,
  active,
  children,
}) => (
  <button
    onClick={onClick}
    className={cx(
      'hover:text-sky-400 cursor-pointer',
      active ? 'text-slate-100' : 'text-slate-500',
    )}
  >
    {children}
  </button>
)

export const Deckbuilder: FC<{ share: () => void }> = ({ share }) => {
  const [deckcode, { addCard, removeCard, replaceCard, clear, replace }] = useDeckcode()
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

  const handleGeneralSelected = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
  }
  const handleDeckImported = (deckcode: string) => {
    replace(deckcode)
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
      <div className="flex flex-col flex-1 overflow-hidden">
        {deck.general ? (
          <>
            <div className="flex gap-x-8 items-end px-8 shadow-lg shadow-dark z-20">
              <div className="flex gap-x-4 text-3xl mb-2.5">
                <PivotButton
                  active={!neutralCardsOnScreen}
                  onClick={() => factionCardListRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {startCase(deck.faction)}
                </PivotButton>
                <PivotButton
                  active={neutralCardsOnScreen}
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
                  onChange={(e) => setCardQuery(e.target.value)}
                />
              </div>
              <div className="flex justify-around -mr-1 mt-4 -mb-4 z-10">
                {generals.map((general) => (
                  <GeneralCard
                    size="sm"
                    general={general}
                    onSelect={handleGeneralSelected}
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
                <CardFilterContext.Provider
                  value={{ faction: deck.faction, query: deferredCardQuery }}
                >
                  <CardList
                    onSelectCard={handleCardSelected}
                    onDeselectCard={handleCardDeselected}
                  />
                </CardFilterContext.Provider>
              </div>
              <div ref={neutralCardListRef}>
                <CardFilterContext.Provider
                  value={{ faction: 'neutral', query: deferredCardQuery }}
                >
                  <CardList
                    onSelectCard={handleCardSelected}
                    onDeselectCard={handleCardDeselected}
                  />
                </CardFilterContext.Provider>
              </div>
            </div>
          </>
        ) : (
          <DeckbuilderStart
            onSelectGeneral={handleGeneralSelected}
            onImportDeck={handleDeckImported}
          />
        )}
      </div>
      {deck.general && <Sidebar onReset={handleReset} onCopy={handleCopy} onShare={share} />}
    </div>
  )
}
