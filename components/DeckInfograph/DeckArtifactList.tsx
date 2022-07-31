import { useDeck } from './useDeck'
import { SmallCardList } from './SmallCardList'

export const DeckArtifactList = () => {
  const {
    cards: { artifacts },
  } = useDeck()
  return <SmallCardList cards={artifacts} />
}
