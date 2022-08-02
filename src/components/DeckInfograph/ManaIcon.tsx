import cx from 'classnames'
import { FC } from 'react'

export const ManaIcon: FC<{ mana: number | string; className?: string }> = ({
  mana,
  className,
}) => (
  <div className={cx('hexagon bg-mana text-slate-900', className)}>
    <span className="inline-block w-6 text-center text-sm font-bold">{mana}</span>
  </div>
)