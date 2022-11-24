import { useDeck } from '@/context/useDeck'
import { chain, sumBy } from 'lodash'
import { Fragment } from 'react'

export const FactionChart = () => {
  const deck = useDeck()
  const data = chain(deck.cards)
    .groupBy((card) => card.faction)
    .reduce(
      (memo, cards, faction) => ({
        ...memo,
        [faction]: sumBy(cards, (card) => card.count),
      }),
      { neutral: 0, [deck.faction]: 0 },
    )
    .value()
  const max = Math.max(...Object.values(data))

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-2 items-center gap-x-2 gap-y-1">
      {[deck.faction, 'neutral'].map((faction) => (
        <Fragment key={faction}>
          <img src={`/assets/runes/${faction}.png`} className="h-8" alt={faction} />
          <div className="h-6 flex-1">
            <div
              className={`bg-${faction} h-full`}
              style={{ width: `${(data[faction] / max) * 100}%` }}
            />
          </div>
          <div className={`text-${faction} font-mono`}>{data[faction]}</div>
        </Fragment>
      ))}
    </div>
  )
}
