import { AppSidebar } from '@/components/AppSidebar'
import type { FC } from 'react'

export const Layout: FC<{ children: any; hideSidebar?: boolean }> = ({ children, hideSidebar }) => (
  <div className="flex w-screen h-screen overflow-auto">
    {!hideSidebar && <AppSidebar />}
    <div className="flex flex-col flex-1">{children}</div>
  </div>
)
