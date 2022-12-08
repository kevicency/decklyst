import type { RouterOutputs } from './utils/trpc'

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type UserProfile = NonNullable<RouterOutputs['userProfile']['get']>
export type Decklyst = NonNullable<RouterOutputs['decklyst']['get']>
