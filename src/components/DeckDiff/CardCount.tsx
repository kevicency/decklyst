import type { Faction } from '@/data/cards'
import cx from 'classnames'
import type { FC } from 'react'

export const CardCount: FC<{
  title?: string
  count: number
  mirrored?: boolean
  faction?: Faction
}> = ({ title, count, mirrored, faction }) => (
  <div className={cx('flex gap-x-2 text-2xl', !mirrored && 'flex-row-reverse')}>
    <span className={cx('font-mono', faction ? `text-${faction}` : `text-accent-600`)}>
      {count}
    </span>
    <span>{title}</span>
  </div>
)
