import { Aside } from '@/components/Aside'
import type { Filters } from '@/components/Decksearch'
import { Filter } from '@/components/Filter'
import type { Faction } from '@/data/cards'
import { allCards, factions as allFactions } from '@/data/cards'
import { maxSpiritCost } from '@/data/deck'
import { Switch } from '@headlessui/react'
import { startCase } from 'lodash'
import type { FC } from 'react'
import { useMemo } from 'react'
import { AuthorCombobox } from '../Inputs/AuthorCombobox'
import { CardsCombobox } from '../Inputs/CardsCombobox'
import { TagsCombobox } from '../Inputs/TagsCombobox'
import { Toggle } from '../Inputs/Toggle'
import { Tag } from '../Tag'
import { SpiritSlider } from './SpiritSlider'

export const DecksearchAside: FC<{
  filters: Filters
  updateFilters: (filters: Partial<Filters>) => void
  hideAuthorFilters?: boolean
}> = ({ updateFilters, filters, hideAuthorFilters }) => {
  const handleFactionChanged = (faction: string) => (enabled: boolean) => {
    updateFilters({
      factions: enabled
        ? [...filters.factions, faction]
        : filters.factions.filter((x) => x !== faction),
    })
  }
  const cards = useMemo(
    () =>
      allCards.filter(
        (card) =>
          card.faction === 'neutral' ||
          (filters.factions?.length ? filters.factions.includes(card.faction) : true),
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
          {!hideAuthorFilters && (
            <Filter title="Author" onClear={() => updateFilters({ authorId: undefined })}>
              <AuthorCombobox
                value={filters.authorId ?? ''}
                onChange={(value) => updateFilters({ authorId: value })}
              />
            </Filter>
          )}
          <Filter title="Deck" onClear={() => updateFilters({ maxSpirit: maxSpiritCost })}>
            <div className="flex flex-col gap-y-3">
              <SpiritSlider
                key={filters.maxSpirit}
                value={filters.maxSpirit}
                onChange={(value) => updateFilters({ maxSpirit: value })}
              />
              {!hideAuthorFilters && (
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
