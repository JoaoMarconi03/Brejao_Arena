"use client"

import { useState, useEffect } from "react"
import { Settings, Shield, MessageCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { buscarConfigTenant, salvarWhatsApp } from "./actions"

export default function ConfiguracoesPage() {
  const [whatsapp, setWhatsapp]     = useState("")
  const [salvando, setSalvando]     = useState(false)
  const [feedbackWpp, setFeedback]  = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    buscarConfigTenant().then((t) => {
      if (t?.whatsapp) setWhatsapp(t.whatsapp)
    })
  }, [])

  async function handleSalvarWpp() {
    setSalvando(true)
    setFeedback(null)
    const res = await salvarWhatsApp(whatsapp)
    setSalvando(false)
    setFeedback({ ok: res.ok, msg: res.ok ? "Número salvo com sucesso!" : (res.erro ?? "Erro ao salvar.") })
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configurações da arena</p>
      </div>

      {/* WhatsApp */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            WhatsApp da Arena
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Este número aparece nos botões "Reservar via WhatsApp" da página pública da arena.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Número (com DDD e código do país)</Label>
            <Input
              placeholder="5511999998888"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono"
            />
            <p className="text-xs text-muted-foreground">Ex: 55 + DDD + número → <span className="font-mono">5511999998888</span></p>
          </div>

          {feedbackWpp && (
            <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
              feedbackWpp.ok
                ? "text-primary bg-primary/10 border-primary/20"
                : "text-destructive bg-destructive/10 border-destructive/20"
            }`}>
              {feedbackWpp.ok && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              {feedbackWpp.msg}
            </div>
          )}

          <Button onClick={handleSalvarWpp} disabled={!whatsapp || salvando}>
            {salvando ? "Salvando..." : "Salvar número"}
          </Button>
        </CardContent>
      </Card>

      {/* Arena info */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Dados da Arena
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Nome da Arena</Label>
            <Input defaultValue="Brejão Arena" className="bg-secondary border-border text-foreground" />
          </div>
          <Button className="mt-2">Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Conta Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input defaultValue="Admin" className="bg-secondary border-border text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">E-mail</Label>
              <Input defaultValue="admin@brejao.com" className="bg-secondary border-border text-foreground" />
            </div>
          </div>
          <Separator className="bg-border" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alterar senha</p>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Nova senha</Label>
            <Input type="password" placeholder="••••••••" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Confirmar senha</Label>
            <Input type="password" placeholder="••••••••" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button>Atualizar Conta</Button>
        </CardContent>
      </Card>
    </div>
  )
}
