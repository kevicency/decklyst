import { useDeckcode } from '@/context/useDeckcode'
import { debounce } from 'lodash'
import type { FC } from 'react'
import { useCallback, useState } from 'react'

export const DeckTitleInput: FC = () => {
  const [{ title }, mutators] = useDeckcode()
  const [value, setValue] = useState(title)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTitle = useCallback(debounce(mutators.updateTitle, 500), [mutators.updateTitle])

  return (
    <input
      className="w-full bg-alt-800 px-2 py-2"
      placeholder="Untitled"
      autoFocus
      value={value}
      onChange={(ev) => {
        setValue(ev.target.value)
        updateTitle(ev.target.value)
      }}
    />
  )
}
