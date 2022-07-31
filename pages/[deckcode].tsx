import { InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { GetServerSidePropsContext } from 'next/types'
import { parseDeckcode, validateDeckcode } from '../lib/deckcode'
import { DeckInfograph } from '../components/DeckInfograph'
import { DeckMetadata } from '../components/DeckMetadata'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const DeckPage: FC<Props> = ({ deckcode, deck, error }) => {
  return (
    <div className="w-[64rem] mx-auto my-8">
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
      <div className="mt-8 px-4">
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
          <a href={`/${deckcode}.png`} className="text-blue-500 hover:underline ">
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
