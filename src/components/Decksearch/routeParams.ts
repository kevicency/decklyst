import { isString, isUndefined, omit, omitBy } from 'lodash'
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
  const tags = (Array.isArray(query.tags) ? query.tags : [query.tags]).filter(isString)
  const maxSpirit = query.maxSpirit ? +query.maxSpirit : 25000
  const includeDrafts = query.includeDrafts === 'true'
  const includeAnonymous = query.includeAnonymous === 'true' || query.includeAnonymous === undefined
  const includeUntitled = query.includeUntitled === 'true' || query.includeUntitled === undefined

  return {
    listing,
    filters: {
      factions,
      cardIds,
      tags,
      maxSpirit,
      includeDrafts,
      includeAnonymous,
      includeUntitled,
    },
  } as const
}

export const useRouteParams = (initialRouteParams: RouteParams) => {
  const router = useRouter()
  const routeParams = router.query ? parseRouteParams(router.query) : initialRouteParams

  const updateRouteParams = async ({ filters, listing }: RouteParams) => {
    const newQuery = { listing, ...omitBy(filters, isUndefined) }

    await router.push(
      {
        pathname: router.pathname,
        query: { ...omit(router.query, Object.keys(newQuery)), ...newQuery },
      },
      undefined,
      { shallow: true },
    )
  }

  return [routeParams, updateRouteParams] as const
}
