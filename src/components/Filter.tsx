import type { FC, ReactNode } from 'react'

export const Filter: FC<{ title: ReactNode; onClear: () => void; children: ReactNode }> = ({
  children,
  title,
  onClear,
}) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="text-semibold flex items-center justify-between gap-x-2 text-lg font-semibold text-gray-300">
        <div className="h-0.5 w-4 bg-gray-600" />
        {title}
        <div className="h-0.5 flex-1 bg-gray-600" />
        <button
          onClick={onClear}
          className="text-sm font-normal text-gray-400 hover:text-accent-600"
        >
          clear
        </button>
      </div>
      {children}
    </div>
  )
}
