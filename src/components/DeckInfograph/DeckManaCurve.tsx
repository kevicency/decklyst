import { useDeck } from '@/context/useDeck'
import type { Faction } from '@/data/cards'
import type { ManaCurve } from '@/data/deck'
import type { FC } from 'react'
import { ManaIcon } from './ManaIcon'

export const DeckManaCurve = () => {
  const { faction, manaCurve } = useDeck()

  return (
    <div className="flex min-w-min shrink-0 flex-row">
      {manaCurve.map((entry, mana) => (
        <ManaCurveBar key={mana} entry={entry} mana={mana} faction={faction} />
      ))}
    </div>
  )
}
const ManaCurveBar: FC<{ entry: ManaCurve[0]; mana: number; faction: Faction }> = ({
  entry: { abs, rel },
  mana,
  faction,
}) => (
  <div className="flex h-[100px] w-6 flex-col items-stretch text-center">
    <div className="mx-0.5 flex flex-1 flex-col items-stretch">
      <div className="flex-1"></div>
      <div>{abs}</div>
      <div
        className={`bg-${faction} w-full transition-all`}
        style={{ height: `${Math.round(50 * rel)}px` }}
      >
        &nbsp;
      </div>
    </div>
    <div className="h-[26px] border-t-2 border-gray-200">
      <ManaIcon mana={mana === 9 ? '9+' : mana} className="mt-1" />
    </div>
  </div>
)
