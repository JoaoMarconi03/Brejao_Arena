"use server"

import { db } from "@/lib/db"

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
