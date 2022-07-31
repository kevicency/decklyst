import { DeckData } from '../lib/deckcode'
import { FC } from 'react'
import Head from 'next/head'
import { startCase } from 'lodash'

const lineAsciiManaCurve = (deck: DeckData) =>
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
const lineCardCounts = (deck: DeckData) =>
  [
    `M: ${deck.counts.minions}`,
    `S: ${deck.counts.spells}`,
    `A: ${deck.counts.artifacts}`,
    `${deck.counts.total}/40`,
  ].join(' | ')
const lineMinions = (deck: DeckData) =>
  'Minions: ' +
  deck.cards.minions.map((card) => `{${card.cost}} ${card.title} x ${card.count}`).join('; ')
const lineSpells = (deck: DeckData) =>
  'Spells: ' +
  deck.cards.spells.map((card) => `{${card.cost}} ${card.title} x ${card.count}`).join('; ')
const lineArtifacts = (deck: DeckData) =>
  'Artifacts: ' +
  deck.cards.artifacts.map((card) => `{${card.cost}} ${card.title} x ${card.count}`).join('; ')

export const DeckMetadata: FC<{ deck: DeckData | null }> = ({ deck }) =>
  deck ? (
    <Head>
      <title>{`${deck.title} | Duelyst Share`}</title>
      <meta property="og:site_name" content="Duelyst Share" />
      <meta property="og:title" content={`${deck.title} | ${startCase(deck.faction)}`} />
      <meta
        property="og:description"
        content={[
          lineCardCounts(deck) + ' | ' + lineAsciiManaCurve(deck),
          lineMinions(deck),
          lineSpells(deck),
          lineArtifacts(deck),
        ]
          .map((line) => `➤ ${line}`)
          .join('\n')}
      />
      <meta property="og:image" content={`/assets/generals/${deck.general.id}_hex@2x.png`} />
    </Head>
  ) : (
    <Head>
      <title>{`Invalid Deckcode | Duelyst Share`}</title>
      <meta property="og:description" content={'Invalid deckcode.'} />
    </Head>
  )
