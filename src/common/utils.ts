import { validateDeckcode } from '@/data/deckcode'

export const isSharecode = (input?: string): input is string =>
  Boolean(input && input.length >= 3 && input.length < 6)
export const isShareOrDeckcode = (input?: string): input is string =>
  isSharecode(input) || validateDeckcode(input)
