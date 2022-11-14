import cx from 'classnames'
import type { FC } from 'react'

export const PivotButton: FC<{
  onClick: () => void
  active?: boolean
  activeClassName?: string
  children: any
}> = ({ onClick, active, activeClassName, children }) => (
  <button
    onClick={onClick}
    className={cx(
      'cursor-pointer font-light hover:text-accent-400',
      active ? activeClassName ?? 'text-gray-100' : 'text-gray-500',
    )}
  >
    {children}
  </button>
)
