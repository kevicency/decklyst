import { Dialog } from '@headlessui/react'
import { signIn } from 'next-auth/react'
import type { FC } from 'react'
import { Backdrop, InnerTransition, OuterTransition } from './Dialog'
import { DiscordIcon } from './Icons'

export const LikeDeckDialog: FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  return (
    <OuterTransition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        <Backdrop />
        <InnerTransition>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto flex max-h-full w-80 min-w-fit flex-col overflow-hidden border-2 border-gray-400 bg-alt-900">
              <Dialog.Title className="bg-alt-1000 py-3 px-4 text-3xl font-thin text-gray-100">
                Sign In
              </Dialog.Title>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-y-4">
                  <div className="mb-2 text-lg">You must be signed in to like a deck!</div>
                  <button
                    onClick={() =>
                      signIn('discord', {
                        callbackUrl: window.location.href,
                      })
                    }
                    className="btn-outline shrink-0"
                  >
                    <DiscordIcon />
                    Sign in with Discord
                  </button>
                  <div className="mt-4 flex justify-end gap-x-2 border-t border-gray-600 p-4">
                    <button className="btn-outline shrink-0" onClick={onClose}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </InnerTransition>
      </Dialog>
    </OuterTransition>
  )
}
