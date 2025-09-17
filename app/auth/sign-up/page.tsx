"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "")
    if (numbers.length !== 11) return false

    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(numbers)) return false

    // Validate CPF algorithm
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(numbers[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(numbers[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0

    return Number.parseInt(numbers[9]) === digit1 && Number.parseInt(numbers[10]) === digit2
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!fullName.trim()) {
        throw new Error("Nome completo é obrigatório")
      }
      if (!cpf.trim()) {
        throw new Error("CPF é obrigatório")
      }
      if (!validateCPF(cpf)) {
        throw new Error("CPF inválido")
      }
      if (!phone.trim()) {
        throw new Error("Telefone é obrigatório")
      }
      if (!birthDate) {
        throw new Error("Data de nascimento é obrigatória")
      }

      // Envia os dados para a rota server-side
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: fullName.trim(),
          cpf,
          phone,
          birthDate,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar conta")
      }

      if (result.user) {
        console.log("Usuário criado com sucesso.", result.user.id)
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.log("Erro ao criar conta:", error)
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-3 relative overflow-hidden">
      {/* ... existing background elements ... */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-xs relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-700 mb-2 drop-shadow-sm">BITESYNC</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-5 shadow-2xl">
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                maxLength={14}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                maxLength={15}
                required
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="date"
                placeholder="Data de nascimento"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-10 px-3 text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 placeholder:text-gray-500 transition-all duration-200"
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
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs">
            <span className="text-gray-600">Já tem uma conta? </span>
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
