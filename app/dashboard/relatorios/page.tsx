"use client"

import { useEffect, useMemo, useState } from "react"
import { format, startOfMonth, startOfWeek, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, Trophy, ShoppingCart, Wallet, Receipt, Pencil, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  buscarAgendamentosRelatorio,
  buscarVendasRelatorio,
  buscarClientesPorProduto,
  editarAgendamentoRelatorio,
  editarItemVendaRelatorio,
  type AgendamentoRelatorio,
  type ItemVendaRelatorio,
  type PedidoProdutoRelatorio,
} from "./actions"

function fmtValor(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`
}

const LABEL_TIPO: Record<AgendamentoRelatorio["tipo"], string> = {
  AVULSO: "Avulso",
  MENSALISTA: "Mensalista",
  AULA: "Aula",
}

const ORDEM_TIPO: AgendamentoRelatorio["tipo"][] = ["AVULSO", "MENSALISTA", "AULA"]

type Preset = "hoje" | "semana" | "mes" | "personalizado"

export default function RelatoriosPage() {
  const hoje = new Date()
  const [preset, setPreset] = useState<Preset>("hoje")
  const [range, setRange] = useState<{ from: Date; to: Date }>({ from: hoje, to: hoje })
  const [calAberto, setCalAberto] = useState(false)
  const [agendamentos, setAgendamentos] = useState<AgendamentoRelatorio[]>([])
  const [totalAgendamentos, setTotalAgendamentos] = useState(0)
  const [itensVenda, setItensVenda] = useState<ItemVendaRelatorio[]>([])
  const [totalVendas, setTotalVendas] = useState(0)
  const [quantidadeVendas, setQuantidadeVendas] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null)
  const [pedidosProduto, setPedidosProduto] = useState<PedidoProdutoRelatorio[]>([])
  const [carregandoPedidos, setCarregandoPedidos] = useState(false)

  const [editandoAgendamentoId, setEditandoAgendamentoId] = useState<string | null>(null)
  const [formNome, setFormNome] = useState("")
  const [formValor, setFormValor] = useState("")
  const [salvandoAgendamento, setSalvandoAgendamento] = useState(false)

  const [editandoItemId, setEditandoItemId] = useState<string | null>(null)
  const [formQuantidade, setFormQuantidade] = useState("")
  const [formPreco, setFormPreco] = useState("")
  const [salvandoItem, setSalvandoItem] = useState(false)

  function carregarRelatorios() {
    const dataInicio = format(range.from, "yyyy-MM-dd")
    const dataFim = format(range.to, "yyyy-MM-dd")
    setCarregando(true)
    return Promise.all([
      buscarAgendamentosRelatorio(dataInicio, dataFim),
      buscarVendasRelatorio(dataInicio, dataFim),
    ]).then(([relQuadra, relBar]) => {
      setAgendamentos(relQuadra.agendamentos)
      setTotalAgendamentos(relQuadra.total)
      setItensVenda(relBar.itens)
      setTotalVendas(relBar.total)
      setQuantidadeVendas(relBar.quantidadeVendas)
      setCarregando(false)
    })
  }

  useEffect(() => {
    if (!range.from || !range.to) return
    carregarRelatorios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to])

  function abrirDetalheProduto(nome: string) {
    setProdutoSelecionado(nome)
    carregarDetalheProduto(nome)
  }

  function carregarDetalheProduto(nome: string) {
    setCarregandoPedidos(true)
    const dataInicio = format(range.from, "yyyy-MM-dd")
    const dataFim = format(range.to, "yyyy-MM-dd")
    return buscarClientesPorProduto(nome, dataInicio, dataFim).then((res) => {
      setPedidosProduto(res.pedidos)
      setCarregandoPedidos(false)
    })
  }

  function selecionarPreset(p: Preset) {
    setPreset(p)
    setCalAberto(false)
    if (p === "hoje") setRange({ from: hoje, to: hoje })
    if (p === "semana") setRange({ from: startOfWeek(hoje, { weekStartsOn: 1 }), to: hoje })
    if (p === "mes") setRange({ from: startOfMonth(hoje), to: hoje })
  }

  function iniciarEdicaoAgendamento(a: AgendamentoRelatorio) {
    setEditandoAgendamentoId(a.id)
    setFormNome(a.clienteNome)
    setFormValor(String(a.valor))
  }

  async function salvarEdicaoAgendamento(a: AgendamentoRelatorio) {
    setSalvandoAgendamento(true)
    await editarAgendamentoRelatorio(a.id, {
      clienteNome: a.nomeEditavel ? formNome : undefined,
      valor: Number(formValor.replace(",", ".")) || 0,
    })
    await carregarRelatorios()
    setSalvandoAgendamento(false)
    setEditandoAgendamentoId(null)
  }

  function iniciarEdicaoItem(p: PedidoProdutoRelatorio) {
    setEditandoItemId(p.itemVendaId)
    setFormQuantidade(String(p.quantidade))
    setFormPreco(String(p.preco))
  }

  async function salvarEdicaoItem(p: PedidoProdutoRelatorio) {
    setSalvandoItem(true)
    await editarItemVendaRelatorio(p.itemVendaId, {
      quantidade: Number(formQuantidade) || 0,
      preco: Number(formPreco.replace(",", ".")) || 0,
    })
    if (produtoSelecionado) await carregarDetalheProduto(produtoSelecionado)
    await carregarRelatorios()
    setSalvandoItem(false)
    setEditandoItemId(null)
  }

  const breakdownTipo = useMemo(() => {
    const mapa = new Map<AgendamentoRelatorio["tipo"], { quantidade: number; valor: number }>()
    for (const a of agendamentos) {
      const atual = mapa.get(a.tipo) ?? { quantidade: 0, valor: 0 }
      atual.quantidade += 1
      atual.valor += a.valor
      mapa.set(a.tipo, atual)
    }
    return ORDEM_TIPO
      .filter((tipo) => mapa.has(tipo))
      .map((tipo) => ({ tipo, ...mapa.get(tipo)! }))
  }, [agendamentos])

  // Avulso e aula: um por ocorrência. Mensalista se repete no período
  // (mesmo cliente, mesmo horário toda semana) — junta tudo numa linha só.
  const avulsosEAulas = useMemo(
    () => agendamentos.filter((a) => a.tipo !== "MENSALISTA"),
    [agendamentos]
  )

  const mensalistas = useMemo(() => {
    const mapa = new Map<string, { clienteNome: string; horaInicio: string; horaFim: string; valor: number; ocorrencias: number; datas: string[] }>()
    for (const a of agendamentos) {
      if (a.tipo !== "MENSALISTA") continue
      const chave = `${a.clienteNome}__${a.horaInicio}__${a.horaFim}`
      const atual = mapa.get(chave) ?? { clienteNome: a.clienteNome, horaInicio: a.horaInicio, horaFim: a.horaFim, valor: 0, ocorrencias: 0, datas: [] }
      atual.valor += a.valor
      atual.ocorrencias += 1
      atual.datas.push(a.data)
      mapa.set(chave, atual)
    }
    return Array.from(mapa.entries())
      .map(([chave, g]) => ({ chave, ...g, datas: g.datas.sort() }))
      .sort((x, y) => x.horaInicio.localeCompare(y.horaInicio))
  }, [agendamentos])

  const pedidosPorCliente = useMemo(() => {
    const mapa = new Map<string, { clienteNome: string; pedidos: PedidoProdutoRelatorio[]; total: number }>()
    for (const p of pedidosProduto) {
      const atual = mapa.get(p.clienteNome) ?? { clienteNome: p.clienteNome, pedidos: [], total: 0 }
      atual.pedidos.push(p)
      atual.total += p.preco * p.quantidade
      mapa.set(p.clienteNome, atual)
    }
    return Array.from(mapa.values()).sort((x, y) => y.total - x.total)
  }, [pedidosProduto])

  function formatarIntervalo(from: Date, to: Date) {
    if (isSameDay(from, to)) return format(from, "dd/MM")
    if (from.getMonth() === to.getMonth()) return `${format(from, "dd")} – ${format(to, "dd/MM")}`
    return `${format(from, "dd/MM")} – ${format(to, "dd/MM")}`
  }

  const totalGeral = totalAgendamentos + totalVendas
  const rotuloPeriodo =
    preset === "hoje" ? "Hoje" : formatarIntervalo(range.from, range.to)

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Ganhos da quadra e do bar por período</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(["hoje", "semana", "mes"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => selecionarPreset(p)}
              className={cn(
                "h-9 px-3 rounded-md text-sm font-medium transition-colors",
                preset === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {p === "hoje" ? "Hoje" : p === "semana" ? "Semana" : "Mês"}
              {preset === p && p !== "hoje" && ` · ${formatarIntervalo(range.from, range.to)}`}
            </button>
          ))}

          <Popover open={calAberto} onOpenChange={setCalAberto}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={() => setPreset("personalizado")}
                className={cn(
                  "h-9 flex items-center gap-2 px-3 rounded-md text-sm font-medium transition-colors",
                  preset === "personalizado"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                <CalendarDays className="w-4 h-4 shrink-0" />
                {preset === "personalizado"
                  ? `${format(range.from, "dd/MM")} – ${format(range.to, "dd/MM")}`
                  : "Personalizado"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-2">
              <Calendar
                mode="range"
                selected={range}
                locale={ptBR}
                onSelect={(r) => {
                  setPreset("personalizado")
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
      </div>

      {/* ── Resumo do período ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Total — {rotuloPeriodo}</p>
              <p className="font-bold text-foreground">{fmtValor(totalGeral)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Agendamentos</p>
              <p className="font-bold text-foreground">{agendamentos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Vendas no bar</p>
              <p className="font-bold text-foreground">{quantidadeVendas}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Ticket médio (bar)</p>
              <p className="font-bold text-foreground">
                {fmtValor(quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0)}
              </p>
            </div>
          </CardContent>
        </Card>
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

            {breakdownTipo.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {breakdownTipo.map(({ tipo, quantidade, valor }) => (
                  <span
                    key={tipo}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-foreground font-medium"
                  >
                    {LABEL_TIPO[tipo]}: {quantidade} · {fmtValor(valor)}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
              {!carregando && agendamentos.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum agendamento no período selecionado.
                </p>
              )}

              {avulsosEAulas.map((a) =>
                editandoAgendamentoId === a.id ? (
                  <div key={a.id} className="px-3 py-2 rounded-lg bg-secondary/60 space-y-2">
                    {a.nomeEditavel && (
                      <Input
                        value={formNome}
                        onChange={(e) => setFormNome(e.target.value)}
                        placeholder="Nome do cliente"
                        className="h-8 text-sm"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        value={formValor}
                        onChange={(e) => setFormValor(e.target.value)}
                        placeholder="Valor"
                        inputMode="decimal"
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        disabled={salvandoAgendamento}
                        onClick={() => salvarEdicaoAgendamento(a)}
                        className="h-8 w-8 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={salvandoAgendamento}
                        onClick={() => setEditandoAgendamentoId(null)}
                        className="h-8 w-8 shrink-0 rounded-md bg-secondary text-foreground flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.clienteNome}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(`${a.data}T00:00:00`), "dd/MM")} · {a.horaInicio}–{a.horaFim} · {LABEL_TIPO[a.tipo]}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-semibold text-foreground">{fmtValor(a.valor)}</span>
                      <button
                        type="button"
                        onClick={() => iniciarEdicaoAgendamento(a)}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              )}

              {mensalistas.length > 0 && (
                <>
                  {avulsosEAulas.length > 0 && (
                    <p className="text-xs font-medium text-muted-foreground pt-2 pb-0.5">Mensalistas</p>
                  )}
                  {mensalistas.map((m) => (
                    <div key={m.chave} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{m.clienteNome}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.horaInicio}–{m.horaFim} · Mensalista · {m.ocorrencias}x no período
                        </p>
                        <p className="text-xs text-muted-foreground/80 truncate">
                          Datas: {m.datas.map((d) => format(new Date(`${d}T00:00:00`), "dd/MM")).join(", ")}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">{fmtValor(m.valor)}</span>
                    </div>
                  ))}
                </>
              )}
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
                <button
                  key={i.nome}
                  type="button"
                  onClick={() => abrirDetalheProduto(i.nome)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{i.nome}</p>
                    <p className="text-xs text-muted-foreground">{i.quantidade} un.</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0">{fmtValor(i.valorTotal)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={produtoSelecionado !== null} onOpenChange={(aberto) => !aberto && setProdutoSelecionado(null)}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{produtoSelecionado}</DialogTitle>
            <p className="text-sm text-muted-foreground">Quem pediu — {rotuloPeriodo}</p>
          </DialogHeader>

          <div className="space-y-3">
            {carregandoPedidos && (
              <p className="text-center py-6 text-muted-foreground text-sm">Carregando...</p>
            )}
            {!carregandoPedidos && pedidosProduto.length === 0 && (
              <p className="text-center py-6 text-muted-foreground text-sm">Nenhum pedido encontrado.</p>
            )}
            {!carregandoPedidos && pedidosPorCliente.map((c) => (
              <div key={c.clienteNome} className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-foreground truncate">{c.clienteNome}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{fmtValor(c.total)}</span>
                </div>
                <div className="space-y-1.5">
                  {c.pedidos.map((p) =>
                    editandoItemId === p.itemVendaId ? (
                      <div key={p.itemVendaId} className="px-3 py-2 rounded-lg bg-secondary/60 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={formQuantidade}
                            onChange={(e) => setFormQuantidade(e.target.value)}
                            placeholder="Qtd."
                            inputMode="numeric"
                            className="h-8 text-sm w-20"
                          />
                          <Input
                            value={formPreco}
                            onChange={(e) => setFormPreco(e.target.value)}
                            placeholder="Preço unit."
                            inputMode="decimal"
                            className="h-8 text-sm"
                          />
                          <button
                            type="button"
                            disabled={salvandoItem}
                            onClick={() => salvarEdicaoItem(p)}
                            className="h-8 w-8 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={salvandoItem}
                            onClick={() => setEditandoItemId(null)}
                            className="h-8 w-8 shrink-0 rounded-md bg-secondary text-foreground flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={p.itemVendaId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`${p.data}T00:00:00`), "dd/MM")} · {p.hora} · {p.quantidade}x de {fmtValor(p.preco)}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-sm font-semibold text-foreground">{fmtValor(p.preco * p.quantidade)}</span>
                          <button
                            type="button"
                            onClick={() => iniciarEdicaoItem(p)}
                            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
