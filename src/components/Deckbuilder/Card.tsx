import { CardSprite } from '@/components/CardSprite'
import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import type { CardData } from '@/data/cards'
import { highlightKeywords } from '@/data/cards'
import cx from 'classnames'
import type { FC } from 'react'
import { useState } from 'react'
import { GiBroadsword, GiCircle, GiShield } from 'react-icons/gi'

export const CardAttack: FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="flex items-center justify-center w-16 h-16 relative">
      <GiCircle
        className="text-amber-400 absolute top-1/2 left-1/2 -mt-[24px] -mx-[24px]"
        size={48}
      />
      <GiBroadsword
        className="text-amber-400 absolute top-1/2 left-0 -mt-[16px] -mx-[6px] -rotate-45"
        size={32}
      />
      <span className="font-mono text-2xl z-10">{card.attack}</span>
    </div>
  )
}
export const CardHealth: FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="flex items-center justify-center w-16 h-16 relative">
      <GiCircle
        className="text-red-600 absolute top-1/2 left-1/2 -mt-[24px] -mx-[24px]"
        size={48}
      />
      <GiShield
        className="text-red-600 absolute top-1/2 right-0 -mt-[16px] -mx-[6px] -scale-x-100"
        size={32}
      />
      <span className=" text-2xl z-10 tracking-tighter -ml-0.5">{card.health}</span>
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
  const [animate, setAnimate] = useState<null | number>(null)
  return (
    <button
      className={cx(
        className,
        'flex flex-col items-center relative',
        'w-64 h-[25rem] p-4 bg-gray-900',
        `border-3 border-gray-400 hover:border-${card.faction} outline-none`,
        'transition-transform',
        animate && `scale-${animate}`,
      )}
      onClick={(ev) => (ev.shiftKey ? onDeselect(card) : onSelect(card))}
      onMouseDown={(event) => {
        if (count !== undefined) {
          if (count < 3 && !event.shiftKey) {
            setAnimate(105)
          } else if (count > 0 && event.shiftKey) {
            setAnimate(95)
          }
        }
      }}
      onMouseUp={() => {
        setTimeout(() => setAnimate(null), 50)
      }}
    >
      <div className="scale-[2.5] absolute left-[-2px] top-0 -mx-3">
        <ManaIcon mana={card.mana} className="font-normal" />
      </div>
      {count ? (
        <div
          className={cx(
            'absolute right-0 top-0 -mr-4 mt-8 text-xl font-bold font-mono border border-gray-600  bg-gray-800 px-1',
            count === 3 && 'text-teal-400',
          )}
        >
          {count}/3
        </div>
      ) : null}
      <div className={cx('flex items-center h-1/3 mt-4', count === 3 && 'opacity-30')}>
        <CardSprite
          card={card}
          animated
          scale={2}
          style={({ width }) => (width > 200 ? { marginTop: -(width - 200) } : {})}
        />
      </div>
      <div
        className={cx(
          'flex items-end flex-shrink-0 font-bold uppercase mt-4 truncate h-7 tracking-tight ',
          count === 3 && 'text-gray-300',
          card.name.length <= 22 && 'text-lg',
        )}
      >
        {card.name}
      </div>
      <div className={'text-lg uppercase text-gray-400'}>
        {card.tribes.length ? card.tribes.join(' ') : card.cardType}
      </div>
      <div className="flex justify-around items-center w-full mb-2">
        {card.cardType === 'Minion' && <CardAttack card={card} />}
        <img
          src={`/assets/icons/rarity/collection_card_rarity_${card.rarity}.png`}
          width="64"
          alt={card.rarity}
        />
        {card.cardType === 'Minion' && <CardHealth card={card} />}
      </div>
      <div
        className={cx('text-gray-300', {
          'text-sm': card.description.length > 70 && card.description.length < 110,
          'text-xs leading-5': card.description.length >= 110,
        })}
        dangerouslySetInnerHTML={{ __html: highlightKeywords(card.description) }}
      ></div>
    </button>
  )
}
