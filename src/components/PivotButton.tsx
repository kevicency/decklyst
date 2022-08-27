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
      'hover:text-teal-400 cursor-pointer font-light',
      active ? activeClassName ?? 'text-zinc-100' : 'text-zinc-500',
    )}
  >
    {children}
  </button>
)
