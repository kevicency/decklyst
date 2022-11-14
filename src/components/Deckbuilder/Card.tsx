import { CardSprite } from '@/components/CardSprite'
import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import type { CardData } from '@/data/cards'
import { cardsById, highlightKeywords } from '@/data/cards'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { useState } from 'react'
import { GiBroadsword, GiCircle, GiShield } from 'react-icons/gi'
import colors from 'tailwindcss/colors'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

export const CardAttack: FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <GiCircle
        className="text-amber-400 absolute top-1/2 left-1/2 -mx-[24px] -mt-[24px]"
        size={48}
      />
      <GiBroadsword
        className="text-amber-400 absolute top-1/2 left-0 -mx-[6px] -mt-[16px] -rotate-45"
        size={32}
      />
      <span className="z-10 text-2xl">{card.attack}</span>
    </div>
  )
}
export const CardHealth: FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <GiCircle
        className="absolute top-1/2 left-1/2 -mx-[24px] -mt-[24px] text-red-600"
        size={48}
      />
      <GiShield
        className="absolute top-1/2 right-0 -mx-[6px] -mt-[16px] -scale-x-100 text-red-600"
        size={32}
      />
      <span className=" z-10 -ml-0.5 text-2xl tracking-tighter">{card.health}</span>
    </div>
  )
}

export const RelatedCardsTooltip = () => (
  <ReactTooltip
    id="related-cards-tooltip"
    effect="solid"
    place="left"
    className="!bg-transparent"
    arrowColor={colors.gray[500]}
    scrollHide={true}
    resizeHide={true}
    getContent={(cardIds) => (
      <RelatedCardTooltipContent cardIds={cardIds?.split(',').map((x) => +x) ?? []} />
    )}
  />
)
const RelatedCardTooltipContent: FC<{ cardIds: number[] }> = ({ cardIds }) => {
  const cards = cardIds.map((cardId) => cardsById[cardId]).filter(Boolean)

  return cards.length ? (
    <div className="-mx-7 flex scale-75 flex-col">
      {cards.map((card) => (
        <div key={card.id} className="bg-neutral-900 p-2">
          <Card card={card} className={`!border-${card.faction}`} />
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
        'relative flex flex-col items-center',
        'h-[26rem] w-64 bg-gray-900 p-4',
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
      <div className="absolute left-[-2px] top-0 -mx-3 scale-[2.5]">
        <ManaIcon mana={card.mana} className="font-normal" />
      </div>
      {count ? (
        <div
          className={cx(
            'absolute right-0 top-0 -mr-4 mt-8 border border-gray-600 bg-gray-800 px-1 font-mono  text-xl font-bold',
            count === 3 && 'text-accent-400',
          )}
        >
          {count}/3
        </div>
      ) : null}
      <div className={cx('mt-4 flex h-1/3 items-center', count === 3 && 'opacity-30')}>
        <CardSprite
          card={card}
          animated
          scale={2}
          style={({ width }) => (width > 200 ? { marginTop: -(width - 200) } : {})}
        />
      </div>
      <div
        className={cx(
          'mt-4 flex h-7 flex-shrink-0 items-end truncate font-bold uppercase tracking-tight ',
          count === 3 && 'text-gray-300',
          card.name.length <= 22 && 'text-lg',
        )}
      >
        {card.name}
      </div>
      <div className={'text-lg uppercase text-gray-400'}>
        {card.tribes.length ? card.tribes.join(' ') : card.cardType}
      </div>
      <div className="mb-2 flex w-full items-center justify-around">
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
        className={cx('whitespace-pre-line text-center text-gray-300', {
          'text-sm': card.description.length > 70 && card.description.length < 110,
          'text-xs leading-5': card.description.length >= 110,
        })}
        dangerouslySetInnerHTML={{ __html: highlightKeywords(card.description) }}
      ></div>
    </Tag>
  )
}
