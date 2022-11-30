import { useEffect, useState } from 'react'
import { useVisibilityObserver } from 'react-visibility-observer'

export const EndlessScroll: React.FC<{
  fetch: () => Promise<void> | Promise<any>
  isFetching?: boolean
  hidden?: boolean
}> = ({ fetch, isFetching, hidden }) => {
  const { isVisible } = useVisibilityObserver()
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!isVisible && active) {
      setActive(false)
    }
    if (isVisible && !hidden && !active && !isFetching) {
      setActive(true)
      fetch()
    }
  }, [active, fetch, hidden, isFetching, isVisible])

  return !hidden ? (
    <div className="flex w-full items-center justify-center">
      <img
        src="https://alpha.duelyst2.com/resources/card_gifs/f2PanddoRun.gif"
        alt="loading"
        className="sprite scale-200"
      />
    </div>
  ) : (
    <div />
  )
}
