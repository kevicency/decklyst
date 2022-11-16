import cx from 'classnames'
import type { FC, ReactNode } from 'react'
import { useContext, useEffect } from 'react'
import { AppContext } from './AppShell'

export const Aside: FC<{
  className?: string
  children?: ReactNode
  filters?: ReactNode | ReactNode[]
}> = ({ className, children, filters }) => {
  const [{ showFilters }, { toggleFilters }] = useContext(AppContext)

  useEffect(() => {
    if (!children && !showFilters) {
      toggleFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cx(className, 'relative z-30 flex shrink-0 bg-alt-900 grid-in-aside')}>
      {showFilters && filters && (
        <div
          className={cx(
            'animate-in slide-in-from-right',
            'absolute left-0 top-0 z-30 flex h-full flex-col gap-y-4 bg-alt-900 p-4',
            '2xl:relative 2xl:animate-none',
          )}
        >
          <div className="flex items-center justify-between pt-2 pb-5">
            <h3 className="text-2xl">Filters</h3>
            <button onClick={toggleFilters}>X</button>
          </div>
          {filters}
        </div>
      )}
      {children}
    </div>
  )
}
