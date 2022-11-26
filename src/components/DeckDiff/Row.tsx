import cx from 'classnames'
import type { FC, ReactNode } from 'react'

export const Row: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cx('grid grid-cols-[minmax(0,1fr),10rem,minmax(0,1fr)]', className)}>
    {children}
  </div>
)
