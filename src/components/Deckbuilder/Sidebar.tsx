import type { CardHandler } from '@/components/Deckbuilder/CardList'
import { GeneralCard } from '@/components/Deckbuilder/GeneralCard'
import { SidebarCardList } from '@/components/Deckbuilder/SidebarCardList'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { OneTimeButton } from '@/components/OneTimeButton'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import { cards } from '@/data/cards'
import cx from 'classnames'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import { IoCopyOutline, IoShareOutline, IoTrashOutline } from 'react-icons/io5'
import { MdDone } from 'react-icons/md'

export const Sidebar: FC<{
  onSelectGeneral: CardHandler
  onReset: () => void
  onCopy: () => void
  onShare: () => void
}> = ({ onReset, onShare, onCopy, onSelectGeneral }) => {
  const deck = useDeck()
  const [{ title, $encoded: encodedDeckcode }, { updateTitle }] = useDeckcode()

  const generals = useMemo(
    () =>
      cards.filter(({ cardType, faction }) => faction === deck.faction && cardType === 'General'),
    [deck.faction],
  )

  return (
    <div className="flex flex-col shrink-0 gap-y-2 bg-slate-900 p-2">
      <div className="flex gap-2">
        <input
          className="px-2 py-2 bg-slate-800 w-full"
          placeholder="Untitled"
          value={title}
          onChange={(ev) => updateTitle(ev.target.value)}
        />

        <button className="flex bg-red-900 hover:bg-red-700 px-3 py-2 text-xl" onClick={onReset}>
          <IoTrashOutline />
        </button>
      </div>
      <div className="mx-auto">
        <DeckManaCurve />
      </div>
      <div className="flex justify-around pl-2 -mr-1 mb-2">
        {generals.map((general) => (
          <GeneralCard
            size="sm"
            general={general}
            onSelect={onSelectGeneral}
            key={general.id}
            className={cx(
              'transition-al ',
              general.id === deck.general.id ? `opacity-100 text-${deck.faction}` : 'opacity-60',
            )}
          />
        ))}
      </div>
      <div className="px-2 flex-1 overflow-y-scroll border-y border-slate-600">
        <SidebarCardList cardType="Minion" />
        <SidebarCardList cardType="Spell" />
        <SidebarCardList cardType="Artifact" />
      </div>
      <div className="flex justify-between items-center">
        <span className={cx(`font-mono font-bold text-xl`)}>
          <span className={deck.counts.total > 40 ? 'text-red-600' : `text-${deck.faction}`}>
            {deck.counts.total}
          </span>
          /40
        </span>
        <OneTimeButton onClick={onCopy} timeout={2500} className="w-24">
          {(copied) => (
            <>
              {copied ? <MdDone /> : <IoCopyOutline />}
              {copied ? 'Copied' : 'Copy'}
            </>
          )}
        </OneTimeButton>
        <Link href={{ pathname: '/[code]', query: { code: encodedDeckcode } }}>
          <a
            className={cx('btn px-3 py-1', deck.counts.total > 40 && 'btn--disabled')}
            onClick={onShare}
          >
            <IoShareOutline />
            Share
          </a>
        </Link>
      </div>
    </div>
  )
}
