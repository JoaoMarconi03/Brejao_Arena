"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

const TIMEOUT_MS  = 20 * 60 * 1000 // 20 minutos
const WARNING_MS  =  2 * 60 * 1000 //  2 minutos antes de expirar

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"]

export function InactivityGuard() {
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [aviso, setAviso] = useState(false)
  const [segundos, setSegundos] = useState(120)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const encerrarContagem = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  const iniciarContagem = useCallback(() => {
    encerrarContagem()
    setSegundos(120)
    countdownRef.current = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          encerrarContagem()
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [encerrarContagem])

  const resetar = useCallback(() => {
    setAviso(false)
    encerrarContagem()

    if (timerRef.current) clearTimeout(timerRef.current)
    if (warnRef.current)  clearTimeout(warnRef.current)

    warnRef.current = setTimeout(() => {
      setAviso(true)
      iniciarContagem()
    }, TIMEOUT_MS - WARNING_MS)

    timerRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/login" })
    }, TIMEOUT_MS)
  }, [encerrarContagem, iniciarContagem])

  useEffect(() => {
    resetar()
    EVENTS.forEach((e) => window.addEventListener(e, resetar, { passive: true }))
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (warnRef.current)  clearTimeout(warnRef.current)
      encerrarContagem()
      EVENTS.forEach((e) => window.removeEventListener(e, resetar))
    }
  }, [resetar, encerrarContagem])

  const min = Math.floor(segundos / 60)
  const seg = String(segundos % 60).padStart(2, "0")

  return (
    <Dialog open={aviso} onOpenChange={() => {}}>
      <DialogContent className="bg-card border-border sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-foreground">Ainda está aí?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1 text-center">
          <p className="text-muted-foreground text-sm">
            Por segurança, sua sessão será encerrada automaticamente em:
          </p>
          <p className="text-4xl font-bold font-mono text-primary">
            {min}:{seg}
          </p>
          <p className="text-xs text-muted-foreground">
            Qualquer interação cancela o encerramento.
          </p>
          <Button className="w-full" onClick={resetar}>
            Continuar conectado
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
