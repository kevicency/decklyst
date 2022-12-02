import type { DeckExpanded } from '@/data/deck'
import { Dialog } from '@headlessui/react'
import type { WithRequired } from '@tanstack/react-query'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Backdrop, InnerTransition, OuterTransition } from './Dialog'

export const ConfirmDeleteDialog: FC<{
  open: boolean
  onClose: () => void
  deck?: WithRequired<DeckExpanded, 'meta'> | null
  onDelete: () => Promise<void>
}> = ({ open, onClose, deck, onDelete }) => {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (open && confirmButtonRef.current) {
        confirmButtonRef.current.focus()
      }
    }, 250)
  }, [open])

  return (
    <OuterTransition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        <Backdrop />
        <InnerTransition>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto flex max-h-full w-80 min-w-fit flex-col overflow-hidden border-2 border-danger bg-alt-900">
              <Dialog.Title className="bg-alt-1000 py-3 px-4 text-3xl font-thin text-gray-100">
                Confirm delete
              </Dialog.Title>
              <div
                className="flex-1 overflow-y-auto p-4"
                onSubmit={async (ev) => {
                  await handleDelete()
                  onClose()
                  ev.preventDefault()
                }}
              >
                <div className="mb-6 text-lg">
                  Confirm to delete the deck &nbsp;
                  <span className={`text-${deck?.faction} font-semibold`}>
                    {deck?.meta.sharecode}
                  </span>
                  <div className="mt-4 text-center">
                    <span className="text-xl font-semibold">{deck?.title}</span>
                  </div>
                </div>
                <div></div>
                <div className="flex justify-end gap-x-2 border-t border-gray-600 p-4">
                  <button className="btn-outline shrink-0 " onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    autoFocus
                    className="btn shrink-0"
                    disabled={deleting}
                    onClick={async () => {
                      await handleDelete()
                      onClose()
                    }}
                    ref={confirmButtonRef}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </InnerTransition>
      </Dialog>
    </OuterTransition>
  )
}
