"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

async function getTenantId() {
  const session = await auth()
  const tenantId = (session?.user as any)?.tenantId
  if (!tenantId) throw new Error("Não autorizado")
  return tenantId
}

export async function buscarConfigTenant() {
  const tenantId = await getTenantId()
  const rows = await db.$queryRaw<Array<{ nome: string; whatsapp: string | null }>>`
    SELECT nome, whatsapp FROM "Tenant" WHERE id = ${tenantId} LIMIT 1
  `
  return rows[0] ?? null
}

export async function salvarWhatsApp(whatsapp: string): Promise<{ ok: boolean; erro?: string }> {
  try {
    const tenantId = await getTenantId()
    const limpo = whatsapp.replace(/\D/g, "")
    if (limpo.length < 10 || limpo.length > 13) {
      return { ok: false, erro: "Número inválido. Use o formato: 5511999998888" }
    }
    await db.$executeRaw`UPDATE "Tenant" SET whatsapp = ${limpo} WHERE id = ${tenantId}`
    revalidatePath("/dashboard/configuracoes")
    return { ok: true }
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : String(e) }
  }
}
