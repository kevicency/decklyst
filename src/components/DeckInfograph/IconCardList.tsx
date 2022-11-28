import { CardSprite } from '@/components/CardSprite'
import type { CardEntry } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'
import type { Variant } from './variant'

export const IconCardList: FC<{ cards: CardEntry[]; variant?: Variant }> = ({
  cards,
  variant = 'infograph',
}) => {
  return (
    <div
      className={cx(
        'grid',
        cards.length && 'mt-6 h-24',
        variant === 'infograph' ? 'bg-alt-800' : 'bg-transparent',
      )}
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <IconCard card={card} key={card.id} variant={variant} />
      ))}
    </div>
  )
}
export const IconCard: FC<{ card: CardEntry; variant?: Variant }> = ({ card, variant }) => (
  <div className="flex w-[4.5rem] flex-col">
    <a
      className="relative flex flex-1"
      data-tip={card.id}
      data-for="card-tooltip"
      data-place="bottom"
    >
      <CardSprite card={card} centered className="absolute left-1/2 bottom-5 scale-150" />
    </a>
    <div className={`${variant === 'infograph' ? 'bg-alt-700' : 'bg-alt-800'} py-0.5 text-center`}>
      {card.count}
    </div>
  </div>
)
