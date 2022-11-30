import { useEffect } from 'react'
import { useVisibilityObserver } from 'react-visibility-observer'

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

  return (
    <div className="flex w-full items-center justify-center">
      <img
        src="https://alpha.duelyst2.com/resources/card_gifs/f2PanddoRun.gif"
        alt="loading"
        className="sprite scale-200"
      />
    </div>
  )
}
