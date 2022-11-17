import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

export const Aside: FC<{
  className?: string
  children?: ReactNode
  filters?: ReactNode | ReactNode[]
}> = ({ className, children, filters }) => {
  const [{ showFilters }, { toggleFilters }] = useAppShell()

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
            'absolute left-0 top-0 z-30 flex h-full flex-col gap-y-4 bg-alt-900 p-4',
            '2xl:relative 2xl:animate-none',
          )}
        >
          <div className="-mx-4 flex items-center justify-between border-b border-gray-700 px-4 pt-2 pb-6">
            <h3 className="text-2xl">Filters</h3>
            <button onClick={toggleFilters}>X</button>
          </div>
          {filters}
        </div>
      )}
      {children}
    </aside>
  )
}
