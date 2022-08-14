import { parseDeckcode } from '@/common/deckcode'
import { DeckcodeSearch } from '@/components/DeckcodeSearch'
import type { Deck } from '@/components/DeckInfograph/useDeck'
import { RecentDecks } from '@/components/RecentDecks'
import { createSsrClient } from '@/server'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Home: NextPage<Props> = ({ decks }) => {
  return (
    <div className="content-container flex flex-col justify-around flex-1 pb-8">
      <div className="flex flex-col">
        <h1 className="text-5xl text-center mt-8 mb-12">Duelyst Share</h1>
        <div className="flex px-48">
          <DeckcodeSearch big />
        </div>
      </div>
      <RecentDecks decks={decks} className="mt-16" />
    </div>
  )
}

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
  const client = await createSsrClient()
  const deckinfos = await client.query('recentDeckinfos')
  const decks: Deck[] = deckinfos.map(({ deckcode, sharecode }) => ({
    sharecode,
    ...parseDeckcode(deckcode)!,
  }))

  return {
    props: {
      decks,
    },
  }
}

export default Home
