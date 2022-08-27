import { SidebarCardList } from '@/components/Deckbuilder/SidebarCardList'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { OneTimeButton } from '@/components/OneTimeButton'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import cx from 'classnames'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { IoIosShareAlt } from 'react-icons/io'
import { IoCopyOutline, IoTrashOutline } from 'react-icons/io5'
import { MdDone } from 'react-icons/md'

export const Sidebar: FC<{
  onReset: () => void
  onCopy: () => void
  onShare: () => void
}> = ({ onReset, onShare, onCopy }) => {
  const deck = useDeck()
  const [{ title, $encoded: encodedDeckcode }, { updateTitle }] = useDeckcode()

  return (
    <div className="flex flex-col shrink-0 gap-y-2 bg-slate-900 p-2 w-72 border-l border-zinc-700">
      <div className="flex gap-2">
        <input
          className="px-2 py-2 bg-slate-800 w-full"
          placeholder="Untitled"
          autoFocus
          value={title}
          onChange={(ev) => updateTitle(ev.target.value)}
        />

        <button className="flex bg-red-900 hover:bg-red-700 px-3 py-2 text-xl" onClick={onReset}>
          <IoTrashOutline />
        </button>
      </div>
      <div className="mx-auto mb-2 ">
        <DeckManaCurve />
      </div>
      {/*<div className="flex justify-around pl-2 -mr-1 mb-2">*/}
      {/*  {generals.map((general) => (*/}
      {/*    <GeneralCard*/}
      {/*      size="sm"*/}
      {/*      general={general}*/}
      {/*      onSelect={onSelectGeneral}*/}
      {/*      key={general.id}*/}
      {/*      className={cx(*/}
      {/*        'transition-al ',*/}
      {/*        general.id === deck.general.id ? `opacity-100 text-${deck.faction}` : 'opacity-60',*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}
      <div className="py-2 flex flex-1 overflow-y-hidden -mr-1.5">
        <div className="px-2 flex-1 overflow-y-scroll">
          <SidebarCardList cardType="Minion" />
          <SidebarCardList cardType="Spell" />
          <SidebarCardList cardType="Artifact" />
        </div>
      </div>
      <div className="flex justify-between items-center -mx-2 pl-2 pr-4 pt-4 pb-2 border-t border-slate-600">
        <span className={cx(`font-mono font-bold text-xl`)}>
          <span className={`text-${deck.faction}`}>{deck.counts.total}</span>/
          <span
            className={cx({
              'text-red-400': deck.counts.total > 40,
              [`text-${deck.faction}`]: deck.counts.total === 40,
            })}
          >
            40
          </span>
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
            <IoIosShareAlt />
            Share
          </a>
        </Link>
      </div>
    </div>
  )
}
