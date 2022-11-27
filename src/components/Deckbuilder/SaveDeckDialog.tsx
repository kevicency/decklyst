import { useDeck } from '@/context/useDeck'
import type { Archetype, DeckExpanded } from '@/data/deck'
import { archetypes } from '@/data/deck'
import { trpc } from '@/utils/trpc'
import { Dialog } from '@headlessui/react'
import { identity, startCase } from 'lodash'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Backdrop, InnerTransition, OuterTransition } from '../Dialog'
import { NewIcon, SaveIcon } from '../Icons'
import { DeckTitleInput } from './DeckTitleInput'

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
  const [visible, setVisible] = useState<boolean>(baseDeck?.meta?.private ?? false)

  const createSaveHandler =
    (update: boolean = false) =>
    async () => {
      await upsertDecklyst({
        sharecode: update ? baseDeck?.meta?.sharecode : undefined,
        deckcode: deck.deckcode,
        archetype,
        private: !visible,
      })
      await router.push({ pathname: '/decks/[code]', query: { code: deck.deckcode } })
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
              <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">
                <label>
                  Title
                  <DeckTitleInput />
                </label>
                <label>
                  Archetype
                  <select
                    value={archetype ?? ''}
                    className="w-full bg-alt-850 px-2 py-2"
                    onChange={(ev) => setArchetype(ev.target.value as Archetype)}
                  >
                    <option value="">None</option>
                    {archetypes
                      .map(identity)
                      .sort()
                      .map((value) => (
                        <option key={value} value={value}>
                          {startCase(value)}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Tags
                  <input disabled placeholder="TODO" className="w-full bg-alt-800 px-2 py-2" />
                </label>
                <div>
                  Visibility
                  <div className="text-xs text-gray-400">
                    Private decks are not visible to other users
                  </div>
                  <label className="mt-1 block">
                    <input
                      type="checkbox"
                      className="mx-2"
                      checked={!visible}
                      onChange={(ev) => setVisible(!ev.target.checked)}
                    />
                    Private
                  </label>
                </div>
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
