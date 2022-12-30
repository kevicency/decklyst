import { add, range } from 'lodash'

const factorials: Record<number, number> = {}

export function factorial(n: number): number {
  if (n < 2) {
    return 1
  }
  if (factorials[n]) {
    return factorials[n]
  }
  return (factorials[n] = n * factorial(n - 1))
}

function combination(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r))
}
export function hypergeometricProbability(
  total: number,
  successes: number,
  sampleSize: number,
  sampleSuccesses: number,
): number {
  return (
    (combination(successes, sampleSuccesses) *
      combination(total - successes, sampleSize - sampleSuccesses)) /
    combination(total, sampleSize)
  )
}

export function atLeastOneProbability(
  total: number,
  successes: number,
  sampleSize: number,
): number {
  return range(1, sampleSize + 1)
    .map((x) => hypergeometricProbability(total, successes, sampleSize, x))
    .reduce(add, 0)
}
