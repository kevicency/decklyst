import { Card } from '@/components/Deckbuilder/Card'
import { cardsById } from '@/data/cards'
import type { FC } from 'react'
import ReactTooltip from 'react-tooltip'

export const CardTooltip = () => (
  <ReactTooltip
    id="card-tooltip"
    effect="solid"
    offset={{ top: 12, bottom: 12 }}
    getContent={(cardId) => <CardTooltipContent cardId={+cardId} />}
  />
)
const CardTooltipContent: FC<{ cardId: number }> = ({ cardId }) => {
  const card = cardsById[cardId]
  return card ? <Card card={card} className={`!border-${card.faction}`} /> : null
}
