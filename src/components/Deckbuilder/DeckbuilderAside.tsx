import { CardsInDeck } from '@/components/Deckbuilder/CardsInDeck'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { OneTimeButton } from '@/components/OneTimeButton'
import { useCardFilters } from '@/context/useCardFilters'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardType, Rarity } from '@/data/cards'
import { keywords } from '@/data/cards'
import type { DeckDiff } from '@/hooks/useDeckDiff'
import { Switch } from '@headlessui/react'
import cx from 'classnames'
import { debounce, noop, range, startCase } from 'lodash'
import Link from 'next/link'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Aside } from '../Aside'
import { ManaIcon } from '../DeckInfograph/ManaIcon'
import { Filter } from '../Filter'
import {
  ArtifactIcon,
  ChangesIcon,
  CopyIcon,
  DoneIcon,
  MinionIcon,
  SaveIcon,
  SpellIcon,
  TrashIcon,
} from '../Icons'
import { DeckDiffDialog } from './DeckDiffDialog'

export const DeckbuilderAside: FC<{ deckDiff?: DeckDiff }> = ({ deckDiff }) => {
  const deck = useDeck()
  const [{ title, cards, $encoded: encodedDeckcode }, { updateTitle, clear }] = useDeckcode()
  const [titleValue, setTitleValue] = useState(title)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTitleDebounced = useCallback(debounce(updateTitle, 500), [updateTitle])
  const [showDeckDiff, setShowDeckDiff] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(encodedDeckcode!)
  }

  return (
    <>
      <Aside filters={<DeckbuilderAsideFilters />}>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-2 p-2">
            <input
              className="w-full bg-alt-800 px-2 py-2"
              placeholder="Untitled"
              autoFocus
              value={titleValue}
              onChange={(ev) => {
                setTitleValue(ev.target.value)
                updateTitleDebounced(ev.target.value)
              }}
            />

            <button
              className="flex bg-red-900 px-3 py-2 text-xl hover:bg-red-700"
              onClick={clear}
              aria-label="Delete"
            >
              <TrashIcon />
            </button>
          </div>
          <div className="mx-auto px-2 pb-2">
            <DeckManaCurve />
          </div>
          <div className="-mb-4 flex flex-1 overflow-y-hidden">
            <div className="flex-1 overflow-y-scroll pl-4 pr-2">
              <CardsInDeck cardType="Minion" />
              <CardsInDeck cardType="Spell" />
              <CardsInDeck cardType="Artifact" />
            </div>
          </div>
          {deckDiff && (
            <div className="-mb-4 grid grid-cols-2 gap-2 border-t border-alt-700 bg-alt-900 px-2 py-2">
              <div className={cx(`flex justify-center gap-1 text-lg`)}>
                <span className={`text-${deck.faction} font-mono font-semibold`}>
                  {deckDiff.changes}
                </span>
                <span>changes</span>
              </div>
              <button className={cx('btn px-2 py-1')} onClick={() => setShowDeckDiff(true)}>
                <ChangesIcon size={20} /> Show
              </button>
            </div>
          )}
          <div className="-mb-4 grid grid-cols-2 gap-2 border-t border-alt-700 bg-alt-900 px-2 py-2">
            <div className={cx(`flex justify-center font-mono text-xl font-bold`)}>
              <span className={`text-${deck.faction}`}>{deck.counts.total}</span>/
              <span
                className={cx({
                  'text-red-600': deck.counts.total > 40,
                  [`text-${deck.faction}`]: deck.counts.total === 40,
                })}
              >
                40
              </span>
            </div>
            <Link
              href={{ pathname: '/[code]', query: { code: encodedDeckcode } }}
              prefetch={false}
              className={cx('btn px-2 py-1')}
            >
              <SaveIcon /> Save
            </Link>
          </div>
          <div className="flex border-t border-alt-700 bg-alt-1000">
            <OneTimeButton
              onClick={handleCopy}
              timeout={2500}
              className="shrink-0 border-b-2 border-alt-600 bg-gray-900"
            >
              {(copied) => (
                <>
                  {copied ? <DoneIcon /> : <CopyIcon />}
                  Copy
                </>
              )}
            </OneTimeButton>
            <input
              className="page-header-input w-full bg-alt-1000 px-3 text-alt-200"
              readOnly
              value={deck.deckcode}
              onChange={noop}
              onFocus={(ev) => setTimeout(() => ev.target.select(), 50)}
              aria-label="Deckcode"
            />
          </div>
        </div>
      </Aside>
      {deckDiff && (
        <DeckDiffDialog
          open={showDeckDiff}
          onClose={() => setShowDeckDiff(false)}
          deckDiff={deckDiff}
        />
      )}
    </>
  )
}

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
