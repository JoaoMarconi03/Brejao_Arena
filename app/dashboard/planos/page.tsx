"use client"

import { useState } from "react"
import { Plus, Star, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const planos = [
  { id: "1", nome: "Mensal Quinta", valor: 280, descricao: "Toda quinta-feira, 19:00–20:30", assinantes: 5 },
  { id: "2", nome: "Mensal Sábado", valor: 320, descricao: "Todo sábado, 10:00–11:00", assinantes: 2 },
  { id: "3", nome: "Mensal Livre", valor: 400, descricao: "2 horários semanais a escolher", assinantes: 1 },
]

const mensalistas = [
  { id: "1", nome: "João Silva", plano: "Mensal Quinta", dia: "Quinta", horario: "19:00–20:30", vencimento: "30/06" },
  { id: "2", nome: "Grupo Digão", plano: "Mensal Quinta", dia: "Quinta", horario: "19:00–20:30", vencimento: "30/06" },
  { id: "3", nome: "Marcos Torres", plano: "Mensal Sábado", dia: "Sábado", horario: "10:00–11:00", vencimento: "05/07" },
  { id: "4", nome: "Carlos Lima", plano: "Mensal Livre", dia: "Ter/Sex", horario: "20:00–21:00", vencimento: "01/07" },
]

export default function PlanosPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tab, setTab] = useState<"planos" | "assinaturas">("planos")

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Planos Mensais</h1>
          <p className="text-sm text-muted-foreground">{mensalistas.length} mensalistas ativos</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Plano</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 w-fit">
        {(["planos", "assinaturas"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "planos" ? "Planos" : "Assinantes"}
          </button>
        ))}
      </div>

      {tab === "planos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {planos.map((p) => (
            <Card key={p.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                    {p.assinantes} assinante{p.assinantes !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="text-base font-bold text-foreground mt-3">{p.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.descricao}</p>
                <p className="text-2xl font-bold text-primary mt-3">
                  R$ {p.valor}
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "assinaturas" && (
        <div className="space-y-2">
          {mensalistas.map((m) => (
            <Card key={m.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">{m.nome.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{m.nome}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{m.plano}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {m.dia} {m.horario}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">Vence</p>
                  <p className="text-sm font-semibold text-foreground">{m.vencimento}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Plano</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome do plano</Label>
              <Input placeholder="Ex: Mensal Quinta" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Input placeholder="Ex: Toda quinta, 19:00–20:30" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Valor mensal (R$)</Label>
              <Input type="number" placeholder="0,00" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-border" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={() => setDialogOpen(false)}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
