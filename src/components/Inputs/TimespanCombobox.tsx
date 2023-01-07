import { Listbox } from '@headlessui/react'
import type { FC } from 'react'
import type { Timespan } from '../Decksearch'
import { ChevronDownIcon } from '../Icons'

const labels: Record<NonNullable<Timespan>, string> = {
  all: 'All time',
  month: 'This month',
  week: 'This week',
  day: 'Today',
}

export const TimespanCombobox: FC<{
  value: Timespan
  onChange: (value: Timespan) => void
  disabled?: boolean
}> = ({ value, onChange, disabled }) => {
  return (
    <Listbox disabled={disabled} value={value} onChange={onChange} as="div" className="listbox">
      <div className="listbox-input">
        <Listbox.Button disabled={disabled} className="text-gray-300">
          {labels[value]}
        </Listbox.Button>
        <Listbox.Button disabled={disabled}>
          <ChevronDownIcon />
        </Listbox.Button>
      </div>
      <div className="listbox-options">
        <Listbox.Options>
          {Object.entries(labels).map(([value, label]) => (
            <Listbox.Option key={value} value={value}>
              {label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
