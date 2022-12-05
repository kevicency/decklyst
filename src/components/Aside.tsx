import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

export const Aside: FC<{
  className?: string
  children?: ReactNode
  filters?: ReactNode | ReactNode[]
}> = ({ className, children, filters }) => {
  const [{ showFilters, isMobile }, { toggleFilters }] = useAppShell()

  useEffect(() => {
    if (!children && !showFilters) {
      toggleFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <aside className={cx(className, 'relative z-30 flex shrink-0 bg-alt-900 grid-in-aside')}>
      {showFilters && filters && (
        <div
          className={cx(
            'animate-in slide-in-from-right',
            'flex h-full flex-col bg-alt-900',
            children ? 'absolute left-0 top-0 2xl:relative 2xl:animate-none' : '',
            isMobile ? 'fixed right-0 z-50 min-w-fit' : '',
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-700 p-6">
            <h3 className="text-2xl">Filters</h3>
            <button onClick={toggleFilters}>X</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 ">{filters}</div>
        </div>
      )}
      {children}
    </aside>
  )
}
