import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { SidebarCardList } from '@/components/Deckbuilder/SidebarCardList'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardData } from '@/data/cards'
import { cards } from '@/data/cards'
import cx from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'

export const Sidebar: FC<{ selectGeneral: (general: CardData) => void }> = ({ selectGeneral }) => {
  const deck = useDeck()
  const [{ title }, { updateTitle }] = useDeckcode()

  const generals = useMemo(
    () =>
      cards.filter(({ cardType, faction }) => faction === deck.faction && cardType === 'General'),
    [deck.faction],
  )

  return (
    <div className="flex flex-col shrink-0 gap-y-4 bg-slate-900 pt-4">
      <div>
        <input
          className="px-2 py-2 bg-slate-800 w-full"
          placeholder="Untitled"
          value={title}
          onChange={(ev) => updateTitle(ev.target.value)}
        />
      </div>
      <div className="mx-auto">
        <DeckManaCurve />
      </div>
      <div className="flex justify-around pl-2 -mr-1">
        {generals.map((general) => (
          <GeneralCard
            size="sm"
            general={general}
            onSelect={selectGeneral}
            key={general.id}
            className={cx(
              'transition-al ',
              general.id === deck.general.id ? `opacity-100 text-${deck.faction}` : 'opacity-60',
            )}
          />
        ))}
      </div>
      <div className="px-2">
        <SidebarCardList cardType="Minion" />
        <SidebarCardList cardType="Spell" />
        <SidebarCardList cardType="Artifact" />
      </div>
    </div>
  )
}
