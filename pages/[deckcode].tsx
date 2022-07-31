import { InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { GetServerSidePropsContext } from 'next/types'
import { parseDeckcode, validateDeckcode } from '../lib/deckcode'
import { DeckInfograph } from '../components/DeckInfograph'
import { DeckMetadata } from '../components/DeckMetadata'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const DeckPage: FC<Props> = ({ deckcode, deck, error }) => {
  const copyDeckcode = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(deckcode)
    }
  }
  const copyImageUrl = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(`${window.location.origin}/${deckcode}.png`)
    }
  }

  return (
    <div className="content-container">
      <DeckMetadata deck={deck} />
      {deck ? (
        <div className="p-6 bg-slate-900" id="snap">
          <DeckInfograph deck={deck} />
        </div>
      ) : (
        <div className="px-4 my-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      {deck && (
        <div className="mt-4 grid grid-cols-3 auto-cols-auto gap-4">
          <button
            className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
            onClick={copyDeckcode}
          >
            Copy deckcode
          </button>
          <button
            className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
            onClick={copyImageUrl}
          >
            Copy image link
          </button>
          <a
            className="bg-slate-600 hover:bg-blue-600 text-white font-bold px-6 py-4 text-xl text-center"
            href={`/${deckcode}.png`}
            download={`${deckcode}.png`}
          >
            Download as image
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
