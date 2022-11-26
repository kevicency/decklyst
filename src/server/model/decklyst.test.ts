import { createDeck } from '@/data/deck'
import { prisma } from '@/server/db/client'
import { extendDecklyst } from './deckinfo'

const deckcode =
  '[Spell Spam]MToxNzcsMzoxNjksMzoxNzUsMzoxNzYsMzoxMTE3NywzOjIwNDIxLDM6MjA0MjMsMzoyMDQyOCwzOjIwNDI5LDM6MjA0MzEsMzoyMDQzNCwzOjIwNDM2LDM6MjA0MzgsMzozMDEwNg=='

describe('model/decklyst', () => {
  const decklyst = extendDecklyst(prisma.decklyst)

  it('works', async () => {
    const deck = await decklyst.createForDeck(createDeck(deckcode))

    // console.log(deck)
    // expect(deck).toBeTruthy()

    const foo = await decklyst.findMany({
      where: {
        metadata: {
          cardCounts: {
            path: ['169'],
            gte: 1,
          },
        },
      },
    })

    console.log(foo)
    expect(foo.length).toBeGreaterThan(0)
  })
})

export {}
