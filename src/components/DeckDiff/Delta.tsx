import cx from 'classnames'
import type { FC } from 'react'

export const Delta: FC<{ value: number; big?: boolean }> = ({ value, big }) => (
  <div
    className={cx(big ? 'text-2xl' : 'text-xl', 'text-center font-mono', {
      'text-green-500': value > 0,
      'text-red-500': value < 0,
    })}
  >
    {value > 0 ? '+' : value < 0 ? '-' : ''}
    {Math.abs(value)}
  </div>
)
