import { noop } from 'lodash'
import { createContext, useContext } from 'react'

const appShellState = [
  { isNavExpanded: false as boolean, showFilters: false as boolean },
  { toggleNav: noop, toggleFilters: noop },
] as const
export type AppShellState = typeof appShellState
export const AppShellContext = createContext<AppShellState>(appShellState)

export const useAppShell = () => useContext(AppShellContext)
