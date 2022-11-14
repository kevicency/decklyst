import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardType } from '@/data/cards'
import type { CardEntry } from '@/data/deck'
import { useSpriteQuery } from '@/hooks/useSpriteQuery'
import { get, startCase } from 'lodash'
import type { FC } from 'react'
import colors from 'tailwindcss/colors'

export const SidebarCardList: FC<{ cardType: CardType }> = ({ cardType }) => {
  const deck = useDeck()
  const path = `${cardType.toLowerCase()}s`
  const cards: CardEntry[] = get(deck, path, [])
  const count: number = get(deck.counts, path, 0)

  return (
    <div className="mb-3">
      <div className="mb-1 font-mono text-lg">
        <span className={`text-${deck.faction} inline-block w-8`}>{count}</span>
        <span>{startCase(cardType)}s</span>
      </div>
      <ul>
        {cards.map((card) => (
          <SidebarCardEntry key={card.id} card={card} />
        ))}
      </ul>
    </div>
  )
}

export const SidebarCardEntry: FC<{ card: CardEntry }> = ({ card }) => {
  const { data: sprite } = useSpriteQuery(card.id)
  const [, { removeCard, addCard }] = useDeckcode()
  return (
    <div
      className="relative cursor-pointer select-none bg-alt-800 transition-transform hover:bg-alt-600 active:scale-95"
      onClick={(ev) =>
        ev.altKey ? addCard(card.id, ev.shiftKey ? 3 : 1) : removeCard(card.id, ev.shiftKey ? 3 : 1)
      }
    >
      <div
        className="sprite absolute left-0 top-0 right-0.5 h-full"
        style={{
          backgroundImage: `url(${sprite?.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: '90px',
        }}
      />
      <div
        className="absolute left-0 top-0 h-full w-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 25%, ${colors.slate[900]}c8 100%)`,
        }}
      />
      <div className="relative mb-1 flex w-full items-center py-1.5">
        <ManaIcon mana={card.mana} className="-ml-2.5 mr-1" />
        <div className="text-sm">{card.name}</div>
        <div className="flex-1" />
        <div
          className={`border border-alt-600 bg-alt-800 px-1 text-center font-mono font-bold text-alt-200`}
        >
          x{card.count}
        </div>
      </div>
    </div>
  )
}
