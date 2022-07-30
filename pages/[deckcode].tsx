import { InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { GetServerSidePropsContext } from 'next/types'
import { DeckData, parseDeckcode, validateDeckcode } from '../lib/deckcode'
import Head from 'next/head'
import { startCase } from 'lodash'

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
)

const DeckPage: FC<Props> = ({ deckcode, deck, error }) => {
  return (
    <div className="w-[48rem] mx-auto py-8">
      {deck ? (
        <div className="pb-2" id="snap">
          <DeckHead deck={deck} />
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/generals/${deck.general.id}_hex@2x.png`}
              alt={deck.general.title}
              className="w-24 mt-[-12px]"
            />
            <h1 className="text-2xl">
              {deck.title} | {startCase(deck.faction)}
            </h1>
          </div>
          <p className="mt-2 px-4 whitespace-pre-line">
            {[
              lineCardCounts(deck) + ' | ' + lineAsciiManaCurve(deck),
              lineMinions(deck),
              lineSpells(deck),
              lineArtifacts(deck),
            ]
              .map((line) => `➤ ${line}`)
              .join('\n')}
          </p>
        </div>
      ) : (
        <div className="px-4 my-4">
          <Head>
            <title>{`Invalid Deckcode | Duelyst Share`}</title>
            <meta property="og:description" content={'Invalid deckcode.'} />
          </Head>
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      <div className="mt-2 px-4">
        <div className={'text-xl mb-1'}>Deckcode</div>
        <input
          readOnly={true}
          className={'w-full border-2 bg-slate-800 border-slate-600'}
          value={deckcode}
        />
      </div>
      {deck && (
        <div className="mt-2 px-4">
          <div className={'text-xl mb-1'}>Links</div>
          <a href={`/${deckcode}`} className="text-blue-500 hover:underline">
            Share
          </a>
          <br />
          <a href={`/${deckcode}.png`} className="text-blue-500 hover:underline">
            Image
          </a>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { deckcode } = context.query as { deckcode: string | undefined }
  const deck = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null
  const props = { deckcode, deck, error: deck === null ? 'Invalid deckcode' : null }

  return { props }
}

export default DeckPage
