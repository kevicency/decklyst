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
    <Link
      href={deckUrl(deckcode, true)}
      className={cx(
        'group',
        'flex items-center justify-between gap-4 lg:gap-8',
        'mt-4 bg-alt-900 py-2 pr-4',
        'border-[3px] border-alt-700',
        `hover:border-${faction} hover:text-neutral-100`,
      )}
    >
      <div className="flex-1 scale-90">
        <DeckTitle showMeta />
      </div>
      <DeckCounts />
      <DeckManaCurve />
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
      {title && <h3 className="mb-6 text-3xl">{title}</h3>}
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
