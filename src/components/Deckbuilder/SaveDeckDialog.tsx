import { useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { allTags, humanizeTag } from '@/data/deck'
import { trpc } from '@/utils/trpc'
import { Combobox, Dialog, RadioGroup } from '@headlessui/react'
import { Archetype, Privacy } from '@prisma/client'
import cx from 'classnames'
import { startCase } from 'lodash'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Backdrop, InnerTransition, OuterTransition } from '../Dialog'
import { NewIcon, SaveIcon } from '../Icons'
import { Tag } from '../Tag'
import { DeckTitleInput } from './DeckTitleInput'

export const FormControl: FC<{ label: ReactNode; children: ReactNode }> = ({ children, label }) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-y-3">
      <label className="text-semibold flex items-center justify-between gap-x-2 text-lg font-semibold text-gray-300">
        <div className="h-0.5 w-4 bg-gray-600" />
        <span className="text-sm font-semibold uppercase text-gray-100">{label}</span>
        <div className="h-0.5 flex-1 bg-gray-600" />
      </label>
      {children}
    </div>
  )
}

export const SaveDeckDialog: FC<{
  open: boolean
  onClose: () => void
  baseDeck?: DeckExpanded
}> = ({ open, onClose, baseDeck }) => {
  const router = useRouter()
  const deck = useDeck()
  const { mutateAsync: upsertDecklyst, isLoading: isSaving } = trpc.decklyst.upsert.useMutation()

  const [archetype, setArchetype] = useState<Archetype | null>(
    (baseDeck?.meta?.archetype as Archetype) ?? null,
  )
  const [privacy, setPrivacy] = useState<Privacy>(baseDeck?.meta?.privacy ?? 'unlisted')
  const [tags, setTags] = useState<string[]>(baseDeck?.meta?.tags ?? [])
  const [tagQuery, setTagQuery] = useState('')

  useEffect(() => {
    if (open) {
      setArchetype(baseDeck?.meta?.archetype ?? null)
      setPrivacy(baseDeck?.meta?.privacy ?? 'unlisted')
      setTags(baseDeck?.meta?.tags ?? [])
    }
  }, [baseDeck?.meta?.archetype, baseDeck?.meta?.privacy, baseDeck?.meta?.tags, open])

  const createSaveHandler =
    (update: boolean = false) =>
    async () => {
      const updated = await upsertDecklyst({
        sharecode: update ? baseDeck?.meta?.sharecode : undefined,
        deckcode: deck.deckcode,
        archetype,
        privacy,
        tags,
      })
      await router.push({ pathname: '/decks/[code]', query: { code: updated.sharecode } })
      onClose()
    }

  const handleClose = useCallback(() => {
    if (isSaving) return
    onClose()
  }, [onClose, isSaving])

  return (
    <OuterTransition show={open}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Backdrop />
        <InnerTransition>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto flex max-h-full w-1/4 min-w-fit flex-col overflow-hidden border-2 border-gray-700 bg-alt-900">
              <Dialog.Title className="bg-alt-1000 py-3 px-6 text-3xl font-thin text-gray-100">
                Save deck
              </Dialog.Title>
              <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4 ">
                <FormControl label="Title">
                  <DeckTitleInput />
                </FormControl>

                <RadioGroup value={privacy} onChange={setPrivacy}>
                  <FormControl label={<RadioGroup.Label>Privacy</RadioGroup.Label>}>
                    <div className="flex justify-center gap-x-1 py-2">
                      {Object.values(Privacy).map((value) => (
                        <RadioGroup.Option key={value} value={value} className="">
                          {({ checked }) => (
                            <span
                              className={cx(
                                'inline-block px-4 py-2',
                                checked ? 'bg-accent-600' : 'bg-gray-600',
                              )}
                            >
                              {startCase(value.toLocaleLowerCase())}
                            </span>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">
                      {privacy === 'private' && 'Private decks are not visible to other users'}
                      {privacy === 'unlisted' &&
                        'Unlisted decks are hidden from the deck library but can be shared'}
                      {privacy === 'public' && 'Public decks are visible to all users'}
                    </div>
                  </FormControl>
                </RadioGroup>
                <FormControl label="Archetype">
                  <select
                    value={archetype ?? ''}
                    className="w-full bg-alt-850 px-2 py-2"
                    onChange={(ev) => setArchetype(ev.target.value as Archetype)}
                  >
                    <option value="">None</option>
                    {Object.values(Archetype)
                      .sort()
                      .map((value) => (
                        <option key={value} value={value}>
                          {startCase(value)}
                        </option>
                      ))}
                  </select>
                </FormControl>
                <FormControl label="Tags">
                  <Combobox
                    multiple
                    value={tags}
                    onChange={(value) => {
                      setTags(value)
                      setTagQuery('')
                    }}
                    as="div"
                  >
                    <div className="relative">
                      <span className="relative inline-flex w-full flex-row overflow-hidden">
                        <Combobox.Input
                          value={tagQuery}
                          onChange={(e) => setTagQuery(e.target.value)}
                          className="flex-1 border-none bg-alt-800 px-2 py-2 outline-none"
                        />
                        <Combobox.Button className="cursor-default border-l border-gray-600 bg-alt-850 px-1 text-accent-600 focus:outline-none">
                          <span className="pointer-events-none flex items-center px-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Combobox.Button>
                      </span>

                      <div className="absolute top-0 -mt-1 w-full -translate-y-full rounded-md bg-alt-1000 shadow-lg">
                        <Combobox.Options className="shadow-xs relative max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5">
                          {allTags.map((tag) => (
                            <Combobox.Option
                              key={tag}
                              value={tag}
                              className={({ active }) => {
                                return cx(
                                  'relative cursor-default select-none py-2 pl-3 pr-9 text-gray-100 focus:outline-none',
                                  active ? 'bg-accent-600' : '',
                                )
                              }}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span
                                    className={cx(
                                      'block truncate',
                                      selected ? 'font-semibold' : 'font-normal',
                                    )}
                                  >
                                    {humanizeTag(tag)}
                                  </span>
                                  {selected && (
                                    <span
                                      className={cx(
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                        active ? 'text-white' : 'text-indigo-600',
                                      )}
                                    >
                                      <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>
                    </div>
                  </Combobox>
                  <div className="mt-1 flex min-h-[4rem] flex-wrap items-start justify-start gap-1">
                    {tags.map((tag) => (
                      <Tag
                        key={tag}
                        tag={tag}
                        onDelete={() => setTags((value) => value.filter((x) => x !== tag))}
                      />
                    ))}
                  </div>
                </FormControl>
              </div>
              <div className="flex justify-end gap-x-2 border-t border-gray-600 p-4">
                {baseDeck?.meta?.sharecode ? (
                  <>
                    <button
                      className="btn btn-outline shrink-0"
                      onClick={createSaveHandler()}
                      disabled={isSaving}
                    >
                      <NewIcon />
                      Save as new
                    </button>
                    <button
                      className="btn shrink-0 "
                      onClick={createSaveHandler(true)}
                      disabled={isSaving}
                    >
                      <SaveIcon />
                      Update deck
                    </button>
                  </>
                ) : (
                  <button
                    className="btn shrink-0 "
                    onClick={createSaveHandler()}
                    disabled={isSaving}
                  >
                    <SaveIcon />
                    Save deck
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </InnerTransition>
      </Dialog>
    </OuterTransition>
  )
}
