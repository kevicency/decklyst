import { useDeck } from '@/context/useDeck'
import { useDeckActions, useDeckImage } from '@/hooks/useDeckActions'
import { Dialog, Transition } from '@headlessui/react'
import cx from 'classnames'
import type { FC } from 'react'
import { Fragment } from 'react'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'
import { DeckInfograph } from '../DeckInfograph'
import { CopyIcon, DoneIcon, DownloadDoneIcon, ImageIcon, LinkIcon } from '../Icons'
import { OneTimeButton } from '../OneTimeButton'

const Backdrop = () => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed inset-0 bg-gray-900/75" aria-hidden="true" />
  </Transition.Child>
)
export const ShareDeckDialog: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const deck = useDeck()
  const { imageDataUri, imageFilename } = useDeckImage()
  const { copyDeckImageUrl, copyDeckcode, copyDeckUrl } = useDeckActions()

  return (
    <Transition
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog onClose={onClose} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Backdrop />
        {/* Full-screen container to center the panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto flex max-h-full min-w-fit max-w-min flex-col overflow-hidden bg-gray-1000">
              <div
                className={cx(
                  'relative flex shrink-0 items-end justify-between gap-x-8',
                  'px-4 py-3',
                  // 'bg-gradient-to-r from-gray-850 to-alt-900',
                  'bg-alt-800',
                  `border-b border-${deck.faction}`,
                )}
              >
                <Dialog.Title className="text-2xl">Share this deck</Dialog.Title>
                <div className="flex gap-x-2">
                  <OneTimeButton onClick={copyDeckcode} timeout={2500}>
                    {(copied) => (
                      <>
                        {copied ? <DoneIcon /> : <CopyIcon />}
                        Copy deckcode
                      </>
                    )}
                  </OneTimeButton>
                  <OneTimeButton onClick={copyDeckUrl} timeout={2500}>
                    {(copied) => (
                      <>
                        {copied ? <DoneIcon /> : <LinkIcon />}
                        Copy decklink
                      </>
                    )}
                  </OneTimeButton>
                  <OneTimeButton onClick={copyDeckImageUrl} timeout={2500}>
                    {(copied) => (
                      <>
                        {copied ? <DoneIcon /> : <LinkIcon />}
                        Copy imagelink
                      </>
                    )}
                  </OneTimeButton>
                  <div className="w-2" />
                  <OneTimeButton
                    href={imageDataUri ?? undefined}
                    download={imageFilename}
                    disabled={!imageDataUri}
                  >
                    {(isDownloading) =>
                      imageDataUri ? (
                        <>
                          {isDownloading ? <DownloadDoneIcon /> : <ImageIcon />}
                          Save as image &nbsp;
                        </>
                      ) : (
                        <>
                          <BounceLoader
                            size={18}
                            speedMultiplier={0.66}
                            color={colors.gray['400']}
                            className="mr-2"
                          />
                          <span className="text-gray-400">Generating image</span>
                        </>
                      )
                    }
                  </OneTimeButton>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DeckInfograph />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
