import {
  BugReportIcon,
  CompareIcon,
  DeckbuilderIcon,
  DeckLibraryIcon,
  ExpandSidebarIcon,
  FeedbackIcon,
  LogInIcon,
  ProfileIcon,
} from '@/components/Icons'
import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import type { IconType } from 'react-icons'

const AppNavLink: FC<{
  href?: string
  onClick?: () => void
  icon: IconType | FC<{ className?: string }>
  iconClassName?: string
  children: ReactNode
  active?: boolean
  className?: string
}> = ({ icon: Icon, iconClassName, active, className, href, onClick, children }) => {
  const [{ isNavExpanded, isMobileNavOpen }] = useAppShell()

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
        'border-l-2 py-4 px-4 font-semibold hover:cursor-pointer hover:bg-gray-800',
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
      <span
        className={cx(
          `animate-in fade-in`,
          isNavExpanded || isMobileNavOpen ? '!inline-block min-w-fit' : 'hidden w-0',
        )}
      >
        {children}
      </span>
    </Component>
  )
}

const AvatarIcon: FC<{ className?: string }> = () => {
  const session = useSession()
  const user = session.data?.user

  return user?.image ? (
    <img className="h-6 w-6 rounded-full" src={user.image} alt={user.name ?? ''} />
  ) : (
    <ProfileIcon />
  )
}

export const AppNav: FC = () => {
  const router = useRouter()
  const session = useSession()
  const [{ isNavExpanded: isExpanded, isMobile, isMobileNavOpen }, { toggleNav }] = useAppShell()

  return (
    <div
      className={cx(
        'z-30 flex flex-col border-gray-700 grid-in-nav',
        isMobile
          ? isMobileNavOpen
            ? 'fixed top-[58px] left-0 bottom-0 z-[100] w-full overflow-y-auto bg-gray-900'
            : 'hidden'
          : 'border-r pt-6 shadow-nav',
      )}
    >
      <div className="flex flex-1 flex-col items-stretch gap-y-0.5">
        <AppNavLink
          href="/decks"
          icon={DeckLibraryIcon}
          active={router.pathname.startsWith('/decks') || router.pathname === `/[code]`}
        >
          Deck Library
        </AppNavLink>
        <AppNavLink href="/build" icon={DeckbuilderIcon}>
          Deck Builder
        </AppNavLink>
        <AppNavLink href="/compare" icon={CompareIcon}>
          Deck Diff
        </AppNavLink>
      </div>
      <div className={cx('flex shrink-0', isMobile ? 'flex-col' : 'flex-col')}>
        {session?.data?.user ? (
          <AppNavLink href={`/profile/${session.data.user?.id}`} icon={AvatarIcon}>
            Profile
          </AppNavLink>
        ) : (
          <AppNavLink
            onClick={() =>
              signIn('discord', {
                callbackUrl: window.location.href,
              })
            }
            icon={LogInIcon}
          >
            Sign In
          </AppNavLink>
        )}
        <div className="border-t border-gray-800">
          <AppNavLink href="https://discord.gg/YrwcrWymev" icon={FeedbackIcon}>
            Feedback
          </AppNavLink>
        </div>
        <div className="border-t border-gray-800">
          <AppNavLink
            href="https://discord.gg/qBe4AStVR8"
            icon={BugReportIcon}
            iconClassName="py-0.5"
          >
            Report a bug
          </AppNavLink>
        </div>
        {!isMobile && (
          <div className="border-t border-gray-800">
            <AppNavLink
              onClick={toggleNav}
              icon={ExpandSidebarIcon}
              iconClassName={isExpanded ? '-rotate-180' : 'rotate-0'}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </AppNavLink>
          </div>
        )}
      </div>
    </div>
  )
}
