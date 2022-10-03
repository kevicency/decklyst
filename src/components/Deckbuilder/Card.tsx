import { CardSprite } from '@/components/CardSprite'
import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import type { CardData } from '@/data/cards'
import { cardsById, highlightKeywords } from '@/data/cards'
import cx from 'classnames'
import type { FC } from 'react'
import { useState } from 'react'
import { GiBroadsword, GiCircle, GiShield } from 'react-icons/gi'
import ReactTooltip from 'react-tooltip'

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
      <span className="text-2xl z-10">{card.attack}</span>
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

export const RelatedCardsTooltip = () => (
  <ReactTooltip
    id="related-cards-tooltip"
    effect="solid"
    place="left"
    getContent={(cardIds) => (
      <RelatedCardTooltipContent cardIds={cardIds?.split(',').map((x) => +x) ?? []} />
    )}
  />
)
const RelatedCardTooltipContent: FC<{ cardIds: number[] }> = ({ cardIds }) => {
  const cards = cardIds.map((cardId) => cardsById[cardId]).filter(Boolean)

  return cards.length ? (
    <div className="flex flex-col -mx-6">
      {cards.map((card) => (
        <div key={card.id} className="scale-75 bg-zinc-900 p-2">
          <Card card={card} className="border-gray-600" />
        </div>
      ))}
    </div>
  ) : null
}

export const Card: FC<{
  card: CardData
  onSelect?: CardHandler
  onDeselect?: CardHandler
  count?: number
  className?: string
}> = ({ card, count, onSelect, onDeselect, className }) => {
  const [animate, setAnimate] = useState<number>(0)
  const Tag = onSelect ? 'button' : 'div'

  const tooltipData = card.relatedCards.length
    ? {
        'data-tip': card.relatedCards.join(','),
        'data-for': 'related-cards-tooltip',
      }
    : {}

  return (
    <Tag
      className={cx(
        className,
        'flex flex-col items-center relative',
        'w-64 h-[26rem] p-4 bg-gray-900',
        `border-3 border-gray-400 hover:border-${card.faction} outline-none`,
        'transition-transform',
        {
          'scale-100': animate === 0,
          'scale-95': animate === -1,
          'scale-105': animate === 1,
        },
      )}
      onClick={(ev) =>
        ev.altKey ? onDeselect?.(card, ev.shiftKey) : onSelect?.(card, ev.shiftKey)
      }
      onMouseDown={(event) => {
        if (count !== undefined) {
          if (count < 3 && !event.altKey) {
            setAnimate(1)
          } else if (count > 0 && event.altKey) {
            setAnimate(-1)
          }
        }
      }}
      onMouseUp={() => {
        setAnimate(0)
      }}
      {...tooltipData}
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
          src={`/assets/icons/rarity/collection_card_rarity_${
            card.rarity === 'token' ? 'basic' : card.rarity
          }.png`}
          width="64"
          alt={card.rarity}
        />
        {card.cardType === 'Minion' && <CardHealth card={card} />}
      </div>
      <div
        className={cx('text-gray-300 whitespace-pre-line text-center', {
          'text-sm': card.description.length > 70 && card.description.length < 110,
          'text-xs leading-5': card.description.length >= 110,
        })}
        dangerouslySetInnerHTML={{ __html: highlightKeywords(card.description) }}
      ></div>
    </Tag>
  )
}
