import { useDeck } from '@/context/useDeck'
import type { FC } from 'react'
import { Tag } from '../Tag'

export const DeckTags: FC = () => {
  const { meta, faction } = useDeck()
  const tags = meta?.tags || []

  return tags ? (
    <div className="flex flex-wrap gap-2 ">
      {tags.map((tag) => (
        <Tag tag={tag} key={tag} size="sm" faction={faction} />
      ))}
    </div>
  ) : null
}
