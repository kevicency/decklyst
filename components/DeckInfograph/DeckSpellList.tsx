import { useDeck } from './useDeck'
import { SmallCardList } from './SmallCardList'

export const DeckSpellList = () => {
  const {
    cards: { spells },
  } = useDeck()
  return <SmallCardList cards={spells} />
}
