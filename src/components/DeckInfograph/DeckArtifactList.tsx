import { useDeck } from '@/context/useDeck'
import { IconCardList } from './IconCardList'

export const DeckArtifactList = () => {
  const { artifacts } = useDeck()
  return <IconCardList cards={artifacts} />
}
