import { FC } from 'react'
import { CardOccurence } from '../../lib/deckcode'

export const SmallCardList: FC<{ cards: CardOccurence[] }> = ({ cards }) => {
  return (
    <div
      className="bg-slate-800 h-24 grid"
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <SmallCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const SmallCard: FC<{ card: CardOccurence }> = ({ card }) => (
  <div className="flex flex-col w-16">
    <div className="flex flex-1 align-bottom"></div>
    <div className="text-center py-0.5 bg-slate-700">{card.count}</div>
  </div>
)
