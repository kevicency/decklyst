import { useEffect } from 'react'
import { PacmanLoader } from 'react-spinners'
import { useVisibilityObserver } from 'react-visibility-observer'
import colors from 'tailwindcss/colors'

export const EndlessScroll: React.FC<{ fetch: () => void; isFetching?: boolean }> = ({
  fetch,
  isFetching,
}) => {
  const { isVisible } = useVisibilityObserver()

  useEffect(() => {
    if (isVisible && !isFetching) {
      fetch()
    }
  }, [fetch, isFetching, isVisible])

  return <PacmanLoader size={24} color={colors.teal['400']} />
}
