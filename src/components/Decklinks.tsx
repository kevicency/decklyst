import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { DeckProvider, useDeck } from '@/context/useDeck'
import type { Deck } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'

const Decklink: FC = () => {
  const { faction, deckcode } = useDeck()
  return (
    <a
      className={cx(
        'flex flex-wrap gap-4 lg:gap-8 justify-between items-center',
        'bg-slate-900 py-2 pr-4 mt-4',
        'border-slate-700 border-[3px]',
        `hover:border-${faction}`,
      )}
      href={deckUrl(deckcode, true)}
    >
      <div className="scale-90 flex-1">
        <DeckTitle />
      </div>
      <DeckCounts />
      <DeckManaCurve />
    </a>
  )
}

export const Decklinks: FC<{
  title?: string
  decks: { deck: Deck; viewCount: number }[]
  className?: string
}> = ({ title, decks, className }) => {
  if (!decks.length) return null

  return (
    <div className={cx(className)}>
      {title && <h3 className="text-3xl mb-6">{title}</h3>}
      <ul>
        {decks.map(({ deck, viewCount }) => (
          <li key={deck.deckcode}>
            <DeckProvider deck={deck} meta={{ viewCount }}>
              <Decklink />
            </DeckProvider>
          </li>
        ))}
      </ul>
    </div>
  )
}
