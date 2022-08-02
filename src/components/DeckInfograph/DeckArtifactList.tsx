import { IconCardList } from './IconCardList'
import { useDeck } from './useDeck'

export const DeckArtifactList = () => {
  const {
    cards: { artifacts },
  } = useDeck()
  return <IconCardList cards={artifacts} />
}
