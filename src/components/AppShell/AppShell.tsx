import { AppShellContext } from '@/context/useAppShell'
import { theme } from '@/utils/tw'
import cx from 'classnames'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AppHeader } from './AppHeader'
import { AppLogo } from './AppLogo'
import { AppNav } from './AppNav'

export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isNavExpanded, setNavExpanded] = useState(true)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const handleResize = () => {
    const isXlScreen = window.innerWidth >= +theme.screens['xl'].slice(0, -2)
    const isMobileScreen = window.innerWidth < +theme.screens['lg'].slice(0, -2)

    setNavExpanded(isXlScreen)
    setIsMobile(isMobileScreen)
  }

  useEffect(() => {
    handleResize()

    const handleRouteChanged = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        setShowFilters(url.startsWith('/decks') || url.startsWith('/profile'))
      }
      setMobileNavOpen(false)
    }

    window.addEventListener('resize', handleResize)
    router.events.on('routeChangeComplete', handleRouteChanged)

    return () => {
      window.removeEventListener('resize', handleResize)
      router.events.off('routeChangeComplete', handleRouteChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppShellContext.Provider
      value={[
        { isMobile, isNavExpanded, isMobileNavOpen, showFilters },
        {
          toggleNav: () => setNavExpanded((value) => !value),
          toggleMobileNav: () => setMobileNavOpen((value) => !value),
          toggleFilters: () => setShowFilters((value) => !value),
        },
      ]}
    >
      <div
        className={cx(
          isMobile
            ? 'grid-cols-mobile grid-rows-mobile grid-areas-mobile'
            : 'grid-cols-desktop grid-rows-desktop grid-areas-desktop',
          `relative grid h-screen w-screen overflow-hidden bg-gray-1000`,
        )}
      >
        <AppLogo />
        <AppHeader />
        <AppNav />
        {/* {status === 'loading' ? <PageLoader /> : children} */}
        {children}
      </div>
    </AppShellContext.Provider>
  )
}
