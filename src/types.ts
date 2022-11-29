import type { RouterOutputs } from './utils/trpc'

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type UserProfile = RouterOutputs['userProfile']['get']
export type DecklystWithAuthor = RouterOutputs['decklyst']['get']
