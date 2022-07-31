import { useDeck } from './useDeck'
import { chunk, flatMap } from 'lodash'
import cx from 'classnames'
import { FC } from 'react'

export const DeckCardList = () => {
  const {
    faction,
    cards: { minions, spells, artifacts },
  } = useDeck()

  const cols = flatMap([minions, spells, artifacts], (cards, i) =>
    chunk(cards, 6).map((chunked, j) => ({
      title: j === 0 ? (i === 0 ? 'Minions' : i === 1 ? 'Spells' : 'Artifacts') : '',
      cards: chunked,
    })),
  )

  return (
    <div
      className={cx(`grid gap-4`, {
        'grid-cols-3': cols.length === 3,
        'grid-cols-4': cols.length === 4,
        'grid-cols-5': cols.length === 5,
        'grid-cols-6': cols.length === 6,
      })}
    >
      {cols.map((col, i) => (
        <div key={i}>
          <div className={`text-${faction} text-xl font-bold`}>{col.title} &nbsp;</div>
          {col.cards.map((card) => (
            <div key={card.id} className="mt-2 flex">
              <ManaIcon mana={card.cost} />
              <div className="ml-2 flex-1 truncate">
                {card.count} x {card.title}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
export const ManaIcon: FC<{ mana: number }> = ({ mana }) => (
  <div className="hexagon bg-mana text-slate-900">
    <span className="inline-block w-6 text-center text-sm font-bold">{mana}</span>
  </div>
)
