import { useDeck } from '@/context/useDeck'
import cx from 'classnames'
import { chunk, flatMap } from 'lodash'
import { ManaIcon } from './ManaIcon'

export const DeckCardList = () => {
  const { faction, minions, spells, artifacts, counts } = useDeck()

  const cols = flatMap([minions, spells, artifacts], (cards, i) =>
    chunk(cards, 6).map((chunked, j) => ({
      title: j === 0 ? (i === 0 ? 'Minions' : i === 1 ? 'Spells' : 'Artifacts') : '',
      count: i === 0 ? counts.minions : i === 1 ? counts.spells : counts.artifacts,
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
          <div className={`text-xl`}>
            {col.title ? (
              <>
                <span className={`text-${faction} mr-2 font-bold`}>{col.count}</span>
                <span className={`font-light`}>{col.title}</span>
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
          {col.cards.map((card) => (
            <div key={card.id} className="mt-2 flex items-center">
              <ManaIcon mana={card.mana} />
              <a
                className="ml-2 mt-[-1px] flex-1 truncate text-sm"
                data-tip={card.id}
                data-for="card-tooltip"
              >
                {card.count} x{' '}
                <span className={`text-${card.rarity.toLowerCase()}`}>{card.name}</span>
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
