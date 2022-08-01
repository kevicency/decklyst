import { IconCardList } from './IconCardList'
import { useDeck } from './useDeck'

export const DeckSpellList = () => {
  const {
    cards: { spells },
  } = useDeck()
  return <IconCardList cards={spells} />
}
