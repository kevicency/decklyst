import Link from 'next/link'
import { FC } from 'react'
import { DeckcodeSearch } from './DeckcodeSearch'

export const Layout: FC<{ children: any; showSearch?: boolean }> = ({ children, showSearch }) => (
  <div className="flex flex-col">
    <div className="flex items-center bg-slate-800 h-16">
      <div className="content-container flex justify-between">
        <span className={'text-white hover:text-blue-400 text-4xl'}>
          <Link href={'/'}>Duelyst Share</Link>
        </span>
        {showSearch && <DeckcodeSearch />}
      </div>
    </div>
    <div className="flex-1 mt-8">{children}</div>
  </div>
)
