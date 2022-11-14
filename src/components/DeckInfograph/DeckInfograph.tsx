import { CardTooltip } from '@/components/DeckInfograph/CardTooltip'
import { DeckShareUrl } from '@/components/DeckInfograph/DeckShareUrl'
import { useSpriteLoader } from '@/context/useSpriteLoader'
import cx from 'classnames'
import type { FC } from 'react'
import { DeckArtifactList } from './DeckArtifactList'
import { DeckCardList } from './DeckCardList'
import { DeckCountsAlt } from './DeckCounts'
import { DeckManaCurve } from './DeckManaCurve'
import { DeckMinionList } from './DeckMinionList'
import { DeckQRCode } from './DeckQRCode'
import { DeckSpellList } from './DeckSpellList'
import { DeckTitle } from './DeckTitle'

export const DeckInfograph: FC = () => {
  const { allSpritesLoaded } = useSpriteLoader()

  return (
    <div
      className={cx(
        'relative bg-alt-900 p-6 pb-2',
        allSpritesLoaded ? 'snap--loaded' : 'snap--loading',
      )}
      id="snap"
    >
      <div className="grid auto-rows-auto gap-6 text-gray-100">
        <div
          className="grid gap-4 lg:gap-6"
          style={{
            gridTemplateColumns: 'minmax(0, 1.5fr)  minmax(0, 0.5fr) minmax(0, 1fr) auto',
          }}
        >
          <DeckTitle />
          <div className="flex justify-center">
            <DeckCountsAlt />
          </div>
          <div className="flex justify-center">
            <DeckManaCurve />
          </div>
          <DeckQRCode />
        </div>
        <div className="flex flex-col">
          <DeckMinionList />
          <div className="flex justify-between">
            <DeckSpellList />
            <DeckArtifactList />
          </div>
        </div>
        <DeckCardList />
      </div>
      <div className="mt-1 -mr-2 flex justify-end">
        <DeckShareUrl />
      </div>
      <CardTooltip />
    </div>
  )
}
