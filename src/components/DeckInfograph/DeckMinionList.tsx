import { useDeck } from '@/context/useDeck'
import type { CardEntry } from '@/data/deck'
import type { UnitSpriteData } from '@/data/sprite'
import type { FC } from 'react'
import { useQuery } from 'react-query'

export const DeckMinionList = () => {
  const { minions } = useDeck()
  const columnCount = Math.max(10, minions.length)

  return (
    <div
      className="bg-slate-800 h-32 grid"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {minions.map((card) => (
        <MinionCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const MinionCard: FC<{ card: CardEntry }> = ({ card }) => (
  <div className="flex flex-col">
    <div className="flex flex-1 relative">
      {card.spriteName && <MinionCardSprite spriteName={card.spriteName} />}
    </div>
    <div className="text-center py-1 bg-slate-700">{card.count}</div>
  </div>
)

const MinionCardSprite: FC<{ spriteName: string }> = ({ spriteName }) => {
  const spriteSheetUrl = `https://alpha.duelyst2.com/resources/units/${spriteName}.png`
  // const spriteSheetUrl = `/assets/spritesheets/units/${spriteName}.png`
  const spriteDataUrl = `/assets/spritesheets/units/${spriteName}.plist.json`

  const { data, isSuccess } = useQuery<UnitSpriteData>(['sprite-data', spriteName], async () =>
    fetch(spriteDataUrl).then((res) => res.json()),
  )

  const width = data?.frameWidth ?? 0
  const height = data?.frameHeight ?? 0
  const { x, y } = data?.lists?.idle[0] ?? { x: 0, y: 0 }

  return (
    <div
      className="sprite scale-150 absolute bottom-1 left-1/2"
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
