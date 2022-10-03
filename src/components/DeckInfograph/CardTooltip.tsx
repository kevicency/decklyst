import { Card } from '@/components/Deckbuilder/Card'
import { cardsById } from '@/data/cards'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ReactTooltip from 'react-tooltip'

export const CardTooltip = () => {
  const [renderTooltip, setRenderTooltip] = useState(false)

  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  return renderTooltip ? (
    <ReactTooltip
      id="card-tooltip"
      effect="solid"
      offset={{ top: 12, bottom: 12 }}
      getContent={(cardId) => <CardTooltipContent cardId={+cardId} />}
    />
  ) : null
}

const CardTooltipContent: FC<{ cardId: number }> = ({ cardId }) => {
  const card = cardsById[cardId]
  return card ? <Card card={card} className={`!border-${card.faction}`} /> : null
}
