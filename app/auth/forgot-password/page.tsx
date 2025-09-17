"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao enviar email de recuperação")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-700 mb-2 drop-shadow-sm">BITESYNC</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Email enviado!</h2>
            <p className="text-gray-600 mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
            </p>

            <Link href="/auth/login">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-2xl transition-all duration-200">
                Voltar ao login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-2 drop-shadow-sm">BITESYNC</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/auth/login">
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold text-gray-800">Recuperar senha</h2>
          </div>

          <p className="text-gray-600 text-sm mb-6">Digite seu email para receber um link de recuperação de senha.</p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50/80 backdrop-blur-sm py-2 px-3 rounded-xl border border-red-200/50">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Lembrou da senha? </span>
            <Link
              href="/auth/login"
              className="text-purple-600 hover:text-purple-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-purple-700 transition-colors"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
