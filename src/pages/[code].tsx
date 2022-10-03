import { getImageDataUri } from '@/common/getImageDataUri'
import { transformer } from '@/common/transformer'
import { deckImageUrl } from '@/common/urls'
import { DeckInfograph } from '@/components/DeckInfograph'
import { DeckMetadata } from '@/components/DeckMetadata'
import {
  BuildIcon,
  ClockIcon,
  CompareIcon,
  CopyIcon,
  DoneIcon,
  DownloadDoneIcon,
  DownloadIcon,
  EyeIcon,
  LinkIcon,
} from '@/components/Icons'
import { OneTimeButton } from '@/components/OneTimeButton'
import { PageHeader } from '@/components/PageHeader'
import { DeckProvider } from '@/context/useDeck'
import { useRegisterView } from '@/context/useRegisterView'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import type { DeckExpanded } from '@/data/deck'
import { createDeckExpanded, deckcodeWithoutTitle$, faction$, title$ } from '@/data/deck'
import { trpc } from '@/hooks/trpc'
import { appRouter, createContext } from '@/server'
import { useQuery } from '@tanstack/react-query'
import { createProxySSGHelpers } from '@trpc/react/ssg'
import { formatDistance } from 'date-fns'
import { merge, noop, uniqBy } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticPropsContext } from 'next/types'
import type { FC } from 'react'
import React, { useEffect, useMemo } from 'react'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'

type Props = {
  deck: DeckExpanded
  isSnapshot: boolean
}

const DeckPage: FC<Props> = ({ deck }) => {
  const { query } = useRouter()
  const deckcode = deck.deckcode
  const meta = deck.meta ?? {}
  const imageFilename = useMemo(
    () => `${title$(deck)}_${faction$(deck)}_${deckcodeWithoutTitle$(deck)}.png`,
    [deck],
  )

  useRegisterView(deckcode)
  const { data: viewCount } = trpc.deckviews.get.useQuery({ deckcode })
  const { mutateAsync: ensureDeckimage } = trpc.deckimage.ensure.useMutation()
  const { data: imageDataUriFromQuery, refetch: refetchDeckimage } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const image = await ensureDeckimage({ code: deckcode })

      return getImageDataUri(image)
    },
    {
      staleTime: Infinity,
      retry: true,
      retryDelay: (retryCount) => 1000 * Math.pow(2, Math.max(0, retryCount - 5)),
    },
  )
  const [imageDataUri, setImageDataUri] = React.useState<string | null>(
    imageDataUriFromQuery ?? null,
  )

  useEffect(() => {
    if (imageDataUriFromQuery && imageDataUri !== imageDataUriFromQuery) {
      setImageDataUri(imageDataUriFromQuery)
    }
  }, [imageDataUri, imageDataUriFromQuery])

  const copyDeckcode = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(deckcode)
    }
  }
  const copyImageUrl = async () => {
    if (deckcode) {
      await navigator.clipboard.writeText(deckImageUrl(deckcode))
    }
  }

  const handleRegenerateClick = () => async () => {
    setImageDataUri(null)
    try {
      const image = await ensureDeckimage({ code: deckcode, forceRerender: true })
      setImageDataUri(getImageDataUri(image))
    } catch (e) {
      await refetchDeckimage()
    }
  }

  if (!deck) return null

  return (
    <DeckProvider deck={merge(deck, { meta: { viewCount: viewCount || 1 } })}>
      <SpriteLoaderProvider deck={deck} key={deck.deckcode}>
        <div className="flex flex-col flex-1 overflow-hidden">
          <PageHeader>
            <div className="text-sm text-black-300">
              {meta.viewCount && (
                <div className="flex gap-x-2 items-center">
                  <EyeIcon />
                  <span className="font-bold">{meta.viewCount}</span>
                  <span>{meta.viewCount === 1 ? 'view' : 'views'}</span>
                </div>
              )}
              {meta.createdAt && (
                <div className="flex gap-x-2 items-center">
                  <ClockIcon />
                  Created
                  <span className="font-bold">
                    {formatDistance(meta.createdAt, new Date(), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-x-4">
              <OneTimeButton onClick={copyDeckcode} timeout={2500}>
                {(copied) => (
                  <>
                    {copied ? <DoneIcon /> : <CopyIcon />}
                    Copy deckcode
                  </>
                )}
              </OneTimeButton>
              <OneTimeButton onClick={copyImageUrl} timeout={2500}>
                {(copied) => (
                  <>
                    {copied ? <DoneIcon /> : <LinkIcon />}
                    Copy image url
                  </>
                )}
              </OneTimeButton>
              <OneTimeButton
                href={imageDataUri ?? undefined}
                download={imageFilename}
                disabled={!imageDataUri}
              >
                {(isDownloading) =>
                  imageDataUri ? (
                    <>
                      {isDownloading ? <DownloadDoneIcon /> : <DownloadIcon />}
                      Download image &nbsp;
                    </>
                  ) : (
                    <>
                      <BounceLoader
                        size={18}
                        speedMultiplier={0.66}
                        color={colors.gray['400']}
                        className="mr-2"
                      />
                      <span className="text-gray-400">Generating image</span>
                    </>
                  )
                }
              </OneTimeButton>
            </div>
            <div className="flex gap-x-4">
              <Link href={{ pathname: '/compare', query: { left: deck.deckcode } }}>
                <a className="btn">
                  <CompareIcon />
                  Compare
                </a>
              </Link>
              <Link
                href={{
                  pathname: '/build/[deckcode]',
                  query: { deckcode: deck.deckcode },
                }}
              >
                <a className="btn">
                  <BuildIcon />
                  Open in deckbuilder
                </a>
              </Link>
            </div>
          </PageHeader>
          <DeckMetadata />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="content-container my-8">
              <DeckInfograph />
              <div>
                <input
                  name="deckcode"
                  className="page-header-input bg-gray-900 text-gray-200 px-4 w-full"
                  value={deckcode}
                  onFocus={(ev) => setTimeout(() => ev.target.select(), 50)}
                  readOnly
                  onChange={noop}
                  aria-label="Deckcode"
                />
              </div>
              <div className="flex gap-x-2 justify-end items-center text-gray-500 text-sm mt-4 mr-4">
                <span>Image broken?</span>
                <button
                  disabled={!imageDataUri}
                  onClick={handleRegenerateClick()}
                  className="text-gray-400 hover:text-teal-400 disabled:hover:text-gray-400"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </SpriteLoaderProvider>
    </DeckProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { prisma } = await createContext()
  const deckinfos = await prisma.deckinfo.findMany({
    select: { deckcode: true, sharecode: true },
  })

  return {
    paths: uniqBy(
      deckinfos
        .flatMap(({ deckcode, sharecode }) => [deckcode, sharecode])
        .filter((code) => code.length <= 255 - 40),
      (code) => code.toLowerCase(),
    ).map((code) => `/${encodeURIComponent(code)}`),
    fallback: 'blocking',
  }
}

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ snapshot?: string; code?: string }>,
) => {
  const code = ctx.params?.code as string | undefined

  if (!code) {
    return { notFound: true }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer,
  })
  const deckinfo = await ssg.deckinfo.get.fetch({ code, ensure: true })
  return deckinfo
    ? {
        props: {
          trpcState: ssg.dehydrate(),
          deck: createDeckExpanded(deckinfo.deckcode, {
            viewCount: 0,
            sharecode: deckinfo?.sharecode,
            createdAt: deckinfo?.createdAt,
          }),
        },
      }
    : { notFound: true, revalidate: true }
}

// export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
//   const code = query.code as string | undefined
//   const snapshot = +((query.snapshot as string | undefined) ?? '0') === 1

//   const client = await createApiClient()

//   let deckcode = code
//   const meta: DeckMeta = {
//     viewCount: 0,
//   }

//   if (code) {
//     const deckinfo = snapshot
//       ? await client.deckinfo.get({ code })
//       : await client.deckinfo.ensure({ code })

//     deckcode = deckinfo?.deckcode ?? deckcode
//     meta.sharecode = deckinfo?.sharecode ?? meta.sharecode
//     meta.createdAt = deckinfo?.createdAt ?? meta.createdAt
//   }

//   if (!validateDeckcode(deckcode)) {
//     return { notFound: true }
//   }

//   const deck = createDeck(deckcode)

//   if (deck.cards.length === 0) {
//     return { notFound: true }
//   }

//   if (!snapshot) {
//     await client.deckviews.registerView({
//       code: deck.deckcode!,
//       ipAddress: getIpAddress(req),
//     })
//     const views = await client.deckviews.get({ deckcodes: [deckcode!] })
//     meta.viewCount = views[0]?.viewCount ?? meta.viewCount
//   }

//   return {
//     props: {
//       deck: expandDeck(deck, meta),
//       isSnapshot: Boolean(+snapshot),
//     },
//   }
// }

export default DeckPage
