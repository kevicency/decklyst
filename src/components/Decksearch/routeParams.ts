import { isString, isUndefined, omitBy } from 'lodash'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'

export type RouteParams = ReturnType<typeof parseRouteParams>
export type Filters = NonNullable<RouteParams['filters']>

export const listings = ['hot', 'popular', 'new'] as const
export type Listing = typeof listings[number]

export const parseRouteParams = (query: ParsedUrlQuery) => {
  const listing = (query.listing as Listing | undefined) ?? 'hot'
  const factions = (Array.isArray(query.factions) ? query.factions : [query.factions])
    .filter(isString)
    .map((faction) => faction.toLowerCase())
  const cardIds = (Array.isArray(query.cardIds) ? query.cardIds : [query.cardIds])
    .filter(isString)
    .map((cardId) => +cardId)

  return {
    listing,
    filters: { factions, cardIds },
  } as const
}

export const useRouteParams = (initialRouteParams: RouteParams) => {
  const router = useRouter()
  const routeParams = router.query ? parseRouteParams(router.query) : initialRouteParams

  const updateRouteParams = async ({ filters, listing }: RouteParams) => {
    await router.push(
      {
        pathname: `/decks${listing ? `/${listing}` : ''}`,
        query: omitBy(filters, isUndefined),
      },
      undefined,
      { shallow: true },
    )
  }

  return [routeParams, updateRouteParams] as const
}
