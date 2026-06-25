import type { ReactNode } from "react"
import { InactivityGuard } from "@/components/inactivity-guard"

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <InactivityGuard />
      {children}
    </>
  )
}
