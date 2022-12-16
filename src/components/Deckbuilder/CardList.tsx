import { Card } from '@/components/Deckbuilder/Card'
import { useCardFilters } from '@/context/useCardFilters'
import { useDeck } from '@/context/useDeck'
import type { CardData } from '@/data/cards'
import { cardCompareFn, cards } from '@/data/cards'
import type { FC } from 'react'
import { useMemo } from 'react'

export type CardHandler = (card: CardData, all?: boolean) => void

export const CardList: FC<{
  onSelectCard: CardHandler
  onDeselectCard: CardHandler
}> = ({ onSelectCard, onDeselectCard }) => {
  const deck = useDeck()
  const [{ faction, query, mana, rarity, cardType, keyword }] = useCardFilters()
  const keywordRegex = useMemo(() => (keyword ? new RegExp(keyword, 'i') : null), [keyword])
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => card.cardType !== 'General' && card.rarity !== 'token')
        .filter((card) => (faction ? card.faction === faction : true))
        .filter((card) =>
          mana?.length ? mana.includes(card.mana) || (mana.includes(9) && card.mana > 9) : true,
        )
        .filter((card) => (rarity?.length ? rarity.includes(card.rarity) : true))
        .filter((card) => (cardType?.length ? cardType.includes(card.cardType) : true))
        .filter((card) => keywordRegex?.test(card.description) ?? true)
        .filter((card) =>
          query
            ? [card.name, card.description, card.cardType, ...card.tribes]
                .join(';')
                .toLowerCase()
                .includes(query)
            : true,
        )
        .sort(cardCompareFn),
    [faction, mana, rarity, cardType, keywordRegex, query],
  )

  return (
    <div className="mx-4 mt-8 flex flex-wrap justify-center gap-12">
      {filteredCards.map((card) => {
        const count = deck.cards.find(({ id }) => id === card.id)?.count ?? 0
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
