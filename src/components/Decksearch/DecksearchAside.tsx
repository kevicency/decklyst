import { Aside } from '@/components/Aside'
import type { Filters } from '@/components/Decksearch'
import { Filter } from '@/components/Filter'
import type { Faction } from '@/data/cards'
import { factions as allFactions } from '@/data/cards'
import { Switch } from '@headlessui/react'
import { startCase } from 'lodash'
import type { FC } from 'react'

export const DecksearchAside: FC<{
  filters: Filters
  updateFilters: (filters: Partial<Filters>) => void
}> = ({ updateFilters, filters }) => {
  const handleFactionChanged = (faction: string) => (enabled: boolean) => {
    updateFilters({
      factions: enabled
        ? [...filters.factions, faction]
        : filters.factions.filter((x) => x !== faction),
    })
  }

  return (
    <Aside
      filters={
        <>
          <Filter title="Faction" onClear={() => updateFilters({ factions: [] })}>
            <div className="grid grid-cols-2 gap-x-4">
              {allFactions.map((faction) => (
                <FactionSwitch
                  key={faction}
                  faction={faction}
                  enabled={filters.factions.includes(faction)}
                  onChange={handleFactionChanged(faction)}
                />
              ))}
            </div>
          </Filter>
        </>
      }
    />
  )
}

export const FactionSwitch: FC<{
  faction: Faction
  enabled: boolean
  onChange: (enabled: boolean) => void
}> = ({ faction, enabled, onChange }) => {
  return (
    <Switch checked={enabled} onChange={onChange} className="flex items-center gap-x-2">
      <img
        src={`/assets/runes/${faction}.png`}
        className={`h-8 ${enabled ? 'opacity-100' : 'opacity-75'}`}
        alt={faction}
      />
      <span className={`${enabled ? `text-${faction}` : 'text-gray-400'} hover:text-${faction}`}>
        {startCase(faction)}
      </span>
    </Switch>
  )
}
