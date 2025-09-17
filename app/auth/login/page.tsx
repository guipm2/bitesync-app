"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      // Sync session cookies on the server so Edge middleware can see them.
      const tokens = signInData?.session
        ? { access_token: signInData.session.access_token, refresh_token: signInData.session.refresh_token }
        : null

      if (tokens) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokens),
          credentials: "include",
        })
      }

      // Full navigation to ensure cookies go with the request.
      window.location.href = "/dashboard"
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-3 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-xs relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-700 mb-2 drop-shadow-sm">BITESYNC</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Nome de usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center bg-red-50/80 backdrop-blur-sm py-2 px-3 rounded-lg border border-red-200/50">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-gray-600 hover:text-blue-600 underline decoration-1 underline-offset-2 hover:decoration-blue-600 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <div className="mt-4 text-center text-xs">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link
              href="/auth/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors"
            >
              Clique aqui para criar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
