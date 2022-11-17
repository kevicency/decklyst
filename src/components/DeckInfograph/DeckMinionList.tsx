import { CardSprite } from '@/components/CardSprite'
import { useDeck } from '@/context/useDeck'
import type { CardEntry } from '@/data/deck'
import { range } from 'lodash'
import type { FC } from 'react'
import type { Variant } from './variant'

export const DeckMinionList: FC<{ variant?: Variant }> = ({ variant = 'infograph' }) => {
  const { minions } = useDeck()
  const columnCount = 10
  const rowCount = Math.ceil(minions.length / columnCount)

  return (
    <div
      className={`grid ${variant === 'infograph' ? 'bg-alt-800' : 'bg-transparent'}`}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {range(rowCount * columnCount)
        .map((i) => minions[i])
        .map((card, i) => (
          <MinionCard card={card} key={card?.id ?? i} position={i} variant={variant} />
        ))}
    </div>
  )
}
export const MinionCard: FC<{ card?: CardEntry; position: number; variant?: Variant }> = ({
  card,
  position,
  variant,
}) => (
  <div className="flex h-32 flex-col" style={{ zIndex: 40 - position }}>
    {card ? (
      <a
        className="relative flex flex-1"
        data-tip={card.id}
        data-for="card-tooltip"
        data-place="bottom"
      >
        <CardSprite card={card} centered className="absolute left-1/2 bottom-2 scale-150" />
      </a>
    ) : (
      <div className="flex-1" />
    )}
    <div className={`${variant === 'infograph' ? 'bg-alt-700' : 'bg-alt-800'} py-1 text-center`}>
      {card?.count ?? <span>&nbsp;</span>}
    </div>
  </div>
)
