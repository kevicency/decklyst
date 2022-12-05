import { useAppShell } from '@/context/useAppShell'
import Link from 'next/link'

export const AppLogo = () => {
  const [{ isMobile, isNavExpanded, isMobileNavOpen }, { toggleMobileNav }] = useAppShell()

  return (
    <div className="flex items-center gap-x-4 border-r border-b border-gray-700 py-1 px-4 grid-in-logo">
      <button
        onClick={toggleMobileNav}
        type="button"
        // className="hover:text-white focus:ring-white inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        className="lg:hidden"
        aria-controls="mobile-menu"
        aria-expanded="false"
      >
        <span className="sr-only">Open site menu</span>
        {!isMobileNavOpen ? (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
      <Link href="/" className="flex h-12 items-center gap-x-2 text-3xl  font-thin lg:gap-x-4">
        <img src="/favicon.png" alt="logo" className="ml-0.5 h-6 w-6" />

        {(isNavExpanded || isMobile) && <span className="pr-2 animate-in fade-in">Decklyst</span>}
      </Link>
    </div>
  )
}
