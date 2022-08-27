import { Card } from '@/components/Deckbuilder/Card'
import { useCardFilter } from '@/context/useCardFilter'
import { useDeck } from '@/context/useDeck'
import type { CardData } from '@/data/cards'
import { cardCompareFn, cards } from '@/data/cards'
import type { FC } from 'react'
import { useMemo } from 'react'

export type CardHandler = (card: CardData) => void

export const CardList: FC<{
  onSelectCard: CardHandler
  onDeselectCard: CardHandler
}> = ({ onSelectCard, onDeselectCard }) => {
  const deck = useDeck()
  const { faction, query } = useCardFilter()
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => card.cardType !== 'General' && card.rarity !== 'token')
        .filter((card) => (faction ? card.faction === faction : true))
        .filter((card) =>
          query
            ? [card.name, card.description, card.cardType, ...card.tribes]
                .join(';')
                .toLowerCase()
                .includes(query)
            : true,
        )
        .sort(cardCompareFn),
    [faction, query],
  )

  return (
    <div className="flex flex-wrap gap-12 mt-8 mx-4 justify-center">
      {filteredCards.map((card) => {
        const count = deck.cards.find(({ id }) => id === card.id)?.count
        return (
          <Card
            card={card}
            key={card.id}
            onSelect={onSelectCard}
            onDeselect={onDeselectCard}
            count={count}
          />
        )
      })}
    </div>
  )
}
