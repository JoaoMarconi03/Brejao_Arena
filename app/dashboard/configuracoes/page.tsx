import { Settings, Shield, Bell, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ConfiguracoesPage() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configurações da arena</p>
      </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Horário de Abertura</Label>
              <Input defaultValue="08:00" type="time" className="bg-secondary border-border text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Horário de Fechamento</Label>
              <Input defaultValue="23:00" type="time" className="bg-secondary border-border text-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Valor padrão por hora (R$)</Label>
            <Input defaultValue="60" type="number" className="bg-secondary border-border text-foreground" />
          </div>
          <Button className="mt-2">Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Fiado settings */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Configurações do Fiado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Dia de fechamento padrão</Label>
            <Input defaultValue="30" type="number" min="1" max="31" className="bg-secondary border-border text-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            O dia de fechamento define quando as contas fiado do mês são totalizadas para cobrança.
          </p>
          <Button className="mt-2">Salvar</Button>
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
