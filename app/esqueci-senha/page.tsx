"use client"

import { useState } from "react"
import { ArrowLeft, Trophy, Mail, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { solicitarRedefinicao } from "./actions"

export default function EsqueciSenhaPage() {
  const [email, setEmail]       = useState("")
  const [enviado, setEnviado]   = useState(false)
  const [erro, setErro]         = useState("")
  const [carregando, setLoad]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setLoad(true)
    const resultado = await solicitarRedefinicao(email.trim().toLowerCase())
    setLoad(false)
    if (!resultado.ok) {
      setErro(resultado.erro ?? "Erro ao enviar. Tente novamente.")
      return
    }
    setEnviado(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#050a05" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.18) 0%, transparent 70%)" }} />
      </div>

      <a
        href="/login"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao login
      </a>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Brejão Arena</h1>
          <p className="text-muted-foreground text-sm mt-1">Recuperação de senha</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl shadow-black/60">
          {enviado ? (
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">E-mail enviado!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Se existe uma conta com <span className="text-foreground font-medium">{email}</span>, você receberá um link para redefinir sua senha. Verifique também a caixa de spam.
                </p>
              </div>
              <a href="/login" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                Voltar ao login
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground mb-1">Esqueceu sua senha?</p>
              <p className="text-xs text-muted-foreground mb-5">
                Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pl-9 focus:border-primary"
                    />
                  </div>
                </div>

                {erro && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    {erro}
                  </p>
                )}

                <Button type="submit" disabled={carregando || !email} className="w-full h-11 font-semibold shadow-lg shadow-primary/20">
                  {carregando ? "Enviando..." : "Enviar link de redefinição"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
