import { allTags, humanizeTag } from '@/data/deck'
import { Combobox } from '@headlessui/react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { ChevronDownIcon } from './Icons'
import { OptionContent } from './OptionContent'

export const TagsCombobox: FC<{
  value: string[]
  onChange: (value: string[]) => void
  tags?: string[]
}> = ({ value, onChange, tags }) => {
  let [query, setQuery] = useState('')
  const options = useMemo(
    () =>
      (tags ?? allTags)
        .filter((tag) => (query ? new RegExp(query, 'i').test(tag) : true))
        .sort((a, b) => a.localeCompare(b)),
    [tags, query],
  )

  return (
    <Combobox multiple value={value} onChange={onChange} as="div" className="combobox">
      <div className="combobox-input">
        <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Button>
          <ChevronDownIcon />
        </Combobox.Button>
      </div>

      <div className="combobox-options">
        <Combobox.Options>
          {options.map((tag) => (
            <Combobox.Option key={tag} value={tag}>
              <OptionContent>{humanizeTag(tag)}</OptionContent>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
