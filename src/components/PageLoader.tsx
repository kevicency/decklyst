import type { FC } from 'react'

export const PageLoader: FC = () => (
  <div className="flex h-full w-full items-center justify-center grid-in-main">
    <img
      src="https://play.duelyst2.com/resources/card_gifs/f2PanddoRun.gif"
      alt="loading"
      className="sprite scale-200"
    />
  </div>
)
