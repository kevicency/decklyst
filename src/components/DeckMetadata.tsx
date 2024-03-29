import { deckImageUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { startCase } from 'lodash'
import Head from 'next/head'
import type { FC } from 'react'

const lineAsciiManaCurve = (deck: DeckExpanded) =>
  deck.manaCurve
    .map(({ rel }) => {
      if (rel === 1) return '█'
      if (rel >= 0.82) return '▇'
      if (rel >= 0.66) return '▆'
      if (rel >= 0.5) return '▅'
      if (rel >= 0.32) return '▄'
      if (rel >= 0.16) return '▃'
      if (rel > 0) return '▂'

      return '▁'
    })
    .join(' ')
// const lineCardCounts = (deck: DeckExpanded) =>
//   [
//     `M: ${deck.counts.minions}`,
//     `S: ${deck.counts.spells}`,
//     `A: ${deck.counts.artifacts}`,
//     `${deck.counts.total}/40`,
//   ].join(' | ')
const lineCardCountsAlt = (deck: DeckExpanded) => [
  `Minions: ${deck.counts.minions}`,
  `Spells: ${deck.counts.spells}`,
  `Artifacts: ${deck.counts.artifacts}`,
  `Total: ${deck.counts.total}/40`,
]
// const lineMinions = (deck: DeckExpanded) =>
//   'Minions: ' + deck.minions.map((card) => `{${card.mana}} ${card.name} x ${card.count}`).join('; ')
// const lineSpells = (deck: DeckExpanded) =>
//   'Spells: ' + deck.spells.map((card) => `{${card.mana}} ${card.name} x ${card.count}`).join('; ')
// const lineArtifacts = (deck: DeckExpanded) =>
//   'Artifacts: ' +
//   deck.artifacts.map((card) => `{${card.mana}} ${card.name} x ${card.count}`).join('; ')

export const DeckMetadata: FC = () => {
  const deck = useDeck()

  return deck.deckcode ? (
    <Head>
      <title>{`${deck.title || 'Untitled'} | Decklyst`}</title>
      <meta property="og:title" content={`${deck.title} | ${startCase(deck.faction)}`} />
      <meta
        property="og:description"
        content={[lineAsciiManaCurve(deck), ...lineCardCountsAlt(deck)]
          .map((line) => `➤ ${line}`)
          .join('\n')}
      />
      <meta property="og:image" content={deckImageUrl(deck.deckcode)} />
    </Head>
  ) : (
    <Head>
      <title>{`Deckbuilder | Decklyst`}</title>
      <meta property="og:site_name" content="Decklyst" />
      <meta property="og:title" content="Deckbuilder" />
      <meta property="og:description" content="Deckbuiler for Duelyst 2" />
    </Head>
  )
}
