import cx from 'classnames'
import type { FC } from 'react'

export const ManaIcon: FC<{ mana: number | string; className?: string }> = ({
  mana,
  className,
}) => (
  <div className={cx('hexagon bg-mana text-gray-900 font-bold', className)}>
    <span className="inline-block w-6 h-[22px] text-center text-sm">{mana}</span>
  </div>
)
