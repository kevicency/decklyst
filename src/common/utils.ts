import { validateDeckcode } from '@/data/deckcode'

export const isShareOrDeckcode = (input?: string) =>
  Boolean(input && ((input.length >= 3 && input.length < 6) || validateDeckcode(input)))
