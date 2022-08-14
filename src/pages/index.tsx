import { DeckcodeSearch } from '@/components/DeckcodeSearch'
import type { NextPage } from 'next'

// type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Home: NextPage<{ decks: any }> = ({ decks }) => {
  return (
    <div className="content-container flex flex-1   pb-8">
      <div className="flex flex-col flex-1 mt-[16%]">
        <h1 className="text-5xl text-center mt-8 mb-12">Duelyst Share</h1>
        <div className="flex-1 px-24">
          <DeckcodeSearch big />
        </div>
      </div>
      {/*<ul>*/}
      {/*  {decks?.map((deck, i) => (*/}
      {/*    <li key={deck?.deckcode ?? i}>{deck?.deckcode ?? null}</li>*/}
      {/*  ))}*/}
      {/*</ul>*/}
    </div>
  )
}

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//   const client = await createSsrClient()
//   const deckcodes = await client.query('recentDeckcodes')
//
//   return {
//     props: {
//       decks: deckcodes.map(parseDeckcode),
//     },
//   }
// }

export default Home
