import { isShareOrDeckcode } from '@/common/utils'
import { DiscordIcon, SearchIcon } from '@/components/Icons'
import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export const AppHeader = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [navigating, setNavigating] = useState(false)
  const [{ isMobile }] = useAppShell()
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  const handleSearch = async () => {
    if (isMobile && search === '') {
      setShowMobileSearch(true)
      setTimeout(() => {
        searchInput.current?.focus()
      }, 1)
      return
    }

    if (!navigating) {
      setShowMobileSearch(false)
      setNavigating(true)
      try {
        await router.push({ pathname: '/[code]', query: { code: search } })
      } finally {
        setNavigating(false)
        setSearch('')
      }
    }
  }

  const isSearchValid = isShareOrDeckcode(search)

  return (
    <div className="z-20 flex w-full items-center border-b border-gray-700 bg-gradient-to-r from-gray-900 to-alt-900 shadow-header grid-in-header">
      {isMobile ? (
        <>
          <div className="flex flex-1 items-stretch justify-end">
            <button
              aria-label="Search"
              className={cx(
                'bg-transparent text-gray-300 hover:bg-transparent ',
                'w-12',
                'flex items-center justify-center',
              )}
              onClick={handleSearch}
            >
              <SearchIcon className="pl-0.5" size={24} />
            </button>
          </div>
          <div
            className={cx(
              `absolute right-12 top-0 transition-all`,
              showMobileSearch ? `w-[calc(100%-theme('spacing.12'))]` : 'hidden w-0',
            )}
          >
            <input
              ref={searchInput}
              className={cx('w-full bg-gray-1000 py-4 ', 'pl-4 pr-2')}
              placeholder={'Search for a deckcode or sharecode'}
              value={search ?? ''}
              onFocus={(ev) => ev.currentTarget?.select()}
              onBlur={() => setShowMobileSearch(false)}
              onChange={(ev) => setSearch(ev.target.value?.trim())}
              onKeyDown={async (ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault()
                  await handleSearch()
                  return false
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="relative flex h-full flex-1 items-stretch transition-colors">
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
              className={cx(
                'w-full bg-transparent py-2 focus:bg-gray-850 focus:bg-opacity-30',
                'pl-12 pr-2',
              )}
              placeholder={'Search for a deckcode or sharecode'}
              value={search ?? ''}
              onFocus={(ev) => ev.currentTarget?.select()}
              onChange={(ev) => setSearch(ev.target.value?.trim())}
              onKeyDown={async (ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault()
                  await handleSearch()
                  return false
                }
              }}
            />
          </div>
          <div className="flex justify-center gap-x-4 px-4 font-semibold"></div>
          <div className="flex shrink-0 items-center justify-end gap-x-4 px-4">
            <Link href="https://discord.gg/zYx5bqZszj" className="text-xl" target="_blank">
              <DiscordIcon />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
