"use client"

import { useEffect, useState } from "react"
import { format, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, Trophy, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  buscarAgendamentosRelatorio,
  buscarVendasRelatorio,
  type AgendamentoRelatorio,
  type ItemVendaRelatorio,
} from "./actions"

function fmtValor(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`
}

export default function RelatoriosPage() {
  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [calAberto, setCalAberto] = useState(false)
  const [agendamentos, setAgendamentos] = useState<AgendamentoRelatorio[]>([])
  const [totalAgendamentos, setTotalAgendamentos] = useState(0)
  const [itensVenda, setItensVenda] = useState<ItemVendaRelatorio[]>([])
  const [totalVendas, setTotalVendas] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!range.from || !range.to) return
    const dataInicio = format(range.from, "yyyy-MM-dd")
    const dataFim = format(range.to, "yyyy-MM-dd")

    setCarregando(true)
    Promise.all([
      buscarAgendamentosRelatorio(dataInicio, dataFim),
      buscarVendasRelatorio(dataInicio, dataFim),
    ]).then(([relQuadra, relBar]) => {
      setAgendamentos(relQuadra.agendamentos)
      setTotalAgendamentos(relQuadra.total)
      setItensVenda(relBar.itens)
      setTotalVendas(relBar.total)
      setCarregando(false)
    })
  }, [range.from, range.to])

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Ganhos da quadra e do bar por período</p>
        </div>

        <Popover open={calAberto} onOpenChange={setCalAberto}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-10 flex items-center gap-2 px-3 rounded-md border border-border bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
            >
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              {format(range.from, "dd/MM/yyyy")} – {format(range.to, "dd/MM/yyyy")}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="p-2">
            <Calendar
              mode="range"
              selected={range}
              locale={ptBR}
              onSelect={(r) => {
                if (r?.from && r?.to) {
                  setRange({ from: r.from, to: r.to })
                  setCalAberto(false)
                } else if (r?.from) {
                  setRange({ from: r.from, to: r.from })
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* ── Quadra ── */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Quadra</h2>
              </div>
              <span className="font-bold text-sm text-foreground">{fmtValor(totalAgendamentos)}</span>
            </div>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
              {!carregando && agendamentos.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum agendamento no período selecionado.
                </p>
              )}
              {agendamentos.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.clienteNome}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(`${a.data}T00:00:00`), "dd/MM")} · {a.horaInicio}–{a.horaFim}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0">{fmtValor(a.valor)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Bar ── */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Bar</h2>
              </div>
              <span className="font-bold text-sm text-foreground">{fmtValor(totalVendas)}</span>
            </div>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
              {!carregando && itensVenda.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma venda no período selecionado.
                </p>
              )}
              {itensVenda.map((i) => (
                <div key={i.nome} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{i.nome}</p>
                    <p className="text-xs text-muted-foreground">{i.quantidade} un.</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0">{fmtValor(i.valorTotal)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
