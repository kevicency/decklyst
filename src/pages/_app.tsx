import { trpc } from '@/common/trpc'
import { siteUrl } from '@/common/urls'
import { Layout } from '@/components/Layout'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${siteUrl}/api/trpc`,
    }),
  )
  const router = useRouter()
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <SpriteLoaderProvider>
          <Layout showSearch={router.route !== '/'}>
            <Head>
              <title>Decklyst</title>
              <meta name="description" content="Share or create Duelyst 2 deck codes" />
              <meta property="og:site_name" content="Decklyst" />
              <link rel="icon" href="/public/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </SpriteLoaderProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App

// export default withTRPC<ServerRouter>({
//   config({ ctx }) {
//     if (typeof window !== 'undefined') {
//       // during client requests
//       return {
//         transformer: superjson, // optional - adds superjson serialization
//         url: '/api/trpc',
//       }
//     }
//     // during SSR below
//
//     // optional: use SSG-caching for each rendered page (see caching section for more details)
//     const ONE_DAY_SECONDS = 60 * 60 * 24
//     ctx?.res?.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`)
//
//     // The server needs to know your app's full url
//     // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/server`
//     const url = `${siteUrl}/api/trpc`
//
//     return {
//       transformer: superjson, // optional - adds superjson serialization
//       url,
//       headers: {
//         // optional - inform server that it's an ssr request
//         'x-ssr': '1',
//       },
//     }
//   },
//   ssr: true,
// })(App)
