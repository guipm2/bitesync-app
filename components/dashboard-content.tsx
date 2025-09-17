"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Users, BarChart3, Settings, LogOut, Activity, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Profile {
  full_name?: string
  avatar_url?: string
}

interface DashboardContentProps {
  user: User
  profile?: Profile
  patientsCount: number
  readingsCount: number
  averageForce: number
}

export default function DashboardContent({
  user,
  profile,
  patientsCount,
  readingsCount,
  averageForce,
}: DashboardContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 h-10 w-10 hover:bg-white/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-700">BITESYNC</h1>
          </div>

          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
              {getInitials(profile?.full_name || user.email || "U")}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-lg shadow-xl border-r border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-lg font-bold text-slate-700">Menu</h2>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/patients"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Pacientes</span>
              </Link>

              <Link
                href="/analytics"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Gráficos</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Configurações</span>
              </Link>

              <Link
                href="/demo-setup"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Activity className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Dados Demo</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200 w-full text-left"
              >
                <LogOut className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-600">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, {profile?.full_name || "Usuário"}!</h2>
          <p className="text-gray-600">Monitore a força de mordida e previna o bruxismo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Estatísticas Gerais</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/40 rounded-xl">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{patientsCount}</div>
                <p className="text-sm text-gray-600">Pacientes</p>
              </div>

              <div className="text-center p-4 bg-white/40 rounded-xl">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{readingsCount}</div>
                <p className="text-sm text-gray-600">Leituras</p>
              </div>

              <div className="text-center p-4 bg-white/40 rounded-xl">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{averageForce}</div>
                <p className="text-sm text-gray-600">Força Média (N)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
          <div className="space-y-4">
            <Link href="/patients">
              <Button className="w-full justify-start h-12 bg-blue-600/90 hover:bg-blue-700 text-white rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 mr-3" />
                Gerenciar Pacientes
              </Button>
            </Link>

            <Link href="/analytics">
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-white/40 hover:bg-white/60 border-white/30 rounded-xl backdrop-blur-sm"
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Ver Gráficos e Análises
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-white/40 hover:bg-white/60 border-white/30 rounded-xl backdrop-blur-sm"
              >
                <Settings className="h-5 w-5 mr-3" />
                Configurações do Sistema
              </Button>
            </Link>
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status do Dispositivo</h3>
          <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Protótipo em Desenvolvimento</span>
            </div>
            <span className="text-sm text-gray-500">Dados simulados</span>
          </div>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            O dispositivo físico está em desenvolvimento. Os dados exibidos são simulados para demonstração das
            funcionalidades.
          </p>
        </div>
      </main>
    </div>
  )
}
