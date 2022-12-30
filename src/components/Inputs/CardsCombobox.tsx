import type { CardData } from '@/data/cards'
import { allCards } from '@/data/cards'
import { Combobox } from '@headlessui/react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { ChevronDownIcon } from '../Icons'
import { OptionContent } from '../OptionContent'

export const CardsCombobox: FC<{
  value: number[]
  onChange: (value: number[]) => void
  cards?: CardData[]
}> = ({ value, onChange, cards }) => {
  const [query, setQuery] = useState('')
  const options = useMemo(
    () =>
      (cards ?? allCards)
        .filter((card) => card.cardType !== 'General')
        .filter((card) => (query ? new RegExp(query, 'i').test(card.name) : true))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [cards, query],
  )

  return (
    <Combobox multiple value={value} onChange={onChange} as="div" className="combobox">
      <div className="combobox-input">
        <Combobox.Input value={query} onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Button>
          <ChevronDownIcon />
        </Combobox.Button>
      </div>

      <div className="combobox-options">
        <Combobox.Options>
          {options.map((card) => (
            <Combobox.Option key={card.id} value={card.id}>
              <OptionContent>{card.name}</OptionContent>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
