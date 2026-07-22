"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

async function getTenantId() {
  const session = await auth()
  const tenantId = (session?.user as any)?.tenantId
  if (!tenantId) throw new Error("Não autorizado")
  return tenantId
}

export type AgendamentoRelatorio = {
  id: string
  data: string
  horaInicio: string
  horaFim: string
  clienteNome: string
  valor: number
}

export type ItemVendaRelatorio = {
  nome: string
  quantidade: number
  valorTotal: number
}

export async function buscarAgendamentosRelatorio(dataInicio: string, dataFim: string) {
  const tenantId = await getTenantId()

  const rows = await db.$queryRaw<Array<{
    id: string
    data: string
    horaInicio: string
    horaFim: string
    clienteNome: string | null
    valor: string | null
  }>>`
    SELECT
      ag.id,
      TO_CHAR(ag.inicio, 'YYYY-MM-DD') AS "data",
      TO_CHAR(ag.inicio, 'HH24:MI')    AS "horaInicio",
      TO_CHAR(ag.fim,    'HH24:MI')    AS "horaFim",
      COALESCE(cl.nome, ag."nomeTurma", 'Avulso') AS "clienteNome",
      ag.valor::text
    FROM "Agendamento" ag
    JOIN "Quadra" q ON ag."quadraId" = q.id
    LEFT JOIN "Cliente" cl ON ag."clienteId" = cl.id
    WHERE q."tenantId" = ${tenantId}
      AND ag.status != 'CANCELADO'::"StatusAgendamento"
      AND TO_CHAR(ag.inicio, 'YYYY-MM-DD') >= ${dataInicio}
      AND TO_CHAR(ag.inicio, 'YYYY-MM-DD') <= ${dataFim}
    ORDER BY ag.inicio ASC
  `

  const agendamentos: AgendamentoRelatorio[] = rows.map((r) => ({
    id: r.id,
    data: r.data,
    horaInicio: r.horaInicio,
    horaFim: r.horaFim,
    clienteNome: r.clienteNome ?? "Avulso",
    valor: r.valor ? Number(r.valor) : 0,
  }))

  const total = agendamentos.reduce((soma, a) => soma + a.valor, 0)

  return { agendamentos, total }
}

export async function buscarVendasRelatorio(dataInicio: string, dataFim: string) {
  const tenantId = await getTenantId()

  const rows = await db.$queryRaw<Array<{
    nome: string
    quantidade: string
    valorTotal: string
  }>>`
    SELECT
      i.nome,
      SUM(i.quantidade)::text AS "quantidade",
      SUM(i.preco * i.quantidade)::text AS "valorTotal"
    FROM "Venda" v
    JOIN "ItemVenda" i ON i."vendaId" = v.id
    WHERE v."tenantId" = ${tenantId}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') >= ${dataInicio}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') <= ${dataFim}
    GROUP BY i.nome
    ORDER BY "valorTotal" DESC
  `

  const itens: ItemVendaRelatorio[] = rows.map((r) => ({
    nome: r.nome,
    quantidade: Number(r.quantidade),
    valorTotal: Number(r.valorTotal),
  }))

  const total = itens.reduce((soma, i) => soma + i.valorTotal, 0)

  return { itens, total }
}
