import { DeckcodeSearch } from '@/components/DeckcodeSearch'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Duelyst Share</title>
        <meta name="description" content="Share Duelyst 2 deck codes" />
        <meta property="og:site_name" content="Duelyst Share" />
        <meta property="og:title" content="Duelyst Share" />
        <link rel="icon" href="/public/favicon.ico" />
        <link type="application/json+oembed" href="/public/oembed.json" />
      </Head>
      <div className="content-container flex justify-center items-center h-32">
        <DeckcodeSearch big />
      </div>
    </div>
  )
}

export default Home
