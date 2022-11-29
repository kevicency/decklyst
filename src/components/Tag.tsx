import type { Faction } from '@/data/cards'
import { humanizeTag } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'
import { CloseIcon } from './Icons'

export const Tag: FC<{
  tag: string
  onDelete?: () => void
  size?: 'sm' | 'default'
  faction?: Faction
}> = ({ tag, onDelete, faction, size = 'default' }) => {
  const Container = onDelete ? 'button' : 'div'
  console.log(size)
  return (
    <Container
      onClick={onDelete}
      className={cx(
        `flex h-auto grow-0 items-center gap-x-1 rounded-lg py-0.5 px-2`,
        faction ? `bg-${faction} bg-opacity-75` : 'bg-accent-600',
        size === 'sm' ? 'text-sm' : 'text-base',
        onDelete && 'hover:scale-95',
      )}
    >
      <span className="font-semibold uppercase text-gray-100">{humanizeTag(tag)}</span>
      {onDelete && (
        <span className="text-gray-300">
          <CloseIcon size={12} />
        </span>
      )}
    </Container>
  )
}
