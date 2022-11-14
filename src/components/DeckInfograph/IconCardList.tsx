import { CardSprite } from '@/components/CardSprite'
import type { CardEntry } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'

export const IconCardList: FC<{ cards: CardEntry[] }> = ({ cards }) => {
  return (
    <div
      className={cx('grid bg-alt-800', cards.length && 'mt-6 h-24')}
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <IconCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const IconCard: FC<{ card: CardEntry }> = ({ card }) => (
  <div className="flex w-16 flex-col">
    <a
      className="relative flex flex-1"
      data-tip={card.id}
      data-for="card-tooltip"
      data-place="bottom"
    >
      <CardSprite card={card} centered className="absolute left-1/2 bottom-4 scale-150" />
    </a>
    <div className="bg-alt-700 py-0.5 text-center">{card.count}</div>
  </div>
)
