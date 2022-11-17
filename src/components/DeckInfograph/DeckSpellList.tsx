import { useDeck } from '@/context/useDeck'
import type { FC } from 'react'
import { IconCardList } from './IconCardList'
import type { Variant } from './variant'

export const DeckSpellList: FC<{ variant?: Variant }> = ({ variant = 'infograph' }) => {
  const { spells } = useDeck()
  return <IconCardList cards={spells} variant={variant} />
}
