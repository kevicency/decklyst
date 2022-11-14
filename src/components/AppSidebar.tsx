import { isShareOrDeckcode } from '@/common/utils'
import { BuildIcon, CompareIcon, ImportIcon, SearchIcon, ShareIcon } from '@/components/Icons'
import { factions } from '@/data/cards'
import { defaultDeckcode, validateDeckcode } from '@/data/deckcode'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ChangeEvent, FC } from 'react'
import { Children, useState } from 'react'
import type { IconType } from 'react-icons'
import { HiCode } from 'react-icons/hi'
import { SiBuymeacoffee, SiGithub } from 'react-icons/si'

const AppSidebarLink: FC<{
  href: LinkProps['href']
  icon?: IconType
  iconClassName?: string
  active?: boolean
  disabled?: boolean
  children: any
}> = ({ href, active, disabled, icon: Icon, iconClassName, children }) => {
  const { Tag, props } = disabled
    ? { Tag: 'span', props: {} as any }
    : { Tag: Link, props: { href } }

  return (
    <Tag
      {...props}
      className={cx(
        'flex items-center border-l-4 py-1 pl-4 text-2xl font-light',
        active ? 'border-accent-400' : 'border-transparent',
        disabled && 'disabled',
      )}
    >
      {Icon && <Icon className={cx('mr-2', iconClassName)} />}
      {children}
    </Tag>
  )
}
const AppSidebarInput: FC<{
  value?: string
  icon?: IconType
  validate?: (value?: string) => boolean
  placeholder?: string
  onChange: (value?: string) => void
  onEnter: (value?: string) => Promise<any>
}> = ({ value, icon: Icon, validate, placeholder, onChange, onEnter }) => {
  const [active, setActive] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const valid = validate?.(value) ?? true

  const handleAction = async () => {
    setActive(true)
    try {
      await onEnter(value)
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setActive(false)
    }
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onChange?.(ev.target.value)
  }

  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          className={cx(
            'transition-colors',
            'w-full border-b-2 bg-neutral-700 py-2 pl-5',
            Icon ? 'pr-10' : 'pr-5',
            error ? 'border-red-500' : 'border-neutral-400 focus:border-neutral-200',
          )}
          placeholder={placeholder ?? 'Enter deck/share code'}
          value={value ?? ''}
          onFocus={(ev) => ev.target.select()}
          onChange={handleChange}
          onKeyDown={async (ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              await handleAction()
              return false
            }
          }}
        />
        {Icon && (
          <button
            aria-label="Search"
            disabled={!valid || active}
            className={cx(
              'bg-neutral-600 hover:bg-accent-600',
              'disabled:bg-transparent disabled:text-neutral-500',
              'absolute right-0.5 top-0 bottom-0.5 w-10',
              'flex items-center justify-center',
            )}
            onClick={handleAction}
          >
            <Icon className="pl-0.5" size={24} />
          </button>
        )}
      </div>
      <div className="py-0.5 px-10 text-xs text-red-500">{error?.message}&nbsp;</div>
    </div>
  )
}
export const AppSidebarMenu: FC<{ children?: any }> = ({ children }) => (
  <ul className="-mt-5 pl-6 text-lg">
    <li className="-mb-2 border-l border-neutral-400 pl-4">&nbsp;</li>
    {children
      ? Children.map(children, (child, i) => (
          <li key={child.key ?? i} className="border-l border-neutral-400 pl-4">
            {child}
          </li>
        ))
      : null}
  </ul>
)
export const AppSidebar: FC = () => {
  const router = useRouter()
  const [shareQuery, setShareQuery] = useState<string | undefined>(undefined)
  const [buildQuery, setBuildQuery] = useState<string | undefined>(undefined)
  const [compareQuery, setCompareQuery] = useState<{ left?: string; right?: string }>({})

  const navigateToDeckcode = async () => {
    setShareQuery(undefined)
    return shareQuery
      ? await router.push(`/[deckcode]`, `/${encodeURIComponent(shareQuery!)}`)
      : null
  }

  const navigateToBuilder = async () => {
    const url = {
      pathname: '/build/[deckcode]',
      query: { deckcode: undefined as string | undefined },
    }
    if (validateDeckcode(buildQuery)) {
      url.query.deckcode = buildQuery
    } else {
      const res = await fetch(`/api/deckinfo/${buildQuery}`)

      if (res.ok) {
        url.query.deckcode = (await res.json()).deckcode
      }
    }

    if (url.query.deckcode) {
      setBuildQuery(undefined)
      return await router.push(url)
    }
    return Promise.reject(new Error('Invalid deck/share code'))
  }

  const navigateToCompare = async () => {
    setCompareQuery({})
    await router.push({ pathname: '/compare', query: compareQuery })
  }

  return (
    <div className="flex h-screen w-60 flex-col overflow-hidden border-r border-neutral-700 bg-neutral-800">
      <h1 className="mt-8 mb-12 text-center">
        <Link href="/" className="text-5xl font-thin">
          Decklyst
        </Link>
      </h1>
      <div className="flex flex-col gap-y-8">
        <div>
          <AppSidebarLink
            href="/"
            active={router.pathname === '/' || router.pathname === '/[code]'}
            icon={ShareIcon}
          >
            Share
          </AppSidebarLink>
          <AppSidebarInput
            value={shareQuery}
            onChange={setShareQuery}
            icon={SearchIcon}
            onEnter={navigateToDeckcode}
            validate={isShareOrDeckcode}
          />
          <AppSidebarMenu>
            <Link href={`/decks?tab=trending`}>Trending</Link>
            <Link href={`/decks?tab=most-viewed`}>Most viewed</Link>
            <Link href={`/decks?tab=latest`}>Latest</Link>
          </AppSidebarMenu>
        </div>
        <div>
          <AppSidebarLink
            href="/build"
            active={router.pathname === '/build'}
            icon={BuildIcon}
            iconClassName="p-0.5"
          >
            Build
          </AppSidebarLink>
          <AppSidebarInput
            value={buildQuery}
            onChange={setBuildQuery}
            icon={ImportIcon}
            onEnter={navigateToBuilder}
            validate={isShareOrDeckcode}
          />
          <AppSidebarMenu>
            {factions.map((faction) => (
              <Link
                key={faction}
                href={`/build/${defaultDeckcode(faction)}`}
                prefetch={false}
                className={`hover:text-${faction}`}
              >
                {startCase(faction)}
              </Link>
            ))}
          </AppSidebarMenu>
        </div>
        <div>
          <AppSidebarLink
            href="/compare"
            active={router.pathname === '/compare'}
            icon={CompareIcon}
          >
            Compare
          </AppSidebarLink>
          <AppSidebarInput
            value={compareQuery.left}
            placeholder="Enter deckcode A"
            onChange={(value) =>
              setCompareQuery((state) => ({
                ...state,
                left: value,
              }))
            }
            onEnter={navigateToCompare}
            validate={isShareOrDeckcode}
          />
          <AppSidebarMenu></AppSidebarMenu>
          <AppSidebarInput
            value={compareQuery.right}
            placeholder="Enter deckcode B"
            onChange={(value) =>
              setCompareQuery((state) => ({
                ...state,
                right: value,
              }))
            }
            onEnter={navigateToCompare}
            validate={isShareOrDeckcode}
          />
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex border-t border-neutral-600 bg-neutral-900 py-4 px-8">
        <div className="text-sm text-neutral-500">
          <div className="flex items-center gap-x-2">
            <HiCode /> by{' '}
            <a
              href="https://github.com/kmees"
              target="_blank"
              className="flex items-center text-neutral-400"
              rel="noopener noreferrer"
            >
              <SiGithub className="mr-1" />
              kmees
            </a>
          </div>
          <a
            href="https://www.buymeacoffee.com/kmees"
            target="_blank"
            className="flex items-center gap-x-2"
            rel="noopener noreferrer"
          >
            <SiBuymeacoffee /> buy me a coffee
          </a>
        </div>
      </div>
    </div>
  )
}
