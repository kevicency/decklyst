import { createDeck, playableMinionOnTheDrawChance, playableMinionOnThePlayChance } from './deck'
describe('Opening probabilities', () => {
  test('playableMinionOnThePlayChance', () => {
    const deckcode =
      '[12x2 + 6x3]MTo2MCwzOjYyLDM6NzMsMzoxMTIwMywzOjExMjQ1LDM6MjA0MDUsMzoyMDQwOSwzOjY0LDM6NjUsMzoyMDQxNiwzOjExMjU5LDI6MjA0MTUsMzo3MCwyOjExMjI0LDI6MjA0MTM='
    const deck = createDeck(deckcode)

    expect(playableMinionOnThePlayChance(deck)).toBeCloseTo(0.91, 2)
  })

  test('playableMinionOnTheDrawChance', () => {
    const deckcode =
      '[12x2 + 6x3]MTo2MCwzOjYyLDM6NzMsMzoxMTIwMywzOjExMjQ1LDM6MjA0MDUsMzoyMDQwOSwzOjY0LDM6NjUsMzoyMDQxNiwzOjExMjU5LDI6MjA0MTUsMzo3MCwyOjExMjI0LDI6MjA0MTM='
    const deck = createDeck(deckcode)

    expect(playableMinionOnTheDrawChance(deck)).toBeCloseTo(0.98, 2)
  })
})
