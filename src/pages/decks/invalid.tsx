import type { FC } from 'react'

export const InvalidDeckPage: FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center grid-in-main">
      <div className="-ml-10 flex items-center">
        <img src="/assets/vaath_confused.webp" alt="400" />
        <div>
          <h2 className="mb-1 border-b-2 pb-2 text-4xl font-bold">Error</h2>
          <p className="text-lg text-gray-300">Invalid deckcode</p>
        </div>
      </div>
    </div>
  )
}

export default InvalidDeckPage
