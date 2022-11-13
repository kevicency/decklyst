import { useDeck } from '@/context/useDeck'
import type { Faction } from '@/data/cards'
import type { FC } from 'react'

const CardCount: FC<{ faction: Faction; label: string; count: number; of?: number }> = ({
  faction,
  label,
  count,
  of,
}) => (
  <div className="flex flex-col text-center">
    <span className="mb-2 text-xl">{label}</span>
    <span className={`text-${faction} text-xl font-bold`}>
      {of && count !== of ? `${count}/${of}` : count}
    </span>
  </div>
)
export const DeckCounts: FC<{ showTotal?: boolean }> = ({ showTotal }) => {
  const { faction, counts } = useDeck()
  return (
    <div className="flex min-w-min shrink-0 flex-row justify-around gap-x-4">
      <CardCount faction={faction} label="Minions" count={counts.minions} />
      <CardCount faction={faction} label="Spells" count={counts.spells} />
      <CardCount faction={faction} label="Artifacts" count={counts.artifacts} />
      {showTotal && <CardCount faction={faction} label="Total" count={counts.total} of={40} />}
    </div>
  )
}
const CardCountAlt: FC<{ faction: Faction; label: string; count: number }> = ({
  faction,
  label,
  count,
}) => (
  <div className="flex ">
    <span className={`text-${faction} mr-2 w-6 text-end text-xl font-bold`}>{count}</span>
    <span className="mb-1 text-xl">{label}</span>
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
