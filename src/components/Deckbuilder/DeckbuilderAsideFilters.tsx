import { useCardFilters } from '@/context/useCardFilters'
import { useDeck } from '@/context/useDeck'
import type { CardType, Rarity } from '@/data/cards'
import { keywords } from '@/data/cards'
import { Switch } from '@headlessui/react'
import cx from 'classnames'
import { range, startCase } from 'lodash'
import type { FC } from 'react'
import { ManaIcon } from '../DeckInfograph/ManaIcon'
import { Filter } from '../Filter'
import { ArtifactIcon, MinionIcon, SpellIcon } from '../Icons'

const rarities: Rarity[] = ['basic', 'common', 'rare', 'epic', 'legendary']
const cardTypes: CardType[] = ['Minion', 'Spell', 'Artifact']
export const DeckbuilderAsideFilters: FC = () => {
  const { faction } = useDeck()
  const [{ mana, rarity, cardType, keyword }, { updateCardFilters }] = useCardFilters()

  return (
    <>
      <Filter title="Mana cost" onClear={() => updateCardFilters({ mana: [] })}>
        <div className="grid grid-cols-5 justify-center gap-x-4 gap-y-3">
          {range(0, 10).map((value) => (
            <Switch
              key={value}
              checked={mana.includes(value)}
              onChange={(checked: boolean) =>
                updateCardFilters({
                  mana: checked ? [...mana, value] : mana.filter((v) => v !== value),
                })
              }
              className=""
              as="button"
            >
              {({ checked }) => (
                <ManaIcon
                  mana={value === 9 ? '9+' : value}
                  className={cx(
                    checked
                      ? 'scale-125 opacity-100'
                      : 'opacity-75 hover:scale-105 hover:opacity-90',
                  )}
                />
              )}
            </Switch>
          ))}
        </div>
      </Filter>
      <Filter title="Rarity" onClear={() => updateCardFilters({ rarity: [] })}>
        <div className="grid grid-cols-5 gap-x-2">
          {rarities.map((value) => (
            <Switch
              key={value}
              checked={rarity.includes(value)}
              onChange={(checked: boolean) =>
                updateCardFilters({
                  rarity: checked ? [...rarity, value] : rarity.filter((v) => v !== value),
                })
              }
              className="-mt-1 flex flex-col items-center"
              as="button"
            >
              {({ checked }) => (
                <>
                  <img
                    src={`/assets/icons/rarity/collection_card_rarity_${value}.png`}
                    width="64"
                    className={cx(
                      checked
                        ? 'scale-150 brightness-100'
                        : 'scale-125 brightness-75 hover:scale-135 hover:brightness-90',
                    )}
                    alt={value}
                  />
                  <span className="text-xs">{startCase(value).slice(0, 9)}</span>
                </>
              )}
            </Switch>
          ))}
        </div>
      </Filter>
      <Filter title="Card Type" onClear={() => updateCardFilters({ cardType: [] })}>
        <div className="grid grid-cols-3 gap-x-2">
          {cardTypes.map((value) => (
            <Switch
              key={value}
              checked={cardType.includes(value)}
              onChange={(checked: boolean) =>
                updateCardFilters({
                  cardType: checked ? [...cardType, value] : cardType.filter((v) => v !== value),
                })
              }
              className="group flex flex-col items-center gap-y-2"
              as="button"
            >
              {({ checked }) => (
                <>
                  <span
                    className={cx(
                      `text-4xl group-hover:text-${faction}`,
                      checked
                        ? `text-${faction} scale-110 opacity-100`
                        : 'opacity-75 group-hover:scale-105',
                    )}
                  >
                    {value === 'Minion' && <MinionIcon />}
                    {value === 'Spell' && <SpellIcon />}
                    {value === 'Artifact' && <ArtifactIcon />}
                  </span>
                  <span className="text-xs">{startCase(value)}</span>
                </>
              )}
            </Switch>
          ))}
        </div>
      </Filter>
      <Filter title="Keywords" onClear={() => updateCardFilters({ keyword: undefined })}>
        <select
          value={keyword ?? ''}
          className="bg-alt-850 px-2 py-2"
          onChange={(ev) => updateCardFilters({ keyword: ev.target.value || undefined })}
        >
          <option value="" disabled hidden>
            Pick a card keyword
          </option>
          {keywords.sort().map((value) => (
            <option key={value} value={value}>
              {startCase(value)}
            </option>
          ))}
        </select>
        {/* <Listbox
              value={keyword ?? ''}
              onChange={(value) => updateCardFilters({ keyword: value ?? undefined })}
            >
              <Listbox.Button className="btn" placeholder="Pick a keyword">
                {startCase(keyword ?? 'Pick a keyword')}
              </Listbox.Button>
              <Listbox.Options>
                {keywords.map((value) => (
                  <Listbox.Option key={value} value={value}>
                    {startCase(value)}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox> */}
      </Filter>
    </>
  )
}
