"use server"

import { db } from "@/lib/db"

export async function buscarTenantPublico(slug: string) {
  const rows = await db.$queryRaw<Array<{ id: string; nome: string; whatsapp: string | null }>>`
    SELECT id, nome, whatsapp FROM "Tenant" WHERE slug = ${slug} LIMIT 1
  `
  const tenant = rows[0]
  if (!tenant) return null

  const quadras = await db.quadra.findMany({
    where: { tenantId: tenant.id, ativa: true },
    select: {
      id: true, nome: true, descricao: true,
      valor1h: true, valor1h30: true, valor2h: true,
      horaAbertura: true, horaFechamento: true,
      horaAberturaFds: true, horaFechamentoFds: true,
      diasFuncionamento: true,
    },
    orderBy: { nome: "asc" },
  })
  return {
    ...tenant,
    quadras: quadras.map((q) => ({
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
