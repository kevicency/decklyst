import { useDeck } from '@/context/useDeck'
import { useDeckActions, useDeckImage } from '@/hooks/useDeckActions'
import { Dialog } from '@headlessui/react'
import cx from 'classnames'
import type { FC } from 'react'
import { BounceLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'
import { useWindowSize } from 'usehooks-ts'
import { DeckInfograph } from '../DeckInfograph'
import { Backdrop, InnerTransition, OuterTransition } from '../Dialog'
import { DoneIcon, DownloadDoneIcon, ImageIcon, LinkIcon } from '../Icons'
import { OneTimeButton } from '../OneTimeButton'

export const ShareDeckDialog: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const deck = useDeck()
  const { imageDataUri, imageFilename } = useDeckImage({ renderOnly: !open })
  const { copyDeckImageUrl, copyDeckUrl } = useDeckActions()
  const { width } = useWindowSize()

  return (
    <OuterTransition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Backdrop />
        {/* Full-screen container to center the panel */}
        <InnerTransition>
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
                <div className="flex flex-wrap justify-end gap-2">
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
                {width < 960 ? (
                  <img src={imageDataUri ?? ''} alt="Deck image" />
                ) : (
                  <DeckInfograph />
                )}
              </div>
            </Dialog.Panel>
          </div>
        </InnerTransition>
      </Dialog>
    </OuterTransition>
  )
}
