import { createContext, FC, useContext } from 'react'
import { DeckData, ManaCurveEntry } from '../../lib/deckcode'
import { startCase } from 'lodash'
import { Faction } from '../../data/types'

export const DeckContext = createContext<DeckData>({} as DeckData)
export const useDeck = () => useContext(DeckContext)

export const DeckInfograph: FC<{ deck: DeckData }> = ({ deck }) => {
  return (
    <DeckContext.Provider value={deck}>
      <div className="grid grid-cols-3 gap-6">
        <DeckTitle />
        <DeckMetadata />
        <DeckManaCurve />
      </div>
    </DeckContext.Provider>
  )
}

export const DeckTitle = () => {
  const { general, title, faction } = useDeck()
  return (
    <div className="flex">
      <div className="w-24 mt-[-12px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/generals/${general.id}_hex@2x.png`}
          alt={general.title}
          className="w-24"
        />
      </div>
      <div className="flex flex-col py-4">
        <div className="font-bold text-3xl mb-2">{title}</div>
        <div className={`text-xl text-${faction}`}>{startCase(faction)}</div>
      </div>
    </div>
  )
}

export const Count: FC<{ faction: Faction; label: string; count: number }> = ({
  faction,
  label,
  count,
}) => (
  <div className="flex flex-col text-center">
    <span className="text-xl mb-2">{label}</span>
    <span className={`text-${faction} text-xl font-bold`}>{count}</span>
  </div>
)
export const CountDivider = () => (
  <div className="w-full w-0.5 my-1 mx-2 mb-2 bg-transparent flex-1" />
)

export const DeckMetadata = () => {
  const { faction, counts } = useDeck()
  return (
    <div className="flex flex-row pt-6">
      <Count faction={faction} label="Minions" count={counts.minions} />
      <CountDivider />
      <Count faction={faction} label="Spells" count={counts.spells} />
      <CountDivider />
      <Count faction={faction} label="Artifacts" count={counts.artifacts} />
    </div>
  )
}

const DeckManaCurve = () => {
  const { faction, manaCurve } = useDeck()

  return (
    <div className="flex flex-row">
      {manaCurve.map((entry, mana) => (
        <DeckManaCurveBar key={mana} entry={entry} mana={mana} faction={faction} />
      ))}
    </div>
  )
}
const DeckManaCurveBar: FC<{ entry: ManaCurveEntry; mana: number; faction: Faction }> = ({
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
    <div className="border-t-2 border-slate-200 bg-slate-800 h-[26px]">{mana}</div>
  </div>
)
