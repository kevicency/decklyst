import { DeckTitle } from '@/components/DeckInfograph/DeckTitle'
import { PageHeader } from '@/components/PageHeader'
import { DeckProvider } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { createDeckExpanded } from '@/data/deck'
import type { CardDiff, DeckDiff } from '@/hooks/useDeckDiff'
import { useDeckDiff } from '@/hooks/useDeckDiff'
import { debounce, get, startCase } from 'lodash'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext } from 'next/types'
import type { FC } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { CardCount } from '../../components/DeckDiff/CardCount'
import { CardItem } from '../../components/DeckDiff/CardItem'
import { Delta } from '../../components/DeckDiff/Delta'
import { Row } from '../../components/DeckDiff/Row'

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
    <div className="bg-image-deckdiff flex flex-1 flex-col overflow-hidden grid-in-main">
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
        <div className="flex w-24 flex-col">
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
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="content-container bg-slate-900 my-8 p-6" id="snap">
          <Row>
            <DeckHeader deck={leftDeck} />
            <div className="flex flex-col justify-center text-center">
              <div className="mb-2 flex items-end justify-center gap-x-2 text-lg text-gray-400">
                <div className="text-2xl font-bold text-accent-600">{deckDiff.changes}</div>
                <div>changes</div>
              </div>
              {!snapshot && (
                <label className="flex cursor-pointer items-center justify-center gap-x-1">
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
                <Row className="text mt-6 mb-4">
                  <CardCount
                    count={get(leftDeck.counts, path)}
                    title={startCase(path)}
                    faction={leftDeck?.faction}
                  />
                  <Delta value={get(deckDiff.deltas, path)} big />
                  <CardCount
                    count={get(rightDeck.counts, path)}
                    title={startCase(path)}
                    mirrored
                    faction={leftDeck?.faction}
                  />
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
        <Link
          href={{ pathname: '/build/[deckcode]', query: { deckcode: deck.deckcode } }}
          className="scale-90"
        >
          <DeckTitle />
        </Link>
      ) : deck.deckcode ? (
        <div className="flex items-center justify-center text-xl font-bold text-red-500">
          Invalid deckcode
        </div>
      ) : (
        <div className="flex items-center justify-center text-lg text-gray-500">
          Please enter a deckcode above
        </div>
      )}
    </DeckProvider>
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
