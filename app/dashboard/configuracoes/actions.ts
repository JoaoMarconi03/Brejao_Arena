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
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { nome: true, whatsapp: true },
  })
  return tenant
}

export async function salvarWhatsApp(whatsapp: string): Promise<{ ok: boolean; erro?: string }> {
  try {
    const tenantId = await getTenantId()
    const limpo = whatsapp.replace(/\D/g, "")
    if (limpo.length < 10 || limpo.length > 13) {
      return { ok: false, erro: "Número inválido. Use o formato: 5511999998888" }
    }
    await db.tenant.update({ where: { id: tenantId }, data: { whatsapp: limpo } })
    revalidatePath("/dashboard/configuracoes")
    return { ok: true }
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : String(e) }
  }
}
