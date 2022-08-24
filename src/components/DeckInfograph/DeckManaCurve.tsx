import { useDeck } from '@/context/useDeck'
import type { Faction } from '@/data/cards'
import type { ManaCurve } from '@/data/deck'
import type { FC } from 'react'
import { ManaIcon } from './ManaIcon'

export const DeckManaCurve = () => {
  const { faction, manaCurve } = useDeck()

  return (
    <div className="flex flex-row">
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
  <div className="flex flex-col text-center w-6 items-stretch h-[100px]">
    <div className="flex flex-1 flex-col items-stretch mx-0.5">
      <div className="flex-1"></div>
      <div>{abs}</div>
      <div className={`bg-${faction} w-full`} style={{ height: `${Math.round(50 * rel)}px` }}>
        &nbsp;
      </div>
    </div>
    <div className="border-t-2 border-slate-200 h-[26px]">
      <ManaIcon mana={mana === 9 ? '9+' : mana} className="mt-1" />
    </div>
  </div>
)
