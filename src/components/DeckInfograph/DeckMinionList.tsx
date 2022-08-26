import { CardSprite } from '@/components/CardSprite'
import { useDeck } from '@/context/useDeck'
import type { CardEntry } from '@/data/deck'
import type { FC } from 'react'

export const DeckMinionList = () => {
  const { minions } = useDeck()
  const columnCount = Math.max(10, minions.length)

  return (
    <div
      className="bg-slate-800 h-32 grid"
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
    <div className="flex flex-1 relative">
      <CardSprite card={card} centered className="scale-150 absolute left-1/2 bottom-2.5" />
    </div>
    <div className="text-center py-1 bg-slate-700">{card.count}</div>
  </div>
)
