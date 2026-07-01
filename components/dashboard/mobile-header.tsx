"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

function getIniciais(nome: string) {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("")
}

export function MobileHeader({ tenantNome = "Gestão de Arena" }: { tenantNome?: string }) {
  const [open, setOpen] = useState(false)
  const iniciais = getIniciais(tenantNome)

  return (
    <>
      <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-sidebar">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">{iniciais}</span>
          </div>
          <span className="text-foreground font-bold text-sm">{tenantNome}</span>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <Sidebar onNavigate={() => setOpen(false)} tenantNome={tenantNome} />
        </SheetContent>
      </Sheet>
    </>
  )
}
