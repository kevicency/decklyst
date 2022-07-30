import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { validateDeckcode } from '../lib/deckcode'
import cx from 'classnames'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const [deckcode, setDeckcode] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [])

  const valid = deckcode && validateDeckcode(deckcode)
  const invalid = !valid
  const touched = deckcode !== null

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await navigateToDeckcode()
    }
  }

  const navigateToDeckcode = () => {
    if (!navigating) {
      setNavigating(true)
      router
        .push(`/[deckcode]`, `/${encodeURIComponent(deckcode!)}`)
        .then(() => setNavigating(false))
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Duelyst Share</title>
        <meta name="description" content="Share Duelyst 2 deck codes" />
        <meta property="og:site_name" content="Duelyst Share" />
        <meta property="og:title" content="Duelyst Share" />
        <link rel="icon" href="/favicon.ico" />
        <link type="application/json+oembed" href="/oembed.json" />
      </Head>
      <div className="w-[48rem] mx-auto flex flex-col mt-8">
        <div className="flex flex-col flex-1 mt-2 items-center px-4">
          <input
            ref={inputElement}
            className={cx(
              'px-4 py-6 flex-1 w-full bg-slate-800 border-2 border-slate-600 text-xl',
              {
                'border-red-500': touched && invalid,
              },
            )}
            placeholder="Enter deckcode"
            value={deckcode ?? ''}
            onChange={(ev) => setDeckcode(ev.target.value)}
            onKeyDown={handleKeydown}
          />
          <div className="mt-1 text-red-500">
            {touched && invalid ? 'Invalid deckcode' : <span>&nbsp;</span>}
          </div>
          <div className={'mt-2'}>
            <button
              disabled={invalid || navigating}
              className={
                'bg-blue-500 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold py-3 px-5 rounded text-xl'
              }
              onClick={navigateToDeckcode}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
