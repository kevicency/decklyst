import { useDeck } from './useDeck'
import { IconCardList } from './IconCardList'

export const DeckArtifactList = () => {
  const {
    cards: { artifacts },
  } = useDeck()
  return <IconCardList cards={artifacts} />
}
