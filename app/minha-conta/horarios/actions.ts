"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function criarReserva(dados: {
  clienteId:  string
  quadraId:   string
  data:       string // "YYYY-MM-DD"
  horaInicio: string // "HH:MM"
  horaFim:    string // "HH:MM"
  observacao: string | null
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Não autorizado")

  // Usa SQL puro com ::timestamp para evitar qualquer conversão de timezone pelo Prisma/Neon
  const inicioStr = `${dados.data} ${dados.horaInicio}:00`
  const fimStr    = `${dados.data} ${dados.horaFim}:00`

  await db.$executeRaw`
    INSERT INTO "Agendamento" (id, inicio, fim, status, tipo, "quadraId", "clienteId", observacao, "criadoEm")
    VALUES (
      gen_random_uuid(),
      ${inicioStr}::timestamp,
      ${fimStr}::timestamp,
      'PENDENTE'::"StatusAgendamento",
      'AVULSO'::"TipoAgendamento",
      ${dados.quadraId},
      ${dados.clienteId},
      ${dados.observacao},
      NOW()
    )
  `

  revalidatePath("/minha-conta")
  revalidatePath("/minha-conta/horarios")
}

export async function buscarOcupacoes(
  quadraId: string,
  dataStr: string // "YYYY-MM-DD"
): Promise<{ inicio: string; fim: string }[]> {
  const session = await auth()
  if (!session?.user) return []

  // TO_CHAR lê o valor literal do banco sem qualquer conversão de timezone
  const rows = await db.$queryRaw<Array<{ inicio: string; fim: string }>>`
    SELECT
      TO_CHAR(inicio, 'HH24:MI') AS inicio,
      TO_CHAR(fim,    'HH24:MI') AS fim
    FROM "Agendamento"
    WHERE "quadraId" = ${quadraId}
      AND status IN ('CONFIRMADO'::"StatusAgendamento", 'PENDENTE'::"StatusAgendamento")
      AND inicio >= ${dataStr + " 00:00:00"}::timestamp
      AND fim    <= ${dataStr + " 23:59:59"}::timestamp
    ORDER BY inicio ASC
  `

  return rows
}
