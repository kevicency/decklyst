import { useDeck } from '@/context/useDeck'
import { IconCardList } from './IconCardList'

export const DeckSpellList = () => {
  const { spells } = useDeck()
  return <IconCardList cards={spells} />
}
