import type { CardData } from '@/data/cards'
import cx from 'classnames'

export const GeneralCard = ({
  general,
  onSelect,
  size = 'md',
  className,
}: {
  general: CardData
  size?: 'md' | 'sm'
  onSelect: (card: CardData) => void
  className?: string
}) => (
  <button
    key={general.id}
    onClick={() => onSelect(general)}
    className={cx(
      {
        'mt-[-16px] mb-[-10px] ml-[-16px] w-32': size === 'md',
        'mt-[-10px] mb-[-6px] ml-[-12px] w-20': size === 'sm',
      },
      'flex flex-shrink-0 flex-col items-center',
      `hover:text-${general.faction}`,
      className,
    )}
  >
    <img
      src={`/assets/generals/${general.id}_hex.png`}
      srcSet={[
        `/assets/generals/${general.id}_hex.png 1x`,
        `/assets/generals/${general.id}_hex@2x.png 2x`,
      ].join(',')}
      alt={general.name}
    />
    {size === 'md' && (
      <div
        className={cx(`flex-1 font-semibold`, {
          // 'text-sm px-2': size === 'sm',
          'px-4': size === 'md',
        })}
      >
        {general.name}
      </div>
    )}
  </button>
)
