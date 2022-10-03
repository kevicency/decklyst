import { trpc } from '@/hooks/trpc'
import { Layout } from '@/components/Layout'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SpriteLoaderProvider>
      <Layout showSearch={router.route !== '/'}>
        <Head>
          <title>Decklyst</title>
          <meta name="description" content="Share or create Duelyst 2 deckcodes" />
          <meta property="og:site_name" content="Decklyst" />
          <meta
            name="google-site-verification"
            content="todbfz-oykJnt7ZTWmfVp8J6TyL1pnYoPMo6tZtkz-o"
          />
          <link rel="icon" href="/public/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SpriteLoaderProvider>
  )
}

export default trpc.withTRPC(App)
