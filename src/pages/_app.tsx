import { Layout } from '@/components/Layout'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { trpc } from '@/hooks/trpc'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SpriteLoaderProvider>
      <Layout hideSidebar={router.pathname.startsWith('/deckimage')}>
        <Head>
          <title>Decklyst</title>
          <meta name="description" content="Share or create Duelyst 2 deckcodes" />
          <meta property="og:site_name" content="Decklyst" />
          <meta
            name="google-site-verification"
            content="todbfz-oykJnt7ZTWmfVp8J6TyL1pnYoPMo6tZtkz-o"
          />
          <link rel="icon" href="favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </SpriteLoaderProvider>
  )
}

export default trpc.withTRPC(App)
