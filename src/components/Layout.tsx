import Link from 'next/link'
import type { FC } from 'react'
import { DeckcodeSearch } from './DeckcodeSearch'

export const Layout: FC<{ children: any; showSearch?: boolean }> = ({ children, showSearch }) => (
  <div className="flex flex-col w-screen h-screen overflow-auto">
    {showSearch && (
      <div className="flex flex-shrink-0 items-center bg-slate-800 h-16">
        <div className="content-container flex justify-between">
          <span className={'hover:text-sky-400 text-3xl'}>
            <Link href={'/'}>Decklyst</Link>
          </span>
          <DeckcodeSearch />
        </div>
      </div>
    )}
    {children}
  </div>
)
