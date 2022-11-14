import cx from 'classnames'
import type { FC, ReactNode } from 'react'

export const PageHeader: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className={cx(
        'flex items-end justify-between gap-x-8',
        'h-20 px-8 pb-4 pt-6',
        ' z-50 bg-alt-800 shadow-lg shadow-dark',
      )}
    >
      {children}
    </div>
  )
}
