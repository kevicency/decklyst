import { AppSidebar } from '@/components/AppSidebar'
import type { FC } from 'react'

export const Layout: FC<{ children: any; showSearch?: boolean }> = ({ children }) => (
  <div className="flex w-screen h-screen overflow-auto">
    <AppSidebar />
    <div className="flex flex-col flex-1">{children}</div>
  </div>
)
