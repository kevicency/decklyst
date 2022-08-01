import { FC } from 'react'
import { Faction } from '../../data/types'
import { useDeck } from './useDeck'

const CardCount: FC<{ faction: Faction; label: string; count: number }> = ({
  faction,
  label,
  count,
}) => (
  <div className="flex flex-col text-center">
    <span className="text-xl mb-2">{label}</span>
    <span className={`text-${faction} text-xl font-bold`}>{count}</span>
  </div>
)
export const DeckCounts = () => {
  const { faction, counts } = useDeck()
  return (
    <div className="flex flex-row pt-6 justify-around">
      <CardCount faction={faction} label="Minions" count={counts.minions} />
      <CardCount faction={faction} label="Spells" count={counts.spells} />
      <CardCount faction={faction} label="Artifacts" count={counts.artifacts} />
    </div>
  )
}
const CardCountAlt: FC<{ faction: Faction; label: string; count: number }> = ({
  faction,
  label,
  count,
}) => (
  <div className="flex ">
    <span className={`text-${faction} text-xl font-bold w-6 mr-2 text-end`}>{count}</span>
    <span className="text-xl mb-1">{label}</span>
  </div>
)
export const DeckCountsAlt = () => {
  const { faction, counts } = useDeck()
  return (
    <div className="flex flex-col justify-around">
      <CardCountAlt faction={faction} label="Minions" count={counts.minions} />
      <CardCountAlt faction={faction} label="Spells" count={counts.spells} />
      <CardCountAlt faction={faction} label="Artifacts" count={counts.artifacts} />
    </div>
  )
}
