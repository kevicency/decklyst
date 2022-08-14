import { deckUrl } from '@/common/urls'
import { DeckCounts } from '@/components/DeckInfograph/DeckCounts'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import type { Deck } from '@/components/DeckInfograph/useDeck'
import { DeckContext } from '@/components/DeckInfograph/useDeck'
import cx from 'classnames'
import type { FC } from 'react'

const RecentDeck: FC<{ deck: Deck }> = ({ deck }) => (
  <DeckContext.Provider value={deck}>
    <a
      className={cx(
        'flex flex-wrap gap-4 lg:gap-8 justify-between',
        'bg-slate-900 py-2 pr-4 mt-4',
        'border-slate-700 border-[3px]',
        `hover:border-${deck.faction}`,
      )}
      href={deckUrl(deck.sharecode ?? deck.deckcode, true)}
    >
      <div className="scale-90 flex-1">
        <DeckTitle />
      </div>
      <DeckCounts />
      <DeckManaCurve />
    </a>
  </DeckContext.Provider>
)

export const RecentDecks: FC<{ decks: Deck[]; className?: string }> = ({ decks, className }) => {
  if (!decks.length) return null

  return (
    <div className={cx(className)}>
      <h3 className="text-3xl mb-6">Recent Decks</h3>
      <ul>
        {decks.map((deck) => (
          <li key={deck.sharecode}>
            <RecentDeck deck={deck} />
          </li>
        ))}
      </ul>
    </div>
  )
}
