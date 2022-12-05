import { Transition } from '@headlessui/react'
import type { FC } from 'react'

export const AppNavMobile: FC<{ open: boolean }> = ({ open }) => {
  return (
    <Transition
      show={open}
      enter="transition ease-out duration-100 transform"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      {(ref) => (
        <div className="md:hidden" id="mobile-menu">
          <div ref={ref} className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <a
              href="#"
              className="text-white block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="hover:text-white block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Team
            </a>

            <a
              href="#"
              className="hover:text-white block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Projects
            </a>

            <a
              href="#"
              className="hover:text-white block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Calendar
            </a>

            <a
              href="#"
              className="hover:text-white block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Reports
            </a>
          </div>
        </div>
      )}
    </Transition>
  )
}
