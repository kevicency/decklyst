import cx from 'classnames'
import type { FC, ReactNode } from 'react'

export const PageHeader: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className={cx(
        'flex items-end justify-between gap-x-8',
        'h-20 pb-4 pt-6 px-8',
        ' bg-gray-800 shadow-lg shadow-dark z-50',
      )}
    >
      {children}
    </div>
  )
}
