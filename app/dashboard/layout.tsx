import type { ReactNode } from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { InactivityGuard } from "@/components/inactivity-guard"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session  = await auth()
  const tenantId = (session?.user as any)?.tenantId
  const tenant   = tenantId ? await db.tenant.findUnique({ where: { id: tenantId } }) : null
  const tenantNome = tenant?.nome ?? "Gestão de Arena"

  return (
    <div className="flex h-screen overflow-hidden">
      <InactivityGuard />

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar tenantNome={tenantNome} />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 lg:pl-60 overflow-hidden">
        <MobileHeader tenantNome={tenantNome} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
