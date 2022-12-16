import { useDeck } from '@/context/useDeck'
import type { DeckExpanded } from '@/data/deck'
import { trpc } from '@/utils/trpc'
import { Dialog, RadioGroup } from '@headlessui/react'
import { Archetype, Privacy } from '@prisma/client'
import cx from 'classnames'
import { startCase } from 'lodash'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Backdrop, InnerTransition, OuterTransition } from '../Dialog'
import { NewIcon, SaveIcon } from '../Icons'
import { Tag } from '../Tag'
import { TagsCombobox } from '../TagsCombobox'
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
  const { decklyst: utils } = trpc.useContext()

  const [archetype, setArchetype] = useState<Archetype | null>(
    (baseDeck?.meta?.archetype as Archetype) ?? null,
  )
  const [privacy, setPrivacy] = useState<Privacy>(baseDeck?.meta?.privacy ?? 'unlisted')
  const [tags, setTags] = useState<string[]>(baseDeck?.meta?.tags ?? [])

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
            <Dialog.Panel className="mx-auto flex max-h-full w-1/4 min-w-[32rem] flex-col overflow-hidden border-2 border-gray-700 bg-alt-900">
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
                  <TagsCombobox
                    value={tags}
                    onChange={(value) => {
                      setTags(value)
                    }}
                  />
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
