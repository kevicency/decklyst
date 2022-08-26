import type { DeckExpanded } from '@/context/useDeck'
import { useDeck } from '@/context/useDeck'
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
const lineCardCounts = (deck: DeckExpanded) =>
  [
    `M: ${deck.counts.minions}`,
    `S: ${deck.counts.spells}`,
    `A: ${deck.counts.artifacts}`,
    `${deck.counts.total}/40`,
  ].join(' | ')
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
      <title>{`${deck.title} | Decklyst`}</title>
      <meta property="og:site_name" content="Decklyst" />
      <meta property="og:title" content={`${deck.title} | ${startCase(deck.faction)}`} />
      <meta
        property="og:description"
        content={[lineCardCounts(deck), lineAsciiManaCurve(deck)]
          .map((line) => `➤ ${line}`)
          .join('\n')}
      />
      <meta property="og:image" content={`/assets/generals/${deck.general?.id}_hex@2x.png`} />
    </Head>
  ) : (
    <Head>
      <title>{`Invalid Deckcode | Decklyst`}</title>
      <meta property="og:description" content={'Invalid deckcode.'} />
    </Head>
  )
}
