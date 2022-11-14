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
      'cursor-pointer font-light hover:text-teal-400',
      active ? activeClassName ?? 'text-neutral-100' : 'text-neutral-500',
    )}
  >
    {children}
  </button>
)
