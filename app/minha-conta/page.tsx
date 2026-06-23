import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, LogOut, CalendarDays, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SignOutButton } from "@/components/sign-out-button"

// Mock de agendamentos do cliente — será substituído por DB
const MOCK_AGENDAMENTOS = [
  {
    id: "1",
    data: "Sábado, 28 Jun 2025",
    horario: "10:00 – 11:00",
    status: "CONFIRMADO",
    valor: "R$ 150,00",
  },
  {
    id: "2",
    data: "Domingo, 29 Jun 2025",
    horario: "14:00 – 15:30",
    status: "PENDENTE",
    valor: "R$ 210,00",
  },
]

const STATUS_STYLES: Record<string, string> = {
  CONFIRMADO: "bg-primary/10 text-primary",
  PENDENTE: "bg-yellow-500/15 text-yellow-400",
  CANCELADO: "bg-destructive/15 text-destructive",
}

export default async function MinhaContaPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const nome = session.user.name ?? "Cliente"
  const iniciais = nome
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Brejão Arena</span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Boas-vindas */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
            {iniciais}
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Bem-vindo,</p>
            <h1 className="text-2xl font-bold">{nome}</h1>
          </div>
        </div>

        {/* Cards rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: CalendarDays, label: "Agendamentos", valor: "2" },
            { icon: Clock, label: "Próximo jogo", valor: "Sáb 10h" },
            { icon: User, label: "Conta", valor: "Ativa" },
          ].map(({ icon: Icon, label, valor }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold mt-0.5">{valor}</p>
            </div>
          ))}
        </div>

        {/* Botão de novo agendamento */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Quer jogar?</p>
            <p className="text-sm text-muted-foreground">Reserve seu horário na quadra agora mesmo.</p>
          </div>
          <Button asChild>
            <Link href="/#horarios">Ver horários disponíveis</Link>
          </Button>
        </div>

        {/* Meus agendamentos */}
        <div>
          <h2 className="text-xl font-bold mb-4">Meus agendamentos</h2>
          <div className="space-y-3">
            {MOCK_AGENDAMENTOS.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
                Nenhum agendamento ainda. Que tal reservar um horário?
              </div>
            ) : (
              MOCK_AGENDAMENTOS.map((ag) => (
                <div
                  key={ag.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{ag.data}</p>
                      <p className="text-xs text-muted-foreground">{ag.horario} • Quadra Principal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">{ag.valor}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs border-0 ${STATUS_STYLES[ag.status] ?? ""}`}
                    >
                      {ag.status === "CONFIRMADO"
                        ? "Confirmado"
                        : ag.status === "PENDENTE"
                        ? "Pendente"
                        : "Cancelado"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
