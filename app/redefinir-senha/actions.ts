"use server"

import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function redefinirSenha(
  token: string,
  novaSenha: string,
): Promise<{ ok: boolean; erro?: string }> {
  try {
    if (!novaSenha || novaSenha.length < 6) {
      return { ok: false, erro: "A senha deve ter pelo menos 6 caracteres." }
    }

    const registro = await db.tokenRedefinicaoSenha.findUnique({ where: { token } })

    if (!registro || registro.usado) {
      return { ok: false, erro: "Link inválido ou já utilizado." }
    }

    if (new Date() > registro.expiraEm) {
      return { ok: false, erro: "Este link expirou. Solicite um novo." }
    }

    const senhaHash = await hash(novaSenha, 12)

    await db.usuario.update({
      where: { email: registro.email },
      data: { senha: senhaHash },
    })

    await db.tokenRedefinicaoSenha.update({
      where: { token },
      data: { usado: true },
    })

    return { ok: true }
  } catch (e) {
    console.error("[redefinirSenha]", e)
    return { ok: false, erro: "Erro ao redefinir a senha. Tente novamente." }
  }
}

export async function validarToken(token: string): Promise<{ valido: boolean; email?: string }> {
  try {
    const registro = await db.tokenRedefinicaoSenha.findUnique({ where: { token } })
    if (!registro || registro.usado || new Date() > registro.expiraEm) {
      return { valido: false }
    }
    return { valido: true, email: registro.email }
  } catch {
    return { valido: false }
  }
}
