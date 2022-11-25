import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { DeckProvider, useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import cx from 'classnames'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import type { FC } from 'react'
import { EyeIcon } from './Icons'

const DeckPreview: FC = () => {
  const { faction, deckcode, meta } = useDeck()
  return (
    <Link
      href={deckUrl(deckcode, true)}
      className={cx(
        'group',
        'flex flex-col',
        'border-[3px] border-alt-700',
        `hover:border-${faction} hover:text-gray-100`,
      )}
    >
      <div
        className={cx(
          'flex items-center justify-between gap-4 lg:gap-8',
          'bg-alt-900 pt-2 pb-4 pr-4',
        )}
      >
        <div className="flex-1 scale-90">
          <DeckTitle />
        </div>
        <DeckCounts />
        <DeckManaCurve />
      </div>
      <div
        className={`flex items-center gap-x-3 border-t-2 border-gray-800 bg-alt-850 px-4 py-1 text-sm text-gray-400`}
      >
        <div>
          <span>created by </span>
          <span className="font-semibold text-gray-300">Anonymous</span>
        </div>
        {meta?.createdAt && (
          <>
            <div className={`text-lg font-bold text-gray-600`}>•</div>
            <div>
              <span>submitted </span>
              <span className="font-semibold text-gray-300">
                {formatDistance(meta?.createdAt!, new Date(), { addSuffix: true })}
              </span>
            </div>
          </>
        )}
        <div className="flex-1" />
        {meta?.viewCount && (
          <>
            <div className="flex items-center gap-x-1">
              <span className={`font-semibold text-gray-300`}>
                <EyeIcon size={14} className="mx-1 inline-block pb-0.5" />
                {meta.viewCount}
              </span>
              <span>{meta.viewCount === 1 ? 'view' : 'views'}</span>
            </div>
          </>
        )}
      </div>
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
      <ul className="flex flex-col gap-y-4">
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
