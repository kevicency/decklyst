import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import type { CardData } from '@/data/cards'
import { useSpriteQuery } from '@/hooks/useSpriteQuery'
import cx from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import colors from 'tailwindcss/colors'

export const CardItem: FC<{ card: CardData; count: number; delta: number; mirrored?: boolean }> = ({
  card,
  count,
  delta,
  mirrored,
}) => {
  const { data: sprite } = useSpriteQuery(card.id)
  const gradientColor = useMemo(() => {
    if (count === 0 || delta === 0) return `${colors.slate[900]}cc`
    // return `${delta * (mirrored ? 1 : -1) > 0 ? colors.green[900] : colors.red[900]}55`
    return `${colors.slate[600]}66`
  }, [count, delta])

  return (
    <div
      className={cx(
        'text-normal relative w-64 cursor-pointer select-none bg-alt-800 transition-transform',
        mirrored ? 'mr-8' : 'ml-8',
        count === 0 && 'opacity-40',
      )}
    >
      <div
        className="sprite absolute left-0 top-0 right-0.5 h-full"
        style={{
          backgroundImage: `url(${sprite?.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: '90px',
        }}
      />
      <div
        className="absolute left-0 top-0 h-full w-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 25%, ${gradientColor} 100%)`,
        }}
      />
      <div className="relative mb-1 flex w-full items-center py-1.5">
        <ManaIcon mana={card.mana} className="-ml-2.5 mr-1" />
        <div className="text-sm">{card.name}</div>
        <div className="flex-1" />
        <div
          className={`border border-alt-600 bg-alt-800 px-1 text-center font-mono font-bold text-alt-200`}
        >
          x{count}
        </div>
      </div>
    </div>
  )
}
