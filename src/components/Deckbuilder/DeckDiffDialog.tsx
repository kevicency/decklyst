import type { CardDiff, DeckDiff } from '@/hooks/useDeckDiff'
import { Dialog } from '@headlessui/react'
import { get, startCase } from 'lodash'
import type { FC } from 'react'
import { Fragment } from 'react'
import { CardCount } from '../DeckDiff/CardCount'
import { CardItem } from '../DeckDiff/CardItem'
import { Delta } from '../DeckDiff/Delta'
import { Row } from '../DeckDiff/Row'
import { Backdrop, InnerTransition, OuterTransition } from '../Dialog'

export const DeckDiffDialog: FC<{ open: boolean; onClose: () => void; deckDiff: DeckDiff }> = ({
  open,
  onClose,
  deckDiff,
}) => {
  const leftDeck = deckDiff.$left
  const rightDeck = deckDiff.$right

  return (
    <OuterTransition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        <Backdrop />
        <InnerTransition>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto flex max-h-full w-[128rem] min-w-fit max-w-min flex-col overflow-hidden border-2 border-gray-700 bg-alt-900">
              <Dialog.Title className="bg-alt-1000 py-3 px-6 text-3xl font-thin text-gray-100">
                Deck changes
              </Dialog.Title>
              <div className="flex-1 overflow-y-auto p-4">
                {['minions', 'spells', 'artifacts'].map((path) => {
                  const diffCards = (get(deckDiff, path) as CardDiff[]).filter(
                    (diff) => diff.delta !== 0,
                  )
                  return diffCards.length ? (
                    <Fragment key={path}>
                      <Row className="text mt-6 mb-4">
                        <CardCount
                          count={get(leftDeck.counts, path)}
                          title={startCase(path)}
                          faction={leftDeck?.faction}
                        />
                        <Delta value={get(deckDiff.deltas, path)} big />
                        <CardCount
                          count={get(rightDeck.counts, path)}
                          title={startCase(path)}
                          faction={leftDeck?.faction}
                          mirrored
                        />
                      </Row>
                      {diffCards.map(({ card, left, right, delta }: CardDiff) => (
                        <Row key={card.id} className="mb-1">
                          <CardItem card={card} count={left} delta={delta} />
                          <Delta value={delta} />
                          <CardItem card={card} count={right} delta={delta} mirrored />
                        </Row>
                      ))}
                    </Fragment>
                  ) : null
                })}
                <Row className="text mt-6 mb-4">
                  <CardCount
                    count={leftDeck.spiritCost}
                    title="Spirit"
                    faction={leftDeck?.faction}
                  />
                  <Delta value={deckDiff.spirit} big />
                  <CardCount
                    count={rightDeck.spiritCost}
                    title="Spirit"
                    faction={leftDeck?.faction}
                    mirrored
                  />
                </Row>
              </div>
            </Dialog.Panel>
          </div>
        </InnerTransition>
      </Dialog>
    </OuterTransition>
  )
}
