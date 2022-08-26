import type { CardData } from '@/data/cards'
import { useSpriteQuery } from '@/queries/useSpriteQuery'
import cx from 'classnames'
import type { FC } from 'react'

export const CardSprite: FC<{
  card: CardData
  animated?: boolean
  centered?: boolean
  scale?: number
  className?: string
}> = ({ card, animated, centered, scale, className }) => {
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
      }}
    ></img>
  )
}
