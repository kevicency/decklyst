import type { CardData } from '@/data/cards'
import { useSpriteQuery } from '@/queries/useSpriteQuery'
import cx from 'classnames'
import type { FC } from 'react'

export const CardSprite: FC<{ card: CardData }> = ({ card }) => {
  const { data, isSuccess } = useSpriteQuery(card.id)
  const { width, height, src } = data ?? { width: 0, height: 0, src: '' }

  return (
    <div
      className={cx(
        'sprite scale-150 absolute left-1/2',
        card.cardType === 'Minion' ? 'bottom-2.5' : 'bottom-4',
      )}
      style={{
        visibility: isSuccess ? 'visible' : 'hidden',
        backgroundImage: src ? `url(${src})` : 'none',
        backgroundSize: 'auto auto',
        backgroundRepeat: 'no-repeat',
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `${-width / 2}px`,
        marginTop: `${-height / 2}px`,
      }}
    ></div>
  )
}
