import type { FC, ReactNode } from 'react'

export const Filter: FC<{ title: ReactNode; onClear: () => void; children: ReactNode }> = ({
  children,
  title,
  onClear,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-semibold flex items-center justify-between text-lg font-semibold text-gray-300">
        {title}
        <button
          onClick={onClear}
          className="text-sm font-normal text-gray-500 hover:text-accent-600"
        >
          clear
        </button>
      </div>
      {children}
    </div>
  )
}
