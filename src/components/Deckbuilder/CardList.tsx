import { CardSprite } from '@/components/CardSprite'
import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import { useCardFilter } from '@/context/useCardFilter'
import { useDeck } from '@/context/useDeck'
import type { CardData } from '@/data/cards'
import { cardCompareFn, cards, highlightKeywords } from '@/data/cards'
import cx from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'

export type CardHandler = (card: CardData) => void

export const CardList: FC<{
  onSelectCard: CardHandler
  onDeselectCard: CardHandler
}> = ({ onSelectCard, onDeselectCard }) => {
  const deck = useDeck()
  const { faction, query } = useCardFilter()
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => card.cardType !== 'General' && card.rarity !== 'token')
        .filter((card) => (faction ? card.faction === faction : true))
        .filter((card) =>
          query
            ? [card.name, card.description, card.cardType, ...card.tribes]
                .join(';')
                .toLowerCase()
                .includes(query)
            : true,
        )
        .sort(cardCompareFn),
    [faction, query],
  )

  return (
    <div className="flex flex-wrap gap-12 mt-8 mx-4 justify-center">
      {filteredCards.map((card) => {
        const count = deck.cards.find(({ id }) => id === card.id)?.count
        return (
          <Card
            card={card}
            key={card.id}
            onSelect={onSelectCard}
            onDeselect={onDeselectCard}
            count={count}
          />
        )
      })}
    </div>
  )
}

export const Card: FC<{
  card: CardData
  onSelect: CardHandler
  onDeselect: CardHandler
  count?: number
  className?: string
}> = ({ card, count, onSelect, onDeselect, className }) => {
  return (
    <button
      className={cx(
        className,
        'flex flex-col items-center relative',
        'w-64 h-96 p-4 bg-slate-900 ',
        `border-3 border-slate-400 hover:border-${card.faction} outline-none`,
      )}
      onClick={(ev) => (ev.shiftKey ? onDeselect(card) : onSelect(card))}
    >
      <div className="scale-[2.5] absolute left-0 top-0 -mx-3">
        <ManaIcon mana={card.mana} />
      </div>
      {count && (
        <div
          className={cx(
            'absolute right-0 top-0 -mr-3 mt-3 text-xl font-bold font-mono border border-slate-600  bg-slate-800 px-1',
            count === 3 && 'text-sky-400',
          )}
        >
          {count}/3
        </div>
      )}
      <div className={cx('flex items-center h-1/3 mt-4', count === 3 && 'opacity-30')}>
        <CardSprite
          card={card}
          animated
          scale={2}
          style={({ width }) => (width > 200 ? { marginTop: -(width - 200) } : {})}
        />
      </div>
      <div className={cx('font-bold text-lg uppercase mt-4', count === 3 && 'text-slate-300')}>
        {card.name}
      </div>
      <div className={'text-lg uppercase text-slate-400'}>
        {card.tribes.length ? card.tribes.join(' ') : card.cardType}
      </div>
      <div className="flex justify-around items-center w-full ">
        {card.cardType === 'Minion' && (
          <div className="font-mono text-4xl text-yellow-400 flex">
            <span>⚔️</span>
            <span className="ml-1 mt-1">{card.attack}</span>
          </div>
        )}
        <img
          src={`/assets/icons/rarity/collection_card_rarity_${card.rarity}.png`}
          width="64"
          alt={card.rarity}
        />
        {card.cardType === 'Minion' && (
          <div className="font-mono text-4xl text-red-400 flex">
            <span className="mr-1">{card.attack}</span>
            <span>♥️️</span>
          </div>
        )}
      </div>
      <div
        className="text-slate-300 text-sm"
        dangerouslySetInnerHTML={{ __html: highlightKeywords(card.description) }}
      ></div>
    </button>
  )
}
