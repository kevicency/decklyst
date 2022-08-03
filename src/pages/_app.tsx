import { siteUrl } from '@/common/urls'
import { Layout } from '@/components/Layout'
import type { ServerRouter } from '@/server/router'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import superjson from 'superjson'
import 'typeface-roboto'
import '../styles/globals.css'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <QueryClientProvider client={queryClient}>
      <Layout showSearch={router.route !== '/'}>
        <Head>
          <title>Duelyst Share</title>
          <meta name="description" content="Share Duelyst 2 deck codes" />
          <meta property="og:site_name" content="Duelyst Share" />
          <meta property="og:title" content="Duelyst Share" />
          <link rel="icon" href="/public/favicon.ico" />
          <link type="application/json+oembed" href="/public/oembed.json" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default withTRPC<ServerRouter>({
  config({ ctx }) {
    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        url: '/api/trpc',
      }
    }
    // during SSR below

    // optional: use SSG-caching for each rendered page (see caching section for more details)
    const ONE_DAY_SECONDS = 60 * 60 * 24
    ctx?.res?.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`)

    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/server`
    const url = `${siteUrl}/api/trpc`

    return {
      transformer: superjson, // optional - adds superjson serialization
      url,
      headers: {
        // optional - inform server that it's an ssr request
        'x-ssr': '1',
      },
    }
  },
  ssr: true,
})(App)
