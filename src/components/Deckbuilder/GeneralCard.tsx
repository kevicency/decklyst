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
        'w-48 mt-[-24px] mb-[-16px] ml-[-24px]': size === 'md',
        'w-24 mt-[-12px] mb-[-8px] ml-[-12px]': size === 'sm',
      },
      'flex flex-col flex-shrink-0 items-center',
      `hover:text-${general.faction}`,
      className,
    )}
  >
    <img src={`/assets/generals/${general.id}_hex@2x.png`} alt={general.name} />
    <div
      className={cx(`font-bold flex-1`, {
        'text-sm px-2': size === 'sm',
        'text-lg px-4': size === 'md',
      })}
    >
      {general.name}
    </div>
  </button>
)
