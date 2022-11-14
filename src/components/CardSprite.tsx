import type { CardData } from '@/data/cards'
import { useSpriteQuery } from '@/hooks/useSpriteQuery'
import cx from 'classnames'
import type { CSSProperties, FC } from 'react'

export const CardSprite: FC<{
  card: CardData
  animated?: boolean
  centered?: boolean
  scale?: number
  className?: string
  style?: (size: { width: number; height: number }) => CSSProperties
}> = ({ card, animated, centered, scale, className, style }) => {
  const { data, isSuccess } = useSpriteQuery(card.id, animated)

  const src = data?.src
  const width = (data?.width ?? 0) * (scale ?? 1)
  const height = (data?.height ?? 0) * (scale ?? 1)

  const margins = centered
    ? {
        marginTop: `${-height / 2}px`,
        marginLeft: `${-width / 2}px`,
      }
    : {}

  return (
    <img
      alt={card.name}
      src={src}
      className={cx('sprite', className)}
      style={{
        visibility: isSuccess ? 'visible' : 'hidden',
        width: `${width}px`,
        height: `${height}px`,
        ...margins,
        ...style?.({ width, height }),
      }}
    ></img>
  )
}
