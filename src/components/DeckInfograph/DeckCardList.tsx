import cx from 'classnames'
import { chunk, flatMap } from 'lodash'
import { ManaIcon } from './ManaIcon'
import { useDeck } from './useDeck'

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
        'grid-cols-7': cols.length === 7,
      })}
    >
      {cols.map((col, i) => (
        <div key={i}>
          <div className={`text-${faction} text-xl font-bold`}>{col.title} &nbsp;</div>
          {col.cards.map((card) => (
            <div key={card.id} className="mt-2 flex items-center">
              <ManaIcon mana={card.cost} />
              <span className="ml-2 flex-1 truncate text-sm mt-[-1px]">
                {card.count} x{' '}
                <span className={`text-${card.rarity.toLowerCase()}`}>{card.title}</span>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
