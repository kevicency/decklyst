import { useDeck } from './useDeck'
import { IconCardList } from './IconCardList'

export const DeckSpellList = () => {
  const {
    cards: { spells },
  } = useDeck()
  return <IconCardList cards={spells} />
}
