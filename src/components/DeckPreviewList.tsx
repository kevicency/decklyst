import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { DeckProvider, useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import cx from 'classnames'
import Link from 'next/link'
import type { FC } from 'react'
import { DeckTags } from './DeckInfograph/DeckTags'
import { EyeIcon } from './Icons'
import { ProfileLink } from './ProfileLink'
import { TimeAgo } from './TimeAgo'

const DeckPreview: FC = () => {
  const { faction, deckcode, meta } = useDeck()
  return (
    <div
      className={cx(
        'group',
        'relative flex flex-col bg-alt-900',
        'border-[3px] border-alt-700',
        `hover:border-${faction}  hover:scale-101 hover:text-gray-100`,
      )}
    >
      <div className={cx('flex items-center justify-between gap-4 lg:gap-8', 'pt-2 pb-4 pr-4')}>
        <div className="flex-1 scale-90">
          <DeckTitle />
        </div>
        <DeckCounts />
        <DeckManaCurve />
      </div>
      <div className="px-2 pb-2">
        <DeckTags />
      </div>
      <Link href={deckUrl(meta?.sharecode ?? deckcode, true)} className="cover-parent" />
      <div
        className={`relative flex items-center gap-x-3 border-t-2 border-gray-800 bg-alt-850 px-2.5 py-1 text-gray-400`}
      >
        <div>
          <span>created by </span>
          <ProfileLink user={meta?.author} />
        </div>
        {meta?.createdAt && (
          <>
            <div className={`text-lg font-bold text-gray-600`}>•</div>
            <div>
              <span>submitted </span>
              <span className="font-semibold text-gray-300">
                <TimeAgo date={meta.createdAt} />
              </span>
            </div>
          </>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-x-1">
          <span className={`font-semibold text-gray-300`}>
            <EyeIcon size={18} className="mx-1 inline-block pb-0.5" />
            {meta?.views ?? 1}
          </span>
          <span>{(meta?.views ?? 1) === 1 ? 'view' : 'views'}</span>
        </div>
      </div>
    </div>
  )
}

export const DeckPreviewList: FC<{
  title?: string
  decks: DeckExpanded[]
  className?: string
}> = ({ title, decks, className }) => {
  if (!decks.length) return null

  return (
    <div className={cx(className, 'pb-2')}>
      {title && <h3 className="mb-6 text-3xl">{title}</h3>}
      <ul className="flex flex-col gap-y-4">
        {decks.map((deck) => (
          <li key={deck.meta?.id ?? deck.deckcode}>
            <DeckProvider deck={deck}>
              <DeckPreview />
            </DeckProvider>
          </li>
        ))}
      </ul>
    </div>
  )
}
