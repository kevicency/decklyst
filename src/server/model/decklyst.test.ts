import { createDeck } from '@/data/deck'
import {
  addCard,
  defaultDeckcode,
  encodeDeckcode,
  parseDeckcode,
  updateTitle,
} from '@/data/deckcode'
import { prisma } from '@/server/db/client'
import { extendDecklyst } from './decklyst'

const deckcode =
  '[Spell Spam]MToxNzcsMzoxNjksMzoxNzUsMzoxNzYsMzoxMTE3NywzOjIwNDIxLDM6MjA0MjMsMzoyMDQyOCwzOjIwNDI5LDM6MjA0MzEsMzoyMDQzNCwzOjIwNDM2LDM6MjA0MzgsMzozMDEwNg=='

describe('model/decklyst', () => {
  const decklyst = extendDecklyst(prisma.decklyst)

  describe('upsertDeck', () => {
    it('creates a version history on card changes', async () => {
      let deckcode = parseDeckcode(defaultDeckcode('lyonar'))
      deckcode = addCard(deckcode, 61, 1)

      const created = await decklyst.upsertDeck(undefined, createDeck(deckcode))
      expect(created).toMatchObject({
        deckcode: encodeDeckcode(deckcode),
        version: 1,
      })

      deckcode = updateTitle(deckcode, 'test')
      const updated = await decklyst.upsertDeck(created.sharecode, createDeck(deckcode))
      expect(updated).toMatchObject({
        deckcode: encodeDeckcode(deckcode),
        version: 1,
      })

      const historyDeckcode = encodeDeckcode(deckcode)
      deckcode = addCard(deckcode, 61, 1)
      const updatedWithHistory = await decklyst.upsertDeck(created.sharecode, createDeck(deckcode))
      expect(updatedWithHistory).toMatchObject({
        deckcode: encodeDeckcode(deckcode),
        version: 2,
      })

      const withHistory = await prisma.decklyst.findUnique({
        where: { sharecode: created.sharecode },
        select: { history: true },
      })
      expect(withHistory?.history ?? []).toMatchObject([
        {
          version: 1,
          deckcode: historyDeckcode,
        },
      ])
    })
  })
})

export {}
