import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { CardList } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { Sidebar } from '@/components/Deckbuilder/Sidebar'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import { cards, factions } from '@/data/cards'
import cx from 'classnames'
import { groupBy, startCase } from 'lodash'
import type { FC, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

export const PickAGeneral: FC<{ selectGeneral: CardHandler }> = ({ selectGeneral }) => {
  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="flex flex-wrap content-center justify-center">
          {factions
            .filter((faction) => generalsByFaction[faction])
            .map((faction) => (
              <div key={faction} className="flex flex-col mb-16">
                <h3 className={`text-4xl text-${faction} font-mono mb-4`}>{startCase(faction)}</h3>
                <div className="flex justify-around ml-8 mr-3">
                  {generalsByFaction[faction].map((general) => (
                    <GeneralCard key={general.id} general={general} onSelect={selectGeneral} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
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

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting))
  }, [])

  useEffect(() => {
    const observer = observerRef.current
    if (ref.current) {
      observer?.observe(ref.current!)
    }

    return () => {
      observer?.disconnect()
    }
  }, [ref])

  return isOnScreen
}

export const Deckbuilder: FC<{ share: () => void }> = ({ share }) => {
  const [deckcode, { addCard, removeCard, replaceCard, clear }] = useDeckcode()
  const deck = useDeck()
  const factionCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardListRef = useRef<HTMLDivElement>(null)
  const neutralCardsOnScreen = useOnScreen(neutralCardListRef)

  const generals = useMemo(
    () =>
      cards.filter(({ cardType, faction }) => faction === deck.faction && cardType === 'General'),
    [deck.faction],
  )

  useEffect(() => {})

  const selectGeneral = (general: CardData) => {
    if (deck.general) {
      replaceCard(deck.general.id, general.id)
    } else {
      addCard(general.id)
    }
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
      {deck.general ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-end px-8 pb-4">
            <div className="flex gap-x-4 text-3xl pb-2">
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
            <div className="flex-1"></div>
            <div className="flex justify-around pl-2 -mr-1 mt-4">
              {generals.map((general) => (
                <GeneralCard
                  size="sm"
                  general={general}
                  onSelect={selectGeneral}
                  key={general.id}
                  className={cx(
                    'transition-all',
                    general.id === deck.general.id
                      ? `opacity-100 text-${deck.faction}`
                      : 'opacity-60',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-y-scroll">
            <div ref={factionCardListRef}>
              <CardList
                faction={deck.faction}
                onSelectCard={handleCardSelected}
                onDeselectCard={handleCardDeselected}
              />
            </div>
            <div ref={neutralCardListRef}>
              <CardList
                faction="neutral"
                onSelectCard={handleCardSelected}
                onDeselectCard={handleCardDeselected}
              />
            </div>
          </div>
        </div>
      ) : (
        <PickAGeneral selectGeneral={selectGeneral} />
      )}
      {deck.general && <Sidebar onReset={handleReset} onCopy={handleCopy} onShare={share} />}
    </div>
  )
}
