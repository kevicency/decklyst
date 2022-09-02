import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { DeckProvider, useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import cx from 'classnames'
import Link from 'next/link'
import type { FC } from 'react'

const DeckPreview: FC = () => {
  const { faction, deckcode } = useDeck()
  return (
    <Link href={deckUrl(deckcode, true)}>
      <a
        className={cx(
          'group',
          'flex gap-4 lg:gap-8 justify-between items-center',
          'bg-gray-900 py-2 pr-4 mt-4',
          'border-gray-700 border-[3px]',
          `hover:border-${faction} hover:text-black-100`,
        )}
        href={deckUrl(deckcode, true)}
      >
        <div className="scale-90 flex-1">
          <DeckTitle showMeta />
        </div>
        <DeckCounts />
        <DeckManaCurve />
      </a>
    </Link>
  )
}

export const DeckPreviewList: FC<{
  title?: string
  decks: DeckExpanded[]
  className?: string
}> = ({ title, decks, className }) => {
  if (!decks.length) return null

  return (
    <div className={cx(className)}>
      {title && <h3 className="text-3xl mb-6">{title}</h3>}
      <ul>
        {decks.map((deck) => (
          <li key={deck.deckcode}>
            <DeckProvider deck={deck}>
              <DeckPreview />
            </DeckProvider>
          </li>
        ))}
      </ul>
    </div>
  )
}
