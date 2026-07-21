import { auth } from "@/auth"
import { db } from "@/lib/db"
import { PendentesAgendamentos } from "@/components/dashboard/pendentes-agendamentos"
import { CalendarioAgendamentos } from "@/components/dashboard/calendario-agendamentos"
import { AutoRefresh } from "@/components/auto-refresh"

export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ clienteId?: string; clienteNome?: string }>
}) {
  const params    = await searchParams
  const clienteFixo =
    params.clienteId && params.clienteNome
      ? { id: params.clienteId, nome: decodeURIComponent(params.clienteNome) }
      : undefined

  const session = await auth()
  const tenantId = (session?.user as any)?.tenantId

  const pendentes = await db.agendamento.findMany({
    where: {
      status: "PENDENTE",
      quadra: { tenantId },
    },
    include: {
      cliente: true,
      quadra: true,
    },
    orderBy: { inicio: "asc" },
  })

  // Busca horários como strings literais para evitar conversão de timezone
  const ids = pendentes.map((p) => p.id)
  const horariosRaw = ids.length
    ? await db.$queryRaw<Array<{ id: string; inicioHora: string; fimHora: string; inicioData: string }>>`
        SELECT
          id,
          TO_CHAR(inicio, 'HH24:MI')    AS "inicioHora",
          TO_CHAR(fim,    'HH24:MI')    AS "fimHora",
          TO_CHAR(inicio, 'YYYY-MM-DD') AS "inicioData"
        FROM "Agendamento"
        WHERE id = ANY(${ids})
      `
    : []

  const horariosMap = Object.fromEntries(horariosRaw.map((h) => [h.id, h]))

  const pendentesSerializados = pendentes.map((p) => ({
    id: p.id,
    inicioHora:  horariosMap[p.id]?.inicioHora  ?? "--:--",
    fimHora:     horariosMap[p.id]?.fimHora     ?? "--:--",
    inicioData:  horariosMap[p.id]?.inicioData  ?? "",
    observacao:  p.observacao,
    clienteNome: p.cliente?.nome ?? null,
    quadraNome:  p.quadra.nome,
  }))

  const tenant = tenantId ? await db.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } }) : null
  const permiteAula = tenant?.slug === "arena-brothers"

  const quadrasRaw = await db.$queryRaw<Array<{
    id: string; nome: string
    valor1h: string | null; valor1h30: string | null; valor2h: string | null
    horaAbertura: string; horaFechamento: string
    horaAberturaFds: string; horaFechamentoFds: string
  }>>`
    SELECT id, nome,
           "horaAbertura", "horaFechamento",
           "horaAberturaFds", "horaFechamentoFds",
           valor1h::text, valor1h30::text, valor2h::text
    FROM "Quadra"
    WHERE "tenantId" = ${tenantId} AND ativa = true
    LIMIT 1
  `
  const quadra = quadrasRaw[0] ?? null

  const precos = {
    valor1h:   quadra?.valor1h   ? Number(quadra.valor1h)   : undefined,
    valor1h30: quadra?.valor1h30 ? Number(quadra.valor1h30) : undefined,
    valor2h:   quadra?.valor2h   ? Number(quadra.valor2h)   : undefined,
  }

  return (
    <div className="flex flex-col h-full">
      <AutoRefresh segundos={5} />
      {pendentesSerializados.length > 0 && (
        <PendentesAgendamentos pendentes={pendentesSerializados} />
      )}
      <CalendarioAgendamentos
        quadraId={quadra?.id ?? ""}
        quadraNome={quadra?.nome ?? "Quadra"}
        precos={precos}
        permiteAula={permiteAula}
        clienteFixo={clienteFixo}
        horaAbertura={quadra?.horaAbertura ?? "08:00"}
        horaFechamento={quadra?.horaFechamento ?? "23:00"}
        horaAberturaFds={quadra?.horaAberturaFds ?? "08:00"}
        horaFechamentoFds={quadra?.horaFechamentoFds ?? "22:00"}
      />
    </div>
  )
}
