import { InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { GetServerSidePropsContext } from 'next/types'
import { DeckData, parseDeckcode, validateDeckcode } from '../lib/deckcode'
import Head from 'next/head'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

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
    `M: ${deck.cards.minions.length}`,
    `S: ${deck.cards.spells.length}`,
    `A: ${deck.cards.artifacts.length}`,
    `${deck.size}/40`,
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

const DeckHead: FC<{ deck: DeckData }> = ({ deck }) => (
  <Head>
    <title>{deck.title} | Duelyst Share</title>
    <meta property="og:title" content={deck.title} />
    <meta
      property="og:description"
      content={[
        lineCardCounts(deck) + ' ' + lineAsciiManaCurve(deck),
        lineMinions(deck),
        lineSpells(deck),
        lineArtifacts(deck),
      ]
        .map((line) => `➤ ${line}`)
        .join('\n')}
    />
    <meta property="og:image" content={`/assets/generals/${deck.general.id}_hex@2x.png`} />
  </Head>
)

const DeckcodePage: FC<Props> = ({ deckcode, deck, error }) => {
  return deck ? (
    <div>
      <DeckHead deck={deck} />
      <code style={{ whiteSpace: 'break-spaces' }}>{JSON.stringify(deck, null, 2)}</code>
      <p>Deckcode: {deckcode}</p>
    </div>
  ) : (
    <div>
      <p>Error: {error}</p>
      <p>Deckcode: {deckcode}</p>
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { deckcode } = context.query as { deckcode: string | undefined }
  const deck = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null
  const props = { deckcode, deck, error: deck === null ? 'Invalid deckcode' : null }

  return { props }
}

export default DeckcodePage
