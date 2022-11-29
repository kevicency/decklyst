import type { FC, ReactNode } from 'react'

export const DeckStat: FC<{ title: ReactNode; children: ReactNode }> = ({ children, title }) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-y-3 px-4">
      <div className="text-semibold flex items-center justify-between gap-x-2 text-lg font-semibold text-gray-300">
        <div className="h-0.5 w-4 bg-gray-600" />
        <span className="text-sm font-semibold uppercase text-gray-100">{title}</span>
        <div className="h-0.5 flex-1 bg-gray-600" />
      </div>
      {children}
    </div>
  )
}
