import { CardOccurence } from '@/common/deckcode'
import { IconSpriteData } from '@/common/sprite'
import axios from 'axios'
import cx from 'classnames'
import { FC } from 'react'
import { useQuery } from 'react-query'

export const IconCardList: FC<{ cards: CardOccurence[] }> = ({ cards }) => {
  return (
    <div
      className={cx('bg-slate-800 grid', cards.length && 'h-24 mt-6')}
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <IconCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const IconCard: FC<{ card: CardOccurence }> = ({ card }) => (
  <div className="flex flex-col w-16">
    <div className="flex flex-1 relative">
      {card.spriteName && <IconCardSprite spriteName={card.spriteName} />}
    </div>
    <div className="text-center py-0.5 bg-slate-700">{card.count}</div>
  </div>
)

const IconCardSprite: FC<{ spriteName: string }> = ({ spriteName }) => {
  const spriteSheetUrl = `https://alpha.duelyst2.com/resources/icons/${spriteName}.png`
  // const spriteSheetUrl = `/assets/spritesheets/${spriteName}.png`
  const spriteDataUrl = `/assets/spritesheets/icons/${spriteName.replace('d2_', '')}.plist.json`

  const { data, isSuccess } = useQuery<IconSpriteData>(['sprite-data', spriteName], async () =>
    axios.get(spriteDataUrl).then((res) => res.data),
  )

  const width = data?.frameWidth ?? 0
  const height = data?.frameHeight ?? 0
  const { x, y } = data?.lists?.inactive[0] ?? { x: 0, y: 0 }

  return (
    <div
      className="sprite scale-150 absolute bottom-2.5 left-1/2"
      style={{
        visibility: isSuccess ? 'visible' : 'hidden',
        backgroundImage: `url(${spriteSheetUrl})`,
        backgroundSize: 'auto auto',
        backgroundRepeat: 'no-repeat',
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `${-width / 2}px`,
        marginTop: `${-height / 2}px`,
        backgroundPosition: `-${x}px -${y}px`,
      }}
    ></div>
  )
}
