import { Calendar, Users, ShoppingCart, BookOpen, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Agendamentos Hoje",
    value: "4",
    sub: "2 confirmados · 2 pendentes",
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Faturamento Hoje",
    value: "R$ 360",
    sub: "+R$ 120 vs ontem",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Clientes Ativos",
    value: "28",
    sub: "3 mensalistas",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Fiado Pendente",
    value: "R$ 185",
    sub: "5 contas em aberto",
    icon: BookOpen,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
]

const proximosAgendamentos = [
  { hora: "14:00", cliente: "João Silva", duracao: "1h", tipo: "Mensalista", valor: "R$ 0" },
  { hora: "15:30", cliente: "Pedro Santos", duracao: "1h30", tipo: "Avulso", valor: "R$ 90" },
  { hora: "17:00", cliente: "Carlos Lima", duracao: "1h", tipo: "Avulso", valor: "R$ 60" },
  { hora: "19:00", cliente: "Grupo Digão", duracao: "1h30", tipo: "Mensalista", valor: "R$ 0" },
]

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Segunda-feira, 23 de junho de 2025</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground leading-tight">{s.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{s.sub}</p>
                </div>
                <div className={`${s.bg} p-2 rounded-lg shrink-0 ml-2`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming bookings */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">
              Próximos Agendamentos
            </CardTitle>
            <a href="/dashboard/agendamentos" className="text-xs text-primary hover:underline">
              Ver todos
            </a>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {proximosAgendamentos.map((ag) => (
              <div
                key={ag.hora}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-1.5 text-primary shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold w-10">{ag.hora}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ag.cliente}</p>
                  <p className="text-xs text-muted-foreground">{ag.duracao}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    ag.tipo === "Mensalista"
                      ? "border-primary/30 text-primary text-xs"
                      : "border-border text-muted-foreground text-xs"
                  }
                >
                  {ag.tipo}
                </Badge>
                <span className="text-sm font-medium text-foreground shrink-0">{ag.valor}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar + Fiado split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                Bar — Vendas Hoje
              </CardTitle>
              <a href="/dashboard/bar" className="text-xs text-primary hover:underline">Gerenciar</a>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              { nome: "Água 500ml", qtd: 12, total: "R$ 36" },
              { nome: "Refrigerante Lata", qtd: 8, total: "R$ 64" },
              { nome: "Cerveja 600ml", qtd: 5, total: "R$ 75" },
            ].map((p) => (
              <div key={p.nome} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-foreground">{p.nome}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs">{p.qtd}x</span>
                  <span className="text-foreground font-medium">{p.total}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-400" />
                Fiado — Contas em Aberto
              </CardTitle>
              <a href="/dashboard/fiado" className="text-xs text-primary hover:underline">Ver todas</a>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              { nome: "João Silva", valor: "R$ 48", venc: "30/06" },
              { nome: "Ana Oliveira", valor: "R$ 32", venc: "30/06" },
              { nome: "Marcos Torres", valor: "R$ 105", venc: "30/06" },
            ].map((f) => (
              <div key={f.nome} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-foreground">{f.nome}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">vence {f.venc}</span>
                  <span className="text-yellow-400 font-medium">{f.valor}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
