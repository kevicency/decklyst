import { isShareOrDeckcode } from '@/common/utils'
import {
  BugReportIcon,
  CompareIcon,
  DeckbuilderIcon,
  DeckLibraryIcon,
  DiscordIcon,
  ExpandSidebarIcon,
  EyeIcon,
  FeedbackIcon,
  SearchIcon,
} from '@/components/Icons'
import cx from 'classnames'
import { noop } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { IconType } from 'react-icons'

const appState = [
  { isNavExpanded: false as boolean, showFilters: false as boolean },
  { toggleNav: noop, toggleFilters: noop },
] as const
export type AppState = typeof appState
export const AppContext = createContext<AppState>(appState)

export const AppLogo = () => {
  const [{ isNavExpanded }] = useContext(AppContext)
  return (
    <Link
      href="/"
      className="flex h-12 items-center gap-x-4 border-r border-b border-gray-700 py-1 px-4 text-3xl font-thin grid-in-logo"
    >
      <img src="/favicon.png" alt="logo" className="ml-0.5 h-6 w-6" />

      {isNavExpanded && <span className="pr-2 animate-in fade-in">Decklyst</span>}
    </Link>
  )
}

export const AppHeader = () => {
  const [search, setSearch] = useState('')
  const handleSearch = () => Promise.resolve(true)

  const isSearchValid = isShareOrDeckcode(search)

  return (
    <div className="z-20 flex w-full items-center border-b border-gray-700 bg-gradient-to-r from-gray-900 to-alt-900 shadow-header grid-in-header">
      <div className="relative flex h-full w-1/3 items-stretch border-r border-gray-600 transition-colors">
        <button
          aria-label="Search"
          disabled={!isSearchValid}
          className={cx(
            'bg-transparent text-gray-300 hover:bg-accent-800 disabled:hover:bg-transparent',
            'disabled:text-gray-500',
            'absolute left-0 top-0 bottom-0 w-11',
            'flex items-center justify-center',
          )}
          onClick={handleSearch}
        >
          <SearchIcon className="pl-0.5" size={24} />
        </button>
        <input
          className={cx('w-full bg-transparent py-2 pl-5 focus:bg-gray-850', 'pl-12 pr-2')}
          placeholder={'Enter deckcode or sharecode'}
          value={search ?? ''}
          onFocus={(ev) => ev.target.select()}
          onChange={(ev) => setSearch(ev.target.value)}
          onKeyDown={async (ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              await handleSearch()
              return false
            }
          }}
        />
      </div>
      <div className="flex justify-center gap-x-4 px-4 font-semibold">
        <Link href="/">Foo</Link>
        <Link href="/">Bar</Link>
        <Link href="/">Baz</Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-x-4 px-4">
        <Link href="https://discord.gg/zYx5bqZszj" className="text-xl" target="_blank">
          <DiscordIcon />
        </Link>
        <span className="border border-gray-300 px-1.5 py-0.5 text-sm">Log In</span>
      </div>
    </div>
  )
}

export const AppNavLink: FC<{
  href?: string
  onClick?: () => void
  icon: IconType
  iconClassName?: string
  children: ReactNode
  active?: boolean
  className?: string
}> = ({ icon: Icon, iconClassName, active, className, href, onClick, children }) => {
  const [{ isNavExpanded }] = useContext(AppContext)
  const router = useRouter()
  const Component = href ? Link : 'div'

  const isActive = active ?? (href ? router.pathname.startsWith(href) : false)

  return (
    <Component
      href={href as any}
      target={href && /^http/.test(href) ? '_blank' : undefined}
      onClick={onClick}
      className={cx(
        className,
        'flex items-center gap-x-3 overflow-hidden whitespace-nowrap',
        'border-r-2 py-4 px-4 font-semibold hover:cursor-pointer hover:bg-gray-800',
        'text-gray-400',
        isActive
          ? 'border-accent-400 bg-gray-850 text-accent-600 hover:border-accent-400 hover:text-accent-600'
          : 'border-transparent hover:border-gray-400 hover:text-gray-400',
      )}
    >
      <Icon
        className={cx(iconClassName, 'shrink-0 text-2xl transition-transform', {
          'text-accent-400': isActive,
        })}
      />
      {isNavExpanded && <span className="animate-in fade-in">{children}</span>}
    </Component>
  )
}

export const AppNav: FC = () => {
  const [{ isNavExpanded: isExpanded }, { toggleNav }] = useContext(AppContext)

  return (
    <>
      <div
        className={cx(
          'z-30 flex flex-col gap-y-0.5 border-r border-gray-700 pt-6 shadow-nav grid-in-nav-t',
        )}
      >
        <AppNavLink href="/decks" icon={DeckLibraryIcon}>
          Deck Libray
        </AppNavLink>
        <AppNavLink href="/build" icon={DeckbuilderIcon}>
          Deck Builder
        </AppNavLink>
        <AppNavLink href="/compare" icon={CompareIcon}>
          Deck Diff
        </AppNavLink>
        <AppNavLink href="/test" icon={EyeIcon}>
          Test Page
        </AppNavLink>
      </div>
      <div className={cx('z-30 flex flex-col border-r border-gray-700 shadow-nav grid-in-nav-b')}>
        <div className="border-t border-gray-800">
          <AppNavLink
            href="discord://discord.com/channels/1041363184872857602/1041363185707528208"
            icon={FeedbackIcon}
          >
            Feedback
          </AppNavLink>
        </div>
        <div className="border-t border-gray-800">
          <AppNavLink
            href="discord://discord.com/channels/1041363184872857602/1041363436711465050"
            icon={BugReportIcon}
            iconClassName="!text-xl"
          >
            Report a bug
          </AppNavLink>
        </div>
        <div className="border-t border-gray-800">
          <AppNavLink
            onClick={toggleNav}
            icon={ExpandSidebarIcon}
            iconClassName={isExpanded ? '-rotate-180' : 'rotate-0'}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </AppNavLink>
        </div>
      </div>
    </>
  )
}
export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavExpanded, setNavExpanded] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChanged = (url: string, { shallow }: { shallow: boolean }) => {
      console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`)
      if (!shallow) {
        setShowFilters(url === '/decks')
      }
    }

    router.events.on('routeChangeComplete', handleRouteChanged)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppContext.Provider
      value={[
        { isNavExpanded, showFilters },
        {
          toggleNav: () => setNavExpanded((value) => !value),
          toggleFilters: () => setShowFilters((value) => !value),
        },
      ]}
    >
      <div className="grid h-screen w-screen grid-cols-desktop grid-rows-desktop overflow-hidden bg-gray-1000 grid-areas-desktop">
        <AppLogo />
        <AppHeader />
        <AppNav />
        {children}
      </div>
    </AppContext.Provider>
  )
}
