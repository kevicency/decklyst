import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { useDeck } from '@/context/useDeck'
import type { FC } from 'react'

type Props = { deckcode?: string }

export const Sidebar: FC = () => {
  const deck = useDeck()

  return (
    <div className="flex flex-col shrink-0">
      <div>
        <input className="w-full" placeholder="Untitled" />
      </div>
      <div>
        <DeckCounts showTotal={true} />
      </div>
      <div>
        <DeckManaCurve />
      </div>
      <div>
        <ul>
          {[deck.cards].flatMap((cards) =>
            cards.map((card) => (
              <li key={card.id}>
                {card.count}x {card.title}
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  )
}

export const Deckbuilder: FC<Props> = ({ deckcode }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="truncate">{deckcode}</div>
      <Sidebar />
    </div>
  )
}
