import type { FC } from 'react'

export const NumberSliderInput: FC<{
  value: number
  onChange: (value: number) => void
  onEnd: (value: number) => void
  label?: string
  min?: number
  max?: number
}> = ({ label, min = 0, max = 100, value, onChange, onEnd }) => {
  const input = (
    <input
      type="range"
      min={String(min)}
      max={String(max)}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      onTouchEnd={(e) => onEnd(value)}
      onMouseUp={(e) => onEnd(value)}
      className="inline-block h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-600 accent-accent-500"
    />
  )
  return label ? (
    <label className="font-medium text-gray-100">
      {label}
      {input}
    </label>
  ) : (
    input
  )
}
