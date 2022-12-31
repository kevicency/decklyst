import { useDeck } from '@/context/useDeck'
import { playableMinionOnTheDrawChance, playableMinionOnThePlayChance } from '@/data/deck'
import { chain, sumBy } from 'lodash'
import { Fragment, useMemo } from 'react'
import { FaChevronDown } from 'react-icons/fa'

export const OpeningHandChart = () => {
  const deck = useDeck()
  const probabilities = useMemo(
    () => [playableMinionOnThePlayChance(deck), playableMinionOnTheDrawChance(deck)],
    [deck],
  )

  return (
    <div className="text-center">
      <div className="mb-4 text-gray-400">Chance to have a playable minion</div>
      <div className="grid grid-cols-2 items-center gap-1.5">
        <span>On the play</span>
        <span>On the draw</span>
        {probabilities.map(([p1], i) => (
          <div
            className={`flex flex-col bg-alt-1000/50 py-2 font-mono text-xl text-${deck.faction}`}
            key={i}
          >
            {Math.round(p1 * 1000) / 10}%
          </div>
        ))}
        <div className="col-span-2 flex w-full items-center justify-around px-3 text-gray-200">
          <FaChevronDown />
          with full mulligan
          <FaChevronDown />
        </div>
        {probabilities.map(([, p2], i) => (
          <div
            className={`flex flex-col bg-alt-1000/50 py-2 font-mono text-xl text-${deck.faction}`}
            key={i}
          >
            {Math.round(p2 * 1000) / 10}%
          </div>
        ))}
      </div>
    </div>
  )
}

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
