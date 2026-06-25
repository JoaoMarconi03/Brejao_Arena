import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { InactivityGuard } from "@/components/inactivity-guard"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <InactivityGuard />

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 lg:pl-60 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
