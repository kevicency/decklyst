import cx from 'classnames'
import { useRouter } from 'next/router'
import type { FC, KeyboardEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { normalizeDeckcode, validateDeckcode } from '../common/deckcode'

export const DeckcodeSearch: FC<{ big?: boolean }> = ({ big }) => {
  const inputElement = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [deckcode, setDeckcode] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)

  const valid = deckcode && validateDeckcode(deckcode)
  const invalid = !valid
  const touched = deckcode !== null

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
    <div className={cx('flex', big ? 'w-full' : 'w-72', big ? 'h-16' : 'h-auto')}>
      <input
        ref={inputElement}
        className={cx('px-4 flex-1 w-64 bg-slate-900 border-2 border-slate-700', {
          'border-red-500': touched && invalid,
          'text-xl': big,
        })}
        placeholder="Enter deckcode"
        value={deckcode ?? ''}
        onChange={(ev) => setDeckcode(normalizeDeckcode(ev.target.value) ?? '')}
        onKeyDown={handleKeydown}
        onFocus={handleFocus}
      />
      <button
        disabled={invalid || navigating}
        className={
          'bg-slate-600 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold px-4 text-xl'
        }
        onClick={navigateToDeckcode}
      >
        Go
      </button>
    </div>
  )
}
