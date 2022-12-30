import { trpc } from '@/utils/trpc'
import { Combobox } from '@headlessui/react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { ChevronDownIcon } from '../Icons'
import { OptionContent } from '../OptionContent'

export const AuthorCombobox: FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const [query, setQuery] = useState('')
  const { data: authors } = trpc.userProfile.all.useQuery({ onlyAuthors: true })
  const options = useMemo(
    () =>
      (authors ?? []).sort((a, b) => {
        const aName = a.name?.toLocaleLowerCase() ?? ''
        const bName = b.name?.toLocaleLowerCase() ?? ''
        return aName.localeCompare(bName)
      }),
    [authors],
  )

  const authorName = (value: string) => {
    return authors?.find((author) => author.id === value)?.name ?? ''
  }

  console.log({ value })
  return (
    <Combobox value={value} onChange={onChange} as="div" className="combobox">
      <div className="combobox-input">
        <Combobox.Input
          key={authors?.length}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={authorName}
        />
        <Combobox.Button>
          <ChevronDownIcon />
        </Combobox.Button>
      </div>

      <div className="combobox-options">
        <Combobox.Options>
          {options.map((author) => (
            <Combobox.Option key={author.id} value={author.id}>
              <OptionContent>{author.name}</OptionContent>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )

  // const { data: authors }
  // const options = useMemo(
  //   () =>
  // )
}
