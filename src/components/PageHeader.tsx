import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import type { FC, ReactNode } from 'react'
import { FilterIcon } from './Icons'

export const PageHeader: FC<{
  children: ReactNode
  showFilterToggle?: boolean
  className?: string
}> = ({ children, className, showFilterToggle }) => {
  const [, { toggleFilters }] = useAppShell()
  return (
    <div
      className={cx(
        className,
        'relative flex shrink-0 items-end justify-between gap-x-8',
        'h-16 px-4 pb-3 lg:h-20 lg:px-8 lg:pb-4',
        'z-20 bg-gradient-to-r from-gray-850 to-alt-900 shadow-header',
        { 'pr-20': showFilterToggle },
      )}
    >
      {children}
      {showFilterToggle && (
        <button
          className="absolute right-4 top-1/2 z-50 -mt-6 flex bg-transparent px-3 py-3 text-2xl text-accent-200 transition-colors hover:bg-accent-700 hover:text-gray-100"
          onClick={toggleFilters}
          aria-label="Filters"
        >
          <FilterIcon />
        </button>
      )}
    </div>
  )
}
