import { AppSidebar } from '@/components/AppSidebar'
import type { FC } from 'react'

export const Layout: FC<{ children: any; hideSidebar?: boolean }> = ({ children, hideSidebar }) => (
  <div className="flex h-screen w-screen overflow-auto">
    {!hideSidebar && <AppSidebar />}
    <div className="flex flex-1 flex-col">{children}</div>
  </div>
)

export const AppLayout: FC<{ children: JSX.Element }> = ({ children }) => <div className=""></div>
