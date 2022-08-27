import { isShareOrDeckcode } from '@/common/utils'
import { BuildIcon, CompareIcon, ImportIcon, SearchIcon, ShareIcon } from '@/components/Icons'
import { factions } from '@/data/cards'
import { defaultDeckcode, validateDeckcode } from '@/data/deckcode'
import cx from 'classnames'
import { startCase } from 'lodash'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
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
  const Tag = disabled ? 'span' : 'a'
  return (
    <Link href={href}>
      <Tag
        className={cx(
          'flex items-center inline-block text-2xl pl-4 font-light border-l-4 py-1',
          active ? 'border-teal-400' : 'border-transparent',
          disabled && 'disabled',
        )}
      >
        {Icon && <Icon className={cx('mr-2', iconClassName)} />}
        {children}
      </Tag>
    </Link>
  )
}
const AppSidebarInput: FC<{
  icon: IconType
  validate?: (value: string) => boolean
  onEnter: (value: string) => Promise<any>
}> = ({ icon: Icon, validate, onEnter }) => {
  const [value, setValue] = useState('')
  const [active, setActive] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const valid = validate?.(value) ?? true

  const handleAction = async () => {
    setActive(true)
    try {
      await onEnter(value)
      setError(null)
      setValue('')
    } catch (e) {
      setError(e as Error)
    } finally {
      setActive(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          className={cx(
            'transition-colors',
            'w-full border-b-2 pl-5 pr-10 py-2 bg-zinc-700',
            error ? 'border-red-500' : 'border-zinc-400 focus:border-zinc-200',
          )}
          placeholder="Enter deck/share code"
          value={value}
          onFocus={(ev) => ev.target.select()}
          onChange={(ev) => setValue(ev.target.value)}
          onKeyDown={async (ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              await handleAction()
            }
          }}
        />
        <button
          disabled={!valid || active}
          className={cx(
            'bg-zinc-600 hover:bg-teal-600',
            'disabled:bg-transparent disabled:text-zinc-500',
            'absolute right-0.5 top-0 bottom-0.5 w-10',
            'flex justify-center items-center',
          )}
          onClick={handleAction}
        >
          <Icon className="pl-0.5" size={24} />
        </button>
      </div>
      <div className="text-red-500 text-xs py-0.5 px-10">{error?.message}&nbsp;</div>
    </div>
  )
}
export const AppSidebarMenu: FC<{ children: any }> = ({ children }) => (
  <ul className="pl-6 text-lg -mt-5">
    <li className="border-l border-zinc-400 pl-4 -mb-2">&nbsp;</li>
    {Children.map(children, (child, i) => (
      <li key={child.key ?? i} className="border-l border-zinc-400 pl-4">
        {child}
      </li>
    ))}
  </ul>
)
export const AppSidebar: FC = () => {
  const router = useRouter()

  const navigateToDeckcode = async (code: string) =>
    await router.push(`/[deckcode]`, `/${encodeURIComponent(code!)}`)

  const navigateToBuilder = async (code: string) => {
    const url = {
      pathname: '/build/[deckcode]',
      query: { deckcode: null as string | null },
    }
    if (validateDeckcode(code)) {
      url.query.deckcode = code
    } else {
      const res = await fetch(`/api/deckinfo/${code}`)

      if (res.ok) {
        url.query.deckcode = (await res.json()).deckcode
      }
    }
    return url.query.deckcode
      ? router.push(url)
      : Promise.reject(new Error('Invalid deck/share code'))
  }

  return (
    <div className="flex flex-col w-60 h-screen overflow-hidden bg-zinc-800 border-r border-zinc-700">
      <h1 className="mt-8 mb-12 text-center">
        <Link href="/">
          <a className="text-5xl font-thin">Decklyst</a>
        </Link>
      </h1>
      <div className="flex flex-col gap-y-8">
        <div>
          <AppSidebarLink href="/" active={router.pathname === '/'} icon={ShareIcon}>
            Share
          </AppSidebarLink>
          <AppSidebarInput
            icon={SearchIcon}
            onEnter={navigateToDeckcode}
            validate={isShareOrDeckcode}
          />
          <AppSidebarMenu>
            <Link href={`/?tab=trending`}>
              <a>Trending</a>
            </Link>
            <Link href={`/?tab=most-viewed`}>
              <a>Most viewed</a>
            </Link>
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
            icon={ImportIcon}
            onEnter={navigateToBuilder}
            validate={isShareOrDeckcode}
          />
          <AppSidebarMenu>
            {factions.map((faction) => (
              <Link key={faction} href={`/build/${defaultDeckcode(faction)}`}>
                <a className={`hover:text-${faction}`}>{startCase(faction)}</a>
              </Link>
            ))}
          </AppSidebarMenu>
        </div>
        <div>
          <AppSidebarLink
            href="/compare"
            active={router.pathname === '/compare'}
            disabled
            icon={CompareIcon}
          >
            Compare
          </AppSidebarLink>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex justify-center border-t border-zinc-600 py-4 px-8 bg-black-900">
        <div className="text-sm text-black-500">
          <div className="flex gap-x-2 items-center">
            <HiCode /> by{' '}
            <a
              href="https://github.com/kmees"
              target="_blank"
              className="flex items-center text-black-400"
              rel="noreferrer"
            >
              <SiGithub className="mr-1" />
              kmees
            </a>
          </div>
          <a
            href="https://www.buymeacoffee.com/kmees"
            target="_blank"
            className="flex gap-x-2 items-center"
            rel="noreferrer"
          >
            <SiBuymeacoffee /> buy me a coffee
          </a>
        </div>
      </div>
    </div>
  )
}
