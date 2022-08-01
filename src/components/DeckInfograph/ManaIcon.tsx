import { FC } from 'react'

export const ManaIcon: FC<{ mana: number | string }> = ({ mana }) => (
  <div className="hexagon bg-mana text-slate-900 mt-1">
    <span className="inline-block w-6 text-center text-sm font-bold">{mana}</span>
  </div>
)
