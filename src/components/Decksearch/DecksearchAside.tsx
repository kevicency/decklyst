import { Aside } from '@/components/Aside'
import type { Filters } from '@/components/Decksearch'
import { Filter } from '@/components/Filter'
import type { Faction } from '@/data/cards'
import { allCards, factions as allFactions } from '@/data/cards'
import { Switch } from '@headlessui/react'
import { startCase, throttle } from 'lodash'
import type { FC, PropsWithChildren } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CardsCombobox } from '../CardsCombobox'
import { Tag } from '../Tag'
import { TagsCombobox } from '../TagsCombobox'
import { Toggle } from '../Toggle'

const RangeSliderInput: FC<
  PropsWithChildren<{
    min?: number
    max?: number
    value: number
    onChange: (value: number) => void
    debounce?: number
  }>
> = ({ min = 0, max = 100, value, onChange, children }) => {
  return (
    <label className="text-gray font-medium">
      {children} [<span className="font-semibold text-accent-200">{value}</span>]
      <input
        type="range"
        min={String(min)}
        max={String(max)}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="mt-2 inline-block h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-600 accent-accent-500"
      ></input>
    </label>
  )
}

// function useDebouncedFn(cb: any, delay: number) {
//   // ...
//   const inputsRef = useRef({cb, delay}); // mutable ref like with useThrottle
//   useEffect(() => { inputsRef.current = { cb, delay }; }); //also track cur. delay
//   return useCallback(
//     _.debounce((...args) => {
//         // Debounce is an async callback. Cancel it, if in the meanwhile
//         // (1) component has been unmounted (see isMounted in snippet)
//         // (2) delay has changed
//         if (inputsRef.current.delay === delay && isMounted())
//           inputsRef.current.cb(...args);
//       }, delay, options
//     ),
//     [delay, _.debounce]
//   );
// }
function useThrottle(cb: Function, delay: number) {
  const options = { leading: false, trailing: true } // add custom lodash options
  const cbRef = useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay],
  )
}
export const DecksearchAside: FC<{
  filters: Filters
  updateFilters: (filters: Partial<Filters>) => void
  hideIncludeAnonymous?: boolean
}> = ({ updateFilters, filters, hideIncludeAnonymous }) => {
  const handleFactionChanged = (faction: string) => (enabled: boolean) => {
    updateFilters({
      factions: enabled
        ? [...filters.factions, faction]
        : filters.factions.filter((x) => x !== faction),
    })
  }
  const updateMaxSpiritFilterDebounced = useThrottle((value: number) => {
    updateFilters({ maxSpirit: value })
  }, 1000)
  const [spirit, setSpirit] = useState(filters.maxSpirit)
  const handleMaxSpiritChanged = (value: number) => {
    setSpirit(value)
    updateMaxSpiritFilterDebounced(value)
  }
  const cards = useMemo(
    () =>
      allCards.filter((card) =>
        filters.factions?.length ? filters.factions.includes(card.faction) : true,
      ),
    [filters.factions],
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
          <Filter title="Tags" onClear={() => updateFilters({ tags: [] })}>
            <TagsCombobox
              value={filters.tags}
              onChange={(value) => {
                updateFilters({ tags: value })
              }}
            />
            <div className="mt-1 flex flex-wrap items-start justify-start gap-1">
              {filters.tags.map((tag) => (
                <Tag
                  key={tag}
                  tag={tag}
                  onDelete={() => updateFilters({ tags: filters.tags.filter((x) => x !== tag) })}
                />
              ))}
            </div>
          </Filter>
          <Filter title="Cards" onClear={() => updateFilters({ cardIds: [] })}>
            <CardsCombobox
              cards={cards}
              value={filters.cardIds}
              onChange={(value) => updateFilters({ cardIds: value })}
            />
            <div className="mt-1 text-sm">
              {filters.cardIds.length} {filters.cardIds.length === 1 ? 'card' : 'cards'} selected
            </div>
          </Filter>
          <Filter title="Deck" onClear={() => handleMaxSpiritChanged(25000)}>
            <div className="flex flex-col gap-y-3">
              <RangeSliderInput
                min={1560}
                max={25000}
                value={spirit ?? 25000}
                onChange={(value) => handleMaxSpiritChanged(value)}
              >
                Max Spirit
              </RangeSliderInput>
              {!hideIncludeAnonymous && (
                <Toggle
                  checked={filters.includeAnonymous}
                  onChange={(checked) => updateFilters({ includeAnonymous: checked })}
                >
                  Created by<span className="t font-semibold">Anonymous</span>
                </Toggle>
              )}
              <Toggle
                checked={filters.includeUntitled}
                onChange={(checked) => updateFilters({ includeUntitled: checked })}
              >
                Include Untitled
              </Toggle>
              <Toggle
                checked={filters.includeDrafts}
                onChange={(checked) => updateFilters({ includeDrafts: checked })}
              >
                Show drafts (&ne; 40 cards)
              </Toggle>
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
