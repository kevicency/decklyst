import { Aside } from '@/components/Aside'
import type { Filters } from '@/components/Decksearch'
import { Filter } from '@/components/Filter'
import type { Faction } from '@/data/cards'
import { allCards, factions as allFactions } from '@/data/cards'
import { Combobox, Switch } from '@headlessui/react'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo, useState } from 'react'

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
  let [query, setQuery] = useState('')
  const cards = useMemo(
    () =>
      allCards
        .filter((card) => card.cardType !== 'General')
        .filter((card) =>
          filters.factions?.length ? filters.factions.includes(card.faction) : true,
        )
        .filter((card) => (query ? new RegExp(query, 'i').test(card.name) : true))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [query, filters.factions],
  )

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
          <Filter title="Card" onClear={() => updateFilters({ cardIds: [] })}>
            <Combobox
              multiple
              value={filters.cardIds}
              onChange={(value) => {
                updateFilters({ cardIds: value })
                setQuery('')
              }}
              as="div"
            >
              <div className="relative">
                <span className="relative inline-flex w-full flex-row overflow-hidden">
                  <Combobox.Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-none bg-alt-800 px-2 py-2 outline-none"
                  />
                  <Combobox.Button className="cursor-default border-l border-gray-600 bg-alt-850 px-1 text-accent-600 focus:outline-none">
                    <span className="pointer-events-none flex items-center px-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Combobox.Button>
                </span>

                <div className="absolute mt-1 w-full rounded-md bg-alt-1000 shadow-lg">
                  <Combobox.Options className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5">
                    {cards.map((card) => (
                      <Combobox.Option
                        key={card.id}
                        value={card.id}
                        className={({ active }) => {
                          return cx(
                            'relative cursor-default select-none py-2 pl-3 pr-9 text-gray-100 focus:outline-none',
                            active ? 'bg-accent-600' : '',
                          )
                        }}
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={cx(
                                'block truncate',
                                selected ? 'font-semibold' : 'font-normal',
                              )}
                            >
                              {card.name}
                            </span>
                            {selected && (
                              <span
                                className={cx(
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                  active ? 'text-white' : 'text-indigo-600',
                                )}
                              >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </div>
            </Combobox>
            <div className="text-sm">
              {filters.cardIds.length} {filters.cardIds.length === 1 ? 'card' : 'cards'} selected
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
