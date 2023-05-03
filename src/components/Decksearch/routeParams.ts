import { maxSpiritCost } from '@/data/deck'
import type { RouterInputs } from '@/utils/trpc'
import { get, isNil, isString, omitBy } from 'lodash'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'

export type RouteParams = ReturnType<typeof parseRouteParams>
export type Filters = NonNullable<RouteParams['filters']>

export type Sorting = NonNullable<RouterInputs['decklyst']['search']['sorting']>
export type Timespan = NonNullable<RouterInputs['decklyst']['search']['timespan']>

export const parseRouteParams = (query: ParsedUrlQuery) => {
  const sorting = (query.sorting as Sorting | undefined) ?? 'views'
  const timespan = (query.timespan as Timespan | undefined) ?? 'all'
  const factions = (Array.isArray(query.factions) ? query.factions : [query.factions])
    .filter(isString)
    .map((faction) => faction.toLowerCase())
  const cardIds = (Array.isArray(query.cardIds) ? query.cardIds : [query.cardIds])
    .filter(isString)
    .map((cardId) => +cardId)
  const tags = (Array.isArray(query.tags) ? query.tags : [query.tags]).filter(isString)
  const maxSpirit = query.maxSpirit ? +query.maxSpirit : maxSpiritCost
  const authorId = query.authorId as string | undefined
  const includeDrafts = query.includeDrafts === 'true'
  const includeAnonymous = query.includeAnonymous === 'true' || query.includeAnonymous === undefined
  const includeUntitled = query.includeUntitled === 'true' || query.includeUntitled === undefined

  return {
    sorting,
    timespan,
    filters: {
      factions,
      cardIds,
      tags,
      maxSpirit,
      authorId,
      includeDrafts,
      includeAnonymous,
      includeUntitled,
    },
  } as const
}

const defaultRouteParams = parseRouteParams({})

export const useRouteParams = (initialRouteParams: RouteParams) => {
  const router = useRouter()
  const routeParams = router.query ? parseRouteParams(router.query) : initialRouteParams

  const updateRouteParams = async ({ filters, sorting, timespan }: RouteParams) => {
    await router.push(
      {
        pathname: router.pathname,
        query: omitBy(
          { ...router.query, sorting, timespan, ...filters },
          (value, key) =>
            isNil(value) ||
            get(defaultRouteParams.filters, key) === value ||
            (key === 'sorting' && value === defaultRouteParams.sorting) ||
            (key === 'timespan' && value === defaultRouteParams.timespan),
        ),
      },
      undefined,
      { shallow: true },
    )
  }

  return [routeParams, updateRouteParams] as const
}
