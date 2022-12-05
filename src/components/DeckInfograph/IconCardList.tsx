import { CardSprite } from '@/components/CardSprite'
import type { CardEntry } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'
import { useWindowSize } from 'usehooks-ts'
import type { Variant } from './variant'

export const IconCardList: FC<{ cards: CardEntry[]; variant?: Variant; width?: number }> = ({
  cards,
  variant = 'infograph',
}) => {
  const { width } = useWindowSize()
  const columnCount =
    width < 700 ? Math.min(1 + Math.ceil(width / 100), cards.length) : cards.length

  return (
    <div
      className={cx('grid ', variant === 'infograph' ? 'bg-alt-800' : 'bg-transparent')}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <IconCard card={card} key={card.id} variant={variant} />
      ))}
    </div>
  )
}
export const IconCard: FC<{ card: CardEntry; variant?: Variant }> = ({ card, variant }) => (
  <div className="flex h-28 w-[4.5rem] flex-col">
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
