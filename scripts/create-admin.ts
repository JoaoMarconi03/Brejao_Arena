import { config } from "dotenv"
config({ path: ".env", override: true })

async function main() {
  const { db } = await import("../lib/db")
  const { hash } = await import("bcryptjs")

  const email = "joao@brejao.com"
  const senha = "Brejo@2025"

  const existente = await db.usuario.findUnique({ where: { email } })
  if (existente) {
    const h = await hash(senha, 12)
    await db.usuario.update({ where: { email }, data: { senha: h } })
    console.log("✅ Senha atualizada para o usuário existente.")
    return
  }

  const tenant = await db.tenant.findFirst({ where: { slug: "brejao-arena" } })
  if (!tenant) {
    console.error("❌ Tenant não encontrado. Rode npm run seed primeiro.")
    return
  }

  const h = await hash(senha, 12)
  await db.usuario.create({
    data: { nome: "João (Admin)", email, senha: h, role: "ADMIN", tenantId: tenant.id },
  })

  console.log("✅ Admin criado com sucesso!")
  console.log("   Email:", email)
  console.log("   Senha:", senha)
}

main().catch(console.error).finally(() => process.exit(0))
