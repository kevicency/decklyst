import { useDeck } from '@/context/useDeck'
import type { CardType } from '@/data/cards'
import type { CardEntry } from '@/data/deck'
import { get, startCase } from 'lodash'
import type { FC } from 'react'

export const SidebarCardList: FC<{ cardType: CardType }> = ({ cardType }) => {
  const deck = useDeck()
  const path = `${cardType.toLowerCase()}s`
  const cards: CardEntry[] = get(deck, path, [])
  const count: number = get(deck.counts, path, 0)
  return (
    <div className="my-2">
      <div className="text-lg font-mono mb-1">
        <span className={`text-${deck.faction} inline-block w-8`}>{count}</span>
        <span>{startCase(cardType)}s</span>
      </div>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            {card.count}x {card.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
