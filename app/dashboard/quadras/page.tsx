"use client"

import { Trophy, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function QuadrasPage() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Quadras</h1>
        <p className="text-sm text-muted-foreground">Gestão das quadras da arena</p>
      </div>

      <Card className="bg-card border-border border-primary/30">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">Quadra Principal</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs border">Ativa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">Quadra society — gramado sintético</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-border shrink-0">Editar</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Horário de abertura</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">08:00 – 23:00</span>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Tempo mínimo</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">1 hora</span>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Dias de funcionamento</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Seg – Dom</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Valores por hora</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "1 hora", valor: "R$ 60" },
                { label: "1h30", valor: "R$ 90" },
                { label: "2 horas", valor: "R$ 120" },
                { label: "Mensalista", valor: "Plano" },
              ].map((v) => (
                <div key={v.label} className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">{v.label}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">{v.valor}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center py-2">
        Brejão Arena tem 1 quadra. Para adicionar mais, acesse as configurações.
      </p>
    </div>
  )
}
