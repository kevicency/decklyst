import { AppShell } from '@/components/AppShell/AppShell'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { trpc } from '@/utils/trpc'
import { Analytics } from '@vercel/analytics/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <Head>
      <title>Decklyst</title>
      <meta name="description" content="Share or create Duelyst 2 decks" />
      <meta
        name="keywords"
        content="Decklyst, Duelyst, Duelyst 2, database, deck, decklist, deckcode, deckbuilder, meta, tournament, starter decks"
      />
      <meta property="og:site_name" content="Decklyst" />
      <meta name="google-site-verification" content="todbfz-oykJnt7ZTWmfVp8J6TyL1pnYoPMo6tZtkz-o" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <SessionProvider session={session}>
      <AppShell>
        <SpriteLoaderProvider>
          <Component {...pageProps} />
        </SpriteLoaderProvider>
      </AppShell>
    </SessionProvider>
    <Analytics />
  </>
)

export default trpc.withTRPC(App)
