import cx from 'classnames'
import type { FC } from 'react'

export const ManaIcon: FC<{ mana: number | string; className?: string }> = ({
  mana,
  className,
}) => (
  <div className={cx('hexagon bg-mana font-bold text-alt-900', className)}>
    <span className="inline-block h-[22px] w-6 text-center text-sm">{mana}</span>
  </div>
)
