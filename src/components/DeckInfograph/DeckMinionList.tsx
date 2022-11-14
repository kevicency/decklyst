import { CardSprite } from '@/components/CardSprite'
import { useDeck } from '@/context/useDeck'
import type { CardEntry } from '@/data/deck'
import type { FC } from 'react'

export const DeckMinionList = () => {
  const { minions } = useDeck()
  const columnCount = Math.max(10, minions.length)

  return (
    <div
      className="grid h-32 bg-alt-800"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {minions.map((card, i) => (
        <MinionCard card={card} key={card.id} position={i} />
      ))}
    </div>
  )
}
export const MinionCard: FC<{ card: CardEntry; position: number }> = ({ card, position }) => (
  <div className="flex flex-col" style={{ zIndex: 40 - position }}>
    <a
      className="relative flex flex-1"
      data-tip={card.id}
      data-for="card-tooltip"
      data-place="bottom"
    >
      <CardSprite card={card} centered className="absolute left-1/2 bottom-3 scale-150" />
    </a>
    <div className="bg-alt-700 py-1 text-center">{card.count}</div>
  </div>
)
