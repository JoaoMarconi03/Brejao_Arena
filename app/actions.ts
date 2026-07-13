"use server"

import { db } from "@/lib/db"

export async function buscarTenantPublico(slug: string) {
  const rows = await db.$queryRaw<Array<{ id: string; nome: string; whatsapp: string | null }>>`
    SELECT id, nome, whatsapp FROM "Tenant" WHERE slug = ${slug} LIMIT 1
  `
  const tenant = rows[0]
  if (!tenant) return null

  const quadrasRaw = await db.$queryRaw<Array<{
    id: string; nome: string; descricao: string | null
    valor1h: string | null; valor1h30: string | null; valor2h: string | null
    horaAbertura: string; horaFechamento: string
    horaAberturaFds: string; horaFechamentoFds: string
    diasFuncionamento: string
  }>>`
    SELECT id, nome, descricao,
           "horaAbertura", "horaFechamento",
           "horaAberturaFds", "horaFechamentoFds",
           "diasFuncionamento",
           valor1h::text, valor1h30::text, valor2h::text
    FROM "Quadra"
    WHERE "tenantId" = ${tenant.id} AND ativa = true
    ORDER BY nome ASC
  `
  return {
    ...tenant,
    quadras: quadrasRaw.map((q) => ({
      ...q,
      valor1h:   q.valor1h   ? Number(q.valor1h)   : null,
      valor1h30: q.valor1h30 ? Number(q.valor1h30) : null,
      valor2h:   q.valor2h   ? Number(q.valor2h)   : null,
    })),
  }
}

// Ação pública (sem login) — usada na home para mostrar disponibilidade real.
export async function buscarOcupacoesPublico(
  quadraId: string,
  dataStr: string // "YYYY-MM-DD"
): Promise<{ inicio: string; fim: string }[]> {
  if (!quadraId) return []

  const rows = await db.$queryRaw<Array<{ inicio: string; fim: string }>>`
    SELECT
      TO_CHAR(inicio, 'HH24:MI') AS inicio,
      TO_CHAR(fim,    'HH24:MI') AS fim
    FROM "Agendamento"
    WHERE "quadraId" = ${quadraId}
      AND status IN ('CONFIRMADO'::"StatusAgendamento", 'PENDENTE'::"StatusAgendamento", 'PAGO'::"StatusAgendamento")
      AND TO_CHAR(inicio, 'YYYY-MM-DD') = ${dataStr}
    ORDER BY inicio ASC
  `

  return rows
}
