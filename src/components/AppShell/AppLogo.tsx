import { useAppShell } from '@/context/useAppShell'
import Link from 'next/link'

export const AppLogo = () => {
  const [{ isNavExpanded }] = useAppShell()

  return (
    <Link
      href="/"
      className="flex h-12 items-center gap-x-4 border-r border-b border-gray-700 py-1 px-4 text-3xl font-thin grid-in-logo"
    >
      <img src="/favicon.png" alt="logo" className="ml-0.5 h-6 w-6" />

      {isNavExpanded && <span className="pr-2 animate-in fade-in">Decklyst</span>}
    </Link>
  )
}
