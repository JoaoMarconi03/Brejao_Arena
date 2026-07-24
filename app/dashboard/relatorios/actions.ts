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
  tipo: "AVULSO" | "MENSALISTA" | "AULA"
  status: string
  nomeEditavel: boolean
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
    tipo: string
    status: string
    nomeEditavel: boolean
  }>>`
    SELECT
      ag.id,
      TO_CHAR(ag.inicio, 'YYYY-MM-DD') AS "data",
      TO_CHAR(ag.inicio, 'HH24:MI')    AS "horaInicio",
      TO_CHAR(ag.fim,    'HH24:MI')    AS "horaFim",
      CASE
        WHEN ag.tipo = 'AULA' THEN COALESCE(ag."nomeTurma", 'Aula')
        ELSE COALESCE(cl.nome, ag.observacao, 'Avulso')
      END AS "clienteNome",
      ag.valor::text,
      ag.tipo::text,
      ag.status::text,
      (ag."clienteId" IS NULL AND ag.tipo != 'AULA') AS "nomeEditavel"
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
    tipo: (r.tipo as AgendamentoRelatorio["tipo"]) ?? "AVULSO",
    status: r.status,
    nomeEditavel: r.nomeEditavel,
  }))

  const total = agendamentos.reduce((soma, a) => soma + a.valor, 0)

  return { agendamentos, total }
}

export async function editarAgendamentoRelatorio(
  id: string,
  dados: { clienteNome?: string; valor: number }
) {
  const tenantId = await getTenantId()

  if (dados.clienteNome !== undefined) {
    await db.$executeRaw`
      UPDATE "Agendamento" ag
      SET valor = ${dados.valor}, observacao = ${dados.clienteNome}
      FROM "Quadra" q
      WHERE ag.id = ${id} AND ag."quadraId" = q.id AND q."tenantId" = ${tenantId}
    `
  } else {
    await db.$executeRaw`
      UPDATE "Agendamento" ag
      SET valor = ${dados.valor}
      FROM "Quadra" q
      WHERE ag.id = ${id} AND ag."quadraId" = q.id AND q."tenantId" = ${tenantId}
    `
  }
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

  const [{ quantidadeVendas }] = await db.$queryRaw<Array<{ quantidadeVendas: string }>>`
    SELECT COUNT(*)::text AS "quantidadeVendas"
    FROM "Venda" v
    WHERE v."tenantId" = ${tenantId}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') >= ${dataInicio}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') <= ${dataFim}
  `

  return { itens, total, quantidadeVendas: Number(quantidadeVendas) }
}

export type PedidoProdutoRelatorio = {
  itemVendaId: string
  clienteNome: string
  quantidade: number
  preco: number
  data: string
  hora: string
}

export async function buscarClientesPorProduto(nomeProduto: string, dataInicio: string, dataFim: string) {
  const tenantId = await getTenantId()

  const rows = await db.$queryRaw<Array<{
    itemVendaId: string
    clienteNome: string
    quantidade: number
    preco: string
    data: string
    hora: string
  }>>`
    SELECT
      i.id AS "itemVendaId",
      COALESCE(NULLIF(v.cliente, ''), 'Sem nome') AS "clienteNome",
      i.quantidade,
      i.preco::text,
      TO_CHAR(v."criadoEm", 'YYYY-MM-DD') AS "data",
      TO_CHAR(v."criadoEm", 'HH24:MI')    AS "hora"
    FROM "Venda" v
    JOIN "ItemVenda" i ON i."vendaId" = v.id
    WHERE v."tenantId" = ${tenantId}
      AND i.nome = ${nomeProduto}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') >= ${dataInicio}
      AND TO_CHAR(v."criadoEm", 'YYYY-MM-DD') <= ${dataFim}
    ORDER BY v."criadoEm" DESC
  `

  const pedidos: PedidoProdutoRelatorio[] = rows.map((r) => ({
    itemVendaId: r.itemVendaId,
    clienteNome: r.clienteNome,
    quantidade: r.quantidade,
    preco: Number(r.preco),
    data: r.data,
    hora: r.hora,
  }))

  return { pedidos }
}

export async function editarItemVendaRelatorio(
  itemVendaId: string,
  dados: { quantidade: number; preco: number }
) {
  const tenantId = await getTenantId()

  await db.$executeRaw`
    UPDATE "ItemVenda" iv
    SET quantidade = ${dados.quantidade}, preco = ${dados.preco}
    FROM "Venda" v
    WHERE iv.id = ${itemVendaId} AND iv."vendaId" = v.id AND v."tenantId" = ${tenantId}
  `

  await db.$executeRaw`
    UPDATE "Venda" v
    SET total = (SELECT COALESCE(SUM(preco * quantidade), 0) FROM "ItemVenda" WHERE "vendaId" = v.id)
    WHERE v.id = (SELECT "vendaId" FROM "ItemVenda" WHERE id = ${itemVendaId})
      AND v."tenantId" = ${tenantId}
  `
}
