import { FC } from 'react'
import Link from 'next/link'

export const Layout: FC<{ children: any }> = ({ children }) => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center justify-center bg-slate-800 h-12">
      <div className={'w-[48rem] mx-auto px-4'}>
        <span className={'text-white hover:text-blue-400 text-xl'}>
          <Link href={'/'}>Duelyst Share</Link>
        </span>
      </div>
    </div>
    <div className="flex-1">{children}</div>
  </div>
)
