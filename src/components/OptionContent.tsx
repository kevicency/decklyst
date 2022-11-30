import cx from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import { CheckIcon } from './Icons'

export const OptionContent: FC<PropsWithChildren> = ({ children }) => (
  <>
    <span className={cx('w-3.5 text-accent-300')}>
      <CheckIcon size={14} className="mb-0.5 hidden ui-selected:inline-block" />
    </span>
    <span className={cx('flex-1 truncate')}>{children}</span>
  </>
)
