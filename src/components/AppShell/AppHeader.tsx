import { isShareOrDeckcode } from '@/common/utils'
import { DiscordIcon, SearchIcon } from '@/components/Icons'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const AppHeader = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [navigating, setNavigating] = useState(false)

  const handleSearch = async () => {
    if (!navigating) {
      setNavigating(true)
      try {
        await router.push(`/[code]`, `/${encodeURIComponent(search!)}`)
      } finally {
        setNavigating(false)
      }
    }
  }

  const isSearchValid = isShareOrDeckcode(search)

  return (
    <div className="z-20 flex w-full items-center border-b border-gray-700 bg-gradient-to-r from-gray-900 to-alt-900 shadow-header grid-in-header">
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
          className={cx('w-full bg-transparent py-2 pl-5 focus:bg-gray-850', 'pl-12 pr-2')}
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
    </div>
  )
}
