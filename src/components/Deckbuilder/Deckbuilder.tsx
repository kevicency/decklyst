import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { FC } from 'react'

export const Sidebar: FC = () => {
  const deck = useDeck()
  const [{ title }, { updateTitle }] = useDeckcode()

  return (
    <div className="flex flex-col shrink-0">
      <div>
        <input
          className="w-full"
          placeholder="Untitled"
          value={title}
          onChange={(ev) => updateTitle(ev.target.value)}
        />
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
                {card.count}x {card.name}
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  )
}

export const Deckbuilder = () => {
  const [deckcode, { addCard }] = useDeckcode()

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="truncate">{JSON.stringify(deckcode)}</div>
        <button onClick={() => addCard(11245)}>Add card</button>
      </div>
      <Sidebar />
    </div>
  )
}
