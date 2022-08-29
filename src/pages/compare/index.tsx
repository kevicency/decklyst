import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { ManaIcon } from '@/components/DeckInfograph/ManaIcon'
import { PageHeader } from '@/components/PageHeader'
import { DeckProvider } from '@/context/useDeck'
import type { CardData } from '@/data/cards'
import type { DeckExpanded } from '@/data/deck'
import { createDeckExpanded } from '@/data/deck'
import type { CardDiff, DeckDiff } from '@/hooks/useDeckDiff'
import { useDeckDiff } from '@/hooks/useDeckDiff'
import { useSpriteQuery } from '@/queries/useSpriteQuery'
import cx from 'classnames'
import { debounce, get, startCase } from 'lodash'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC, ReactNode } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import colors from 'tailwindcss/colors'

type Show = 'all' | 'diff'
type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export const ComparePage: FC<Props> = ({ snapshot, ...props }) => {
  const router = useRouter()
  const left = (router.query.left as string) ?? props.left ?? ''
  const right = (router.query.right as string) ?? props.right ?? ''
  const show = (router.query.show as Show) ?? props.show ?? 'all'
  const [leftValue, setLeftValue] = useState(left)
  const [rightValue, setRightValue] = useState(right)

  const leftDeck = useMemo(() => createDeckExpanded(left ?? ''), [left])
  const rightDeck = useMemo(() => createDeckExpanded(right ?? ''), [right])

  const deckDiff = useDeckDiff(leftDeck, rightDeck)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateRoute = useCallback(
    debounce(async (name: string, value: string) => {
      await router.push(
        {
          pathname: router.pathname,
          query: {
            left,
            right,
            [name]: value,
          },
        },
        undefined,
        { shallow: true },
      )
    }, 500),
    [router],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <CompareMetadata leftDeck={leftDeck} rightDeck={rightDeck} deckDiff={deckDiff} />
      <PageHeader>
        <div className="flex-1">
          <input
            name="left"
            placeholder="Enter a deckcode"
            className="page-header-input"
            value={leftValue}
            onChange={(ev) => {
              setLeftValue(ev.target.value)
              updateRoute(ev.target.name, ev.target.value)
            }}
            onFocus={(ev) => ev.target.select()}
          />
        </div>
        <div className="flex flex-col w-24">
          <div className="text-center text-xl">VS</div>
        </div>
        <div className="flex-1">
          <input
            name="right"
            placeholder="Enter a deckcode"
            className="page-header-input"
            value={rightValue}
            onChange={(ev) => {
              setRightValue(ev.target.value)
              updateRoute(ev.target.name, ev.target.value)
            }}
            onFocus={(ev) => ev.target.select()}
          />
        </div>
      </PageHeader>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="content-container my-8 p-6 bg-slate-900" id="snap">
          <Row>
            <DeckHeader deck={leftDeck} />
            <div className="flex flex-col text-center justify-center">
              <div className="flex gap-x-2 text-black-400 text-lg items-end justify-center mb-2">
                <div className="text-teal-600 font-bold text-2xl">{deckDiff.changes}</div>
                <div>changes</div>
              </div>
              {!snapshot && (
                <label className="flex gap-x-1 justify-center items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className=""
                    checked={show === 'diff'}
                    onChange={async (ev) => {
                      await router.replace({
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          show: ev.target.checked ? 'diff' : 'all',
                        },
                      })
                    }}
                  />
                  changes only
                </label>
              )}
            </div>
            <DeckHeader deck={rightDeck} />
          </Row>

          {['minions', 'spells', 'artifacts'].map((path) => {
            const diffCards = (get(deckDiff, path) as CardDiff[]).filter(
              (diff) => show === 'all' || diff.delta !== 0,
            )
            return diffCards.length ? (
              <Fragment key={path}>
                <Row className="mt-6 mb-4 text">
                  <CardCount count={get(leftDeck.counts, path)} title={startCase(path)} />
                  <Delta value={get(deckDiff.deltas, path)} big />
                  <CardCount count={get(rightDeck.counts, path)} title={startCase(path)} mirrored />
                </Row>
                {diffCards.map(({ card, left, right, delta }: CardDiff) => (
                  <Row key={card.id} className="mb-1">
                    <CardItem card={card} count={left} delta={delta} />
                    <Delta value={delta} />
                    <CardItem card={card} count={right} delta={delta} mirrored />
                  </Row>
                ))}
              </Fragment>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}

const CompareMetadata: FC<{
  leftDeck: DeckExpanded
  rightDeck: DeckExpanded
  deckDiff: DeckDiff
}> = ({ leftDeck, rightDeck, deckDiff }) => {
  const leftTitle = leftDeck.valid
    ? `${leftDeck.title || 'Untitled'} (${startCase(leftDeck.faction)})`
    : 'Invalid Deck'
  const rightTitle = rightDeck.valid
    ? `${rightDeck.title || 'Untitled'} (${startCase(rightDeck.faction)})`
    : 'Invalid Deck'

  const withSign = (value: number) => (value > 0 ? `+${value}` : value)

  return (
    <Head>
      <title>{`Compare | Decklyst`}</title>
      <meta property="og:title" content={`${leftTitle} VS ${rightTitle}`} />
      <meta
        property="og:description"
        content={[
          `${deckDiff.changes} card(s) changed`,
          `${withSign(deckDiff.deltas.minions)} minion(s)`,
          `${withSign(deckDiff.deltas.spells)} spell(s)`,
          `${withSign(deckDiff.deltas.artifacts)} artifact(s)`,
        ]
          .map((line) => `➤ ${line}`)
          .join('\n')}
      />
    </Head>
  )
}

const DeckHeader: FC<{ deck: DeckExpanded }> = ({ deck }) => {
  return (
    <DeckProvider deck={deck}>
      {deck.valid ? (
        <Link href={{ pathname: '/build/[deckcode]', query: { deckcode: deck.deckcode } }}>
          <a className="scale-90">
            <DeckTitle />
          </a>
        </Link>
      ) : deck.deckcode ? (
        <div className="flex items-center justify-center font-bold text-xl text-red-500">
          Invalid deckcode
        </div>
      ) : (
        <div className="flex items-center justify-center text-lg text-black-500">
          Please enter a deckcode above
        </div>
      )}
    </DeckProvider>
  )
}
const CardCount: FC<{ title?: string; count: number; mirrored?: boolean }> = ({
  title,
  count,
  mirrored,
}) => (
  <div className={cx('flex gap-x-2 text-2xl', !mirrored && 'flex-row-reverse')}>
    <span className={`text-teal-600`}>{count}</span>
    <span>{title}</span>
  </div>
)

const Row: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cx('grid grid-cols-[minmax(0,1fr),10rem,minmax(0,1fr)]', className)}>
    {children}
  </div>
)

const Delta: FC<{ value: number; big?: boolean }> = ({ value, big }) => (
  <div
    className={cx(big ? 'text-2xl' : 'text-xl', 'font-mono text-center', {
      'text-green-500': value > 0,
      'text-red-500': value < 0,
    })}
  >
    {value > 0 ? '+' : value < 0 ? '-' : ''}
    {Math.abs(value)}
  </div>
)

export const CardItem: FC<{ card: CardData; count: number; delta: number; mirrored?: boolean }> = ({
  card,
  count,
  delta,
  mirrored,
}) => {
  const { data: sprite } = useSpriteQuery(card.id)
  const gradientColor = useMemo(() => {
    if (count === 0 || delta === 0) return `${colors.slate[900]}cc`
    // return `${delta * (mirrored ? 1 : -1) > 0 ? colors.green[900] : colors.red[900]}55`
    return `${colors.slate[600]}66`
  }, [count, delta])

  return (
    <div
      className={cx(
        'relative bg-gray-800 cursor-pointer select-none transition-transform text-normal',
        mirrored ? 'mr-8' : 'ml-8',
        count === 0 && 'opacity-40',
      )}
    >
      <div
        className="absolute left-0 top-0 right-0.5 h-full sprite"
        style={{
          backgroundImage: `url(${sprite?.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: '90px',
        }}
      />
      <div
        className="absolute left-0 top-0 w-full h-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 25%, ${gradientColor} 100%)`,
        }}
      />
      <div className="flex items-center w-full mb-1 py-1.5 relative">
        <ManaIcon mana={card.mana} className="-ml-2.5 mr-1" />
        <div className="text-sm">{card.name}</div>
        <div className="flex-1" />
        <div
          className={`font-mono font-bold border border-gray-600 text-gray-200 bg-gray-800 text-center px-1`}
        >
          x{count}
        </div>
      </div>
    </div>
  )
}

export default ComparePage

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { left, right, show, snapshot } = context.query as {
    left?: string
    right?: string
    show?: 'all' | 'diff'
    snapshot?: number | boolean
  }
  return {
    props: {
      left: left ?? '',
      right: right ?? '',
      show: show ?? 'diff',
      snapshot: Boolean(snapshot ?? 0),
    },
  }
}