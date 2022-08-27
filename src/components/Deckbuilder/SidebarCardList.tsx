import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { CardType } from '@/data/cards'
import type { CardEntry } from '@/data/deck'
import { useSpriteQuery } from '@/queries/useSpriteQuery'
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
      <div className="text-lg font-mono mb-1">
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
      className="relative bg-gray-800 hover:bg-gray-600 cursor-pointer select-none transition-transform active:scale-95"
      onClick={(ev) => (ev.shiftKey ? addCard(card.id) : removeCard(card.id))}
    >
      <div
        className="absolute left-0 top-0 right-0.5 h-full sprite"
        style={{
          backgroundImage: `url(${sprite?.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: '90px',
        }}
      />
      <div
        className="absolute left-0 top-0 w-full h-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 25%, ${colors.slate[900]}c8 100%)`,
        }}
      />
      <div className="flex items-center w-full mb-1 py-1.5 relative">
        <ManaIcon mana={card.mana} className="-ml-2.5 mr-1" />
        <div className="text-sm">{card.name}</div>
        <div className="flex-1" />
        <div
          className={`font-mono font-bold border border-gray-600 text-gray-200 bg-gray-800 text-center px-1`}
        >
          x{card.count}
        </div>
      </div>
    </div>
  )
}
