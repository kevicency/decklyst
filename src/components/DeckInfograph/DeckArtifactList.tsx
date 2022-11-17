import { useDeck } from '@/context/useDeck'
import type { FC } from 'react'
import { IconCardList } from './IconCardList'
import type { Variant } from './variant'

export const DeckArtifactList: FC<{ variant?: Variant }> = ({ variant = 'infograph' }) => {
  const { artifacts } = useDeck()
  return <IconCardList cards={artifacts} variant={variant} />
}
