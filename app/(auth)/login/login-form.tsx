"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Trophy, ArrowLeft } from "lucide-react"

/* ─── Brejão Arena (layout split escuro + branco) ─────────────── */
function LoginBrejao({
  tenantNome,
  tenantSlug,
  voltarHref,
  onSubmit,
  email,
  setEmail,
  senha,
  setSenha,
  mostrarSenha,
  setMostrarSenha,
  erro,
  carregando,
}: FormProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "#0a0a0a" }}>

      {/* Painel esquerdo */}
      <div
        className="lg:w-[45%] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #020902 0%, #041404 50%, #071a07 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(34,197,94,0.14) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 70% 80%, rgba(22,163,74,0.09) 0%, transparent 60%)" }} />
        </div>

        <div className="relative">
          <a href={voltarHref} className="inline-flex items-center gap-1.5 text-sm mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </a>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#16a34a" }}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">{tenantNome}</span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <p className="text-3xl font-bold text-white leading-snug mb-3">
            A sua quadra<br />em Brejão.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
            Agendamentos, fiado, clientes e muito mais em um só lugar.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário branco */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12" style={{ background: "#ffffff" }}>
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#0a0a0a" }}>Entrar na conta</h2>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>Bem-vindo de volta</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium" style={{ color: "#374151" }}>E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  display: "block", width: "100%", padding: "0.6rem 0.85rem",
                  borderRadius: "0.5rem", border: "1.5px solid #e5e7eb",
                  fontSize: "0.875rem", color: "#111827", background: "#fff",
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-xs font-medium" style={{ color: "#374151" }}>Senha</label>
                <a href="/esqueci-senha" className="text-xs font-medium" style={{ color: "#16a34a" }}>
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  style={{
                    display: "block", width: "100%", padding: "0.6rem 2.5rem 0.6rem 0.85rem",
                    borderRadius: "0.5rem", border: "1.5px solid #e5e7eb",
                    fontSize: "0.875rem", color: "#111827", background: "#fff",
                    outline: "none", transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca" }}>
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                width: "100%", height: "2.75rem", borderRadius: "0.5rem",
                background: carregando ? "#15803d" : "#16a34a", color: "#fff",
                fontWeight: 600, fontSize: "0.875rem", border: "none",
                cursor: carregando ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => { if (!carregando) (e.currentTarget.style.background = "#15803d") }}
              onMouseOut={(e) => { if (!carregando) (e.currentTarget.style.background = "#16a34a") }}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#6b7280" }}>
            Não tem conta?{" "}
            <a
              href={tenantSlug ? `/registro?arena=${tenantSlug}` : "/registro"}
              style={{ color: "#16a34a", fontWeight: 500 }}
            >
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Arena Votocel (tema profissional branco/verde/preto) ──────── */
function LoginVotocel({
  tenantNome,
  tenantSlug,
  voltarHref,
  onSubmit,
  email,
  setEmail,
  senha,
  setSenha,
  mostrarSenha,
  setMostrarSenha,
  erro,
  carregando,
}: FormProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "#0a0a0a" }}>

      {/* Painel esquerdo — identidade visual */}
      <div
        className="lg:w-[45%] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0a0a0a 0%, #071207 50%, #0d1f0d 100%)" }}
      >
        {/* Brilho verde sutil */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(34,197,94,0.12) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 70% 80%, rgba(22,163,74,0.08) 0%, transparent 60%)" }} />
        </div>

        {/* Logo + nome */}
        <div className="relative">
          <a href={voltarHref} className="inline-flex items-center gap-1.5 text-sm mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </a>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#16a34a" }}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">{tenantNome}</span>
          </div>
        </div>

        {/* Tagline — visível apenas desktop */}
        <div className="relative hidden lg:block">
          <p className="text-3xl font-bold text-white leading-snug mb-3">
            Gestão completa<br />da sua arena.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
            Agendamentos, fiado, clientes e muito mais em um só lugar.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário branco */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12" style={{ background: "#ffffff" }}>
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#0a0a0a" }}>Entrar na conta</h2>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>Bem-vindo de volta</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium" style={{ color: "#374151" }}>E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  display: "block", width: "100%", padding: "0.6rem 0.85rem",
                  borderRadius: "0.5rem", border: "1.5px solid #e5e7eb",
                  fontSize: "0.875rem", color: "#111827", background: "#fff",
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-xs font-medium" style={{ color: "#374151" }}>Senha</label>
                <a href="/esqueci-senha" className="text-xs font-medium" style={{ color: "#16a34a" }}>
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  style={{
                    display: "block", width: "100%", padding: "0.6rem 2.5rem 0.6rem 0.85rem",
                    borderRadius: "0.5rem", border: "1.5px solid #e5e7eb",
                    fontSize: "0.875rem", color: "#111827", background: "#fff",
                    outline: "none", transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca" }}>
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                width: "100%", height: "2.75rem", borderRadius: "0.5rem",
                background: carregando ? "#15803d" : "#16a34a", color: "#fff",
                fontWeight: 600, fontSize: "0.875rem", border: "none",
                cursor: carregando ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => { if (!carregando) (e.currentTarget.style.background = "#15803d") }}
              onMouseOut={(e) => { if (!carregando) (e.currentTarget.style.background = "#16a34a") }}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#6b7280" }}>
            Não tem conta?{" "}
            <a
              href={tenantSlug ? `/registro?arena=${tenantSlug}` : "/registro"}
              style={{ color: "#16a34a", fontWeight: 500 }}
            >
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Tipos compartilhados ──────────────────────────────────────── */
type FormProps = {
  tenantNome: string
  tenantSlug?: string
  voltarHref: string
  onSubmit: (e: React.FormEvent) => void
  email: string
  setEmail: (v: string) => void
  senha: string
  setSenha: (v: string) => void
  mostrarSenha: boolean
  setMostrarSenha: (fn: (v: boolean) => boolean) => void
  erro: string
  carregando: boolean
}


/* ─── Componente principal ──────────────────────────────────────── */
export function LoginForm({
  tenantNome = "Gestão de Arena",
  tenantSlug,
  voltarHref = "/",
  variant = "brejao",
}: {
  tenantNome?: string
  tenantSlug?: string
  voltarHref?: string
  variant?: "brejao" | "votocel"
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    const resultado = await signIn("credentials", { email, password: senha, redirect: false })
    setCarregando(false)
    if (resultado?.error) { setErro("Email ou senha inválidos."); return }
    router.push("/dashboard")
  }

  const props: FormProps = {
    tenantNome, tenantSlug, voltarHref,
    onSubmit: handleSubmit,
    email, setEmail, senha, setSenha,
    mostrarSenha, setMostrarSenha,
    erro, carregando,
  }

  return variant === "votocel" ? <LoginVotocel {...props} /> : <LoginBrejao {...props} />
}
