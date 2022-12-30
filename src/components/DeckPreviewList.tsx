import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { DeckProvider, useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { Privacy } from '@prisma/client'
import cx from 'classnames'
import { startCase } from 'lodash'
import Link from 'next/link'
import type { FC } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { DeckTags } from './DeckInfograph/DeckTags'
import { EyeIcon, TrashIcon } from './Icons'
import { ProfileLink } from './ProfileLink'
import { TimeAgo } from './TimeAgo'

export const DeckPreview: FC<{
  type: 'card' | 'list'
  onChangePrivacy?: (privacy: Privacy) => Promise<void>
  onDelete?: () => void | Promise<void>
}> = ({ type, onChangePrivacy, onDelete }) => {
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
      <div
        className={cx('flex w-full items-center justify-between gap-4 lg:gap-8', 'pt-2 pb-4 pr-4')}
      >
        <div className="flex-1 scale-90 ">
          <DeckTitle />
        </div>
        {type === 'list' && (
          <>
            <DeckCounts />
            <DeckManaCurve />
          </>
        )}
      </div>
      {meta?.tags && (
        <div className="flex-1 justify-end px-2 pb-2">
          <DeckTags />
        </div>
      )}
      <Link href={deckUrl(meta?.sharecode ?? deckcode, true)} className="cover-parent" />
      <div
        className={`relative flex flex-wrap items-center gap-0.5 border-t-2 border-gray-800 bg-alt-850 px-2.5 py-1 text-gray-400`}
      >
        <div>
          <span>by </span>
          <ProfileLink user={meta?.author} />
        </div>
        {meta?.createdAt && (
          <>
            <div className={`flex-1 px-0.5 text-center text-lg font-bold text-gray-600`}>•</div>
            <div>
              <span>submitted </span>
              <span className="font-semibold text-gray-300">
                <TimeAgo date={meta.createdAt} />
              </span>
            </div>
          </>
        )}
        <div className={`flex-1 px-0.5 text-center text-lg font-bold text-gray-600`}>•</div>
        <div className="flex flex-wrap items-center gap-4">
          <span className={`-mr-3 font-semibold text-gray-300`}>
            <EyeIcon size={18} className="mr-1 inline-block pb-0.5" />
            {meta?.views ?? 1}
          </span>
          <span>{(meta?.views ?? 1) === 1 ? 'view' : 'views'}</span>
          {onChangePrivacy && (
            <select
              className="cursor-pointer bg-alt-1000 py-1.5 text-gray-300"
              value={meta?.privacy}
              onChange={(e) => onChangePrivacy(e.target.value as Privacy)}
            >
              {Object.values(Privacy).map((privacy) => (
                <option key={privacy} value={privacy}>
                  {startCase(privacy)}
                </option>
              ))}
            </select>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="btn-outline border-danger text-danger hover:bg-danger hover:text-gray-100"
            >
              <TrashIcon />
              Delete
            </button>
          )}
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
  const { width } = useWindowSize()
  if (!decks.length) return null

  return (
    <div className={cx(className, 'pb-2')}>
      {title && <h3 className="mb-6 text-3xl">{title}</h3>}
      <ul className="flex flex-col gap-y-4">
        {decks.map((deck) => (
          <li key={deck.meta?.id ?? deck.deckcode}>
            <DeckProvider deck={deck}>
              <DeckPreview type={width <= 768 ? 'card' : 'list'} />
            </DeckProvider>
          </li>
        ))}
      </ul>
    </div>
  )
}
