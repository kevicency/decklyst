import { Switch } from '@headlessui/react'
import type { FC, PropsWithChildren } from 'react'
import { CheckIcon, CloseAltIcon } from '../Icons'

export const Toggle: FC<
  PropsWithChildren<{ checked: boolean; onChange: (checked: boolean) => void }>
> = ({ checked, onChange, children }) => {
  return (
    <label className="flex items-center gap-2">
      <Switch
        checked={checked}
        onChange={onChange}
        className="relative inline-flex h-5 w-11 items-center rounded-full ui-checked:bg-accent-600 ui-not-checked:bg-gray-400"
      >
        <span className="sr-only">{children}</span>
        <span className="inline-block transform rounded-full border border-gray-700 bg-gray-600 p-1.5 transition ui-checked:translate-x-5 ui-checked:text-accent-100 ui-not-checked:translate-x-0 ui-not-checked:text-gray-100">
          {checked ? <CheckIcon size={12} className="p-0.5" /> : <CloseAltIcon size={12} />}
        </span>
      </Switch>
      {children}
    </label>
  )
}
