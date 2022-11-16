import { AppShell } from '@/components/AppShell'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { trpc } from '@/utils/trpc'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
      <AppShell>
        <SpriteLoaderProvider>
          <Component {...pageProps} />
        </SpriteLoaderProvider>
      </AppShell>
      <Analytics />
    </>
  )
}

export default trpc.withTRPC(App)
