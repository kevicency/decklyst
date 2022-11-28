import { GeneralLink } from '@/components/Deckbuilder/GeneralLink'
import { ImportIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { cards, factions } from '@/data/cards'
import { validateDeckcode } from '@/data/deckcode'
import cx from 'classnames'
import { groupBy, startCase } from 'lodash'
import { useRouter } from 'next/router'
import type { FC, FormEventHandler } from 'react'
import { useMemo, useState } from 'react'

export const DeckbuilderIndexPage: FC = () => {
  const router = useRouter()
  const generalsByFaction = useMemo(() => {
    const generals = cards.filter((card) => card.cardType === 'General')
    return groupBy(generals, (card) => card.faction)
  }, [])
  const [importDeckcode, setImportDeckcode] = useState('')

  const handleImportDeckcode: FormEventHandler = async (ev) => {
    ev.preventDefault()

    await router.push({
      pathname: '/build/[deckcode]',
      query: { deckcode: importDeckcode, base: importDeckcode },
    })
  }

  return (
    <div className="bg-image-deckbuilder flex flex-1 flex-col overflow-hidden grid-in-main">
      <PageHeader>
        <div className="text-3xl font-light">Deckbuilder</div>
        <form
          className="relative -mb-4 flex max-w-xl flex-1 justify-center"
          onSubmit={handleImportDeckcode}
        >
          <input
            className="page-header-input w-full pl-12 "
            placeholder="Import deckcode"
            value={importDeckcode}
            onFocus={(ev) => ev.currentTarget?.select()}
            onChange={(ev) => setImportDeckcode(ev.target.value?.trim())}
          />
          <button
            aria-label="Search"
            disabled={!validateDeckcode(importDeckcode)}
            className={cx(
              'bg-transparent text-gray-300 hover:bg-accent-800 disabled:hover:bg-transparent',
              'disabled:text-gray-500',
              'absolute bottom-0.5 left-0 top-0 w-11',
              'flex items-center justify-center',
            )}
            type="submit"
          >
            <ImportIcon className="pl-0.5" size={24} />
          </button>
        </form>
        <div className="text-lg text-gray-200">Pick a general to start</div>
      </PageHeader>
      <div className="overflow-y-auto">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-center pt-12 text-center">
          {factions.map((faction) => (
            <div key={faction} className="mb-16 flex flex-col">
              <h3 className={`text-2xl text-${faction} mb-4 font-mono`}>{startCase(faction)}</h3>
              <div className="ml-8 mr-3 flex justify-around gap-x-2">
                {generalsByFaction[faction].map((general) => (
                  <GeneralLink key={general.id} general={general} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeckbuilderIndexPage
