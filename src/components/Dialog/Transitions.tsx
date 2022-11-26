import { Transition } from '@headlessui/react'
import type { FC, ReactNode } from 'react'
import { Fragment } from 'react'

export const OuterTransition: FC<{ children: ReactNode; show?: boolean }> = ({
  children,
  show,
}) => (
  <Transition
    show={show}
    enter="transition duration-100 ease-out"
    enterFrom="transform scale-95 opacity-0"
    enterTo="transform scale-100 opacity-100"
    leave="transition duration-75 ease-out"
    leaveFrom="transform scale-100 opacity-100"
    leaveTo="transform scale-95 opacity-0"
  >
    {children}
  </Transition>
)

export const InnerTransition: FC<{ children: ReactNode }> = ({ children }) => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    {children}
  </Transition.Child>
)
