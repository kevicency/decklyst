import { noop } from 'lodash'
import { createContext, useContext } from 'react'

const appShellState = [
  {
    isMobile: false as boolean,
    isNavExpanded: false as boolean,
    isMobileNavOpen: false as boolean,
    showFilters: false as boolean,
  },
  { toggleNav: noop, toggleMobileNav: noop, toggleFilters: noop },
] as const
export type AppShellState = typeof appShellState
export const AppShellContext = createContext<AppShellState>(appShellState)

export const useAppShell = () => useContext(AppShellContext)
