import { DeckcodeSearch } from '@/components/DeckcodeSearch'
import { Decklinks } from '@/components/Decklinks'
import { createSsrClient } from '@/server'
import cx from 'classnames'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { useState } from 'react'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Tab = 'most-viewed' | 'trending'

const Home: NextPage<Props> = ({ mostViewedDecks, trendingDecks, initialTab }) => {
  const [tab, setTab] = useState<Tab>(initialTab)

  return (
    <div className="content-container flex flex-col justify-around flex-1 pb-8">
      <div className="flex flex-col">
        <h1 className="text-5xl text-center mt-8 mb-12">Decklyst</h1>
        <div className="flex px-48">
          <DeckcodeSearch big />
        </div>
      </div>
      <div className="flex flex-col mt-16">
        <div className="flex text-3xl gap-x-4">
          <button
            onClick={() => setTab('trending')}
            className={cx(
              tab === 'trending'
                ? 'text-slate-100 cursor-default'
                : 'text-slate-500 hover:text-sky-400 cursor-pointer',
            )}
          >
            Trending
          </button>
          <button
            onClick={() => setTab('most-viewed')}
            className={cx(
              tab === 'most-viewed'
                ? 'text-slate-100 cursor-default'
                : 'text-slate-500 hover:text-sky-400 cursor-pointer',
            )}
          >
            Most Viewed
          </button>
        </div>
        <Decklinks decks={tab === 'trending' ? trendingDecks : mostViewedDecks} />
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const client = await createSsrClient()
  const mostViewedDecks = await client.query('mostViewedDecks', { count: 3 })
  const trendingDecks = await client.query('mostViewedDecks', { count: 3, recent: true })
  const initialTab: Tab = query.tab === 'most-viewed' ? 'most-viewed' : 'trending'

  return {
    props: {
      mostViewedDecks,
      trendingDecks,
      initialTab,
    },
  }
}

export default Home
