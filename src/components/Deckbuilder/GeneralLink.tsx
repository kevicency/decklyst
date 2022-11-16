import type { CardData } from '@/data/cards'
import { encodeDeckcode } from '@/data/deckcode'
import cx from 'classnames'
import Link from 'next/link'
import { useMemo } from 'react'

export const GeneralLink = ({ general, className }: { general: CardData; className?: string }) => {
  const href = useMemo(() => {
    const deckcode = encodeDeckcode({ title: '', cards: { [general.id]: 1 } })
    return `/build/${deckcode}`
  }, [general.id])

  return (
    <Link
      href={href}
      className={cx(
        'mt-[-16px] mb-[-10px] ml-[-16px] w-32',
        'flex flex-shrink-0 flex-col items-center',
        `text-gray-300 hover:text-${general.faction}`,
        className,
      )}
    >
      <img
        src={`/assets/generals/${general.id}_hex.png`}
        srcSet={[
          `/assets/generals/${general.id}_hex.png 1x`,
          `/assets/generals/${general.id}_hex@2x.png 2x`,
        ].join(',')}
        alt={general.name}
      />
      <span className="flex-1 px-4 font-semibold">{general.name}</span>
    </Link>
  )
}
