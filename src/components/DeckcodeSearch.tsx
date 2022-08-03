import { normalizeDeckcode, validateDeckcode } from '@/common/deckcode'
import cx from 'classnames'
import { useRouter } from 'next/router'
import type { FC, KeyboardEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { MdSearch } from 'react-icons/md'

export const DeckcodeSearch: FC<{ big?: boolean }> = ({ big }) => {
  const inputElement = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [deckcode, setDeckcode] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)

  const valid = deckcode && (deckcode.length < 8 || validateDeckcode(deckcode))
  const invalid = !valid
  const touched = !!deckcode

  useEffect(() => {
    if (inputElement.current && big) {
      inputElement.current.focus()
    }
  }, [big])

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await navigateToDeckcode()
    }
  }

  const handleFocus = () => inputElement.current?.select()

  const navigateToDeckcode = () => {
    if (!navigating) {
      setNavigating(true)
      router
        .push(`/[deckcode]`, `/${encodeURIComponent(deckcode!)}`)
        .then(() => setNavigating(false))
    }
  }

  return (
    <div className={cx('flex', big ? 'w-full' : 'w-96', big ? 'h-16' : 'h-auto')}>
      <input
        ref={inputElement}
        className={cx('px-4 flex-1 w-64 bg-slate-900 border-2 border-slate-700', {
          'border-red-500': touched && invalid,
          'text-xl': big,
        })}
        placeholder="Enter deckcode or share code"
        value={deckcode ?? ''}
        onChange={(ev) => setDeckcode(normalizeDeckcode(ev.target.value) ?? '')}
        onKeyDown={handleKeydown}
        onFocus={handleFocus}
      />
      <button
        disabled={invalid || navigating}
        className={cx('btn disabled:bg-slate-800 disabled:text-slate-600 px-2', {
          'px-6 text-xl': big,
        })}
        onClick={navigateToDeckcode}
      >
        <MdSearch size={big ? 32 : 24} />
      </button>
    </div>
  )
}
