"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, UserIcon, Settings, Moon, Bell, Shield, Camera, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  full_name?: string
  email?: string
  cpf?: string
  address?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface SettingsContentProps {
  user: User
  profile: Profile | null
}

export default function SettingsContent({ user, profile }: SettingsContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || user.email || "",
    cpf: profile?.cpf || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
  })

  const router = useRouter()
  const supabase = createClient()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profileData.full_name,
        email: profileData.email,
        cpf: profileData.cpf,
        address: profileData.address,
        phone: profileData.phone,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setSuccess("Perfil atualizado com sucesso!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsLoading(true)
    try {
      // Note: In a real app, you'd want to handle this server-side
      // This is just for demonstration
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao excluir conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        throw new Error("Por favor, selecione uma imagem válida")
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("A imagem deve ter no máximo 5MB")
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setSuccess("Foto de perfil atualizada com sucesso!")
      setTimeout(() => setSuccess(null), 3000)

      // Refresh the page to show new avatar
      window.location.reload()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer upload da imagem")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-0.75rem">
          <div className="flex items-center gap-0.5rem">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-700 h-2.25rem w-2.25rem">
                <ArrowLeft className="h-1.25rem w-1.25rem" />
              </Button>
            </Link>
            <h1 className="text-1.5rem font-bold text-slate-700">Configurações</h1>
          </div>
        </div>
      </header>

      <div className="p-0.75rem space-y-1rem">
        {/* Profile Section */}
        <Card>
          <CardHeader className="pb-0.75rem">
            <CardTitle className="text-1.125rem font-semibold text-gray-900 flex items-center gap-0.5rem">
              <UserIcon className="h-1.25rem w-1.25rem" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          {/* Avatar Section */}
          <CardContent className="space-y-1rem">
            <div className="flex items-center gap-0.75rem">
              <Avatar className="h-4rem w-4rem">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-1.125rem font-semibold">
                  {getInitials(profileData.full_name || user.email || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-base">Foto do perfil</h3>
                <p className="text-sm text-gray-500 mb-0.5rem">Clique para alterar sua foto</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Button variant="outline" size="sm" className="bg-transparent h-2rem text-sm" disabled={isLoading}>
                    <Camera className="h-1rem w-1rem mr-0.5rem" />
                    {isLoading ? "Enviando..." : "Alterar foto"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-0.75rem">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0.75rem">
                <div>
                  <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                    Nome completo
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="mt-0.25rem h-2.25rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-0.25rem h-2.25rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={profileData.cpf}
                    onChange={(e) => setProfileData({ ...profileData, cpf: formatCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    readOnly
                    className="mt-0.25rem h-2.25rem border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-base"
                  />
                  <p className="text-xs text-gray-500 mt-0.25rem">CPF não pode ser alterado</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: formatPhone(e.target.value) })}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="mt-0.25rem h-2.25rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Endereço
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="mt-0.25rem h-2.25rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-2.5rem text-base"
              >
                {isLoading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-1rem w-1rem mr-0.5rem" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader className="pb-0.75rem">
            <CardTitle className="text-1.125rem font-semibold text-gray-900 flex items-center gap-0.5rem">
              <Settings className="h-1.25rem w-1.25rem" />
              Configurações do Sistema
            </CardTitle>
          </CardHeader>
          {/* Dark Mode */}
          <CardContent className="space-y-1rem">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.75rem">
                <Moon className="h-1.25rem w-1.25rem text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900 text-base">Modo noturno</h3>
                  <p className="text-sm text-gray-500">Ativar tema escuro</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.75rem">
                <Bell className="h-1.25rem w-1.25rem text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900 text-base">Notificações push</h3>
                  <p className="text-sm text-gray-500">Receber notificações no dispositivo</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Separator />

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.75rem">
                <Bell className="h-1.25rem w-1.25rem text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900 text-base">Notificações por email</h3>
                  <p className="text-sm text-gray-500">Receber relatórios e alertas por email</p>
                </div>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader className="pb-0.75rem">
            <CardTitle className="text-1.125rem font-semibold text-gray-900 flex items-center gap-0.5rem">
              <Shield className="h-1.25rem w-1.25rem" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.75rem">
            <div>
              <h3 className="font-medium text-gray-900 mb-0.5rem text-base">Alterar senha</h3>
              <p className="text-sm text-gray-500 mb-0.75rem">
                Para alterar sua senha, você receberá um email com instruções.
              </p>
              <Button variant="outline" className="bg-transparent h-2.25rem text-base">
                Solicitar alteração de senha
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-red-600 mb-0.5rem text-base">Zona de perigo</h3>
              <p className="text-sm text-gray-500 mb-0.75rem">
                Excluir sua conta removerá permanentemente todos os seus dados.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 h-2.25rem text-base"
              >
                <Trash2 className="h-1rem w-1rem mr-0.5rem" />
                Excluir conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader className="pb-0.75rem">
            <CardTitle className="text-1.125rem font-semibold text-gray-900">Sobre o BiteSync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0.5rem text-sm text-gray-600">
              <p>
                <strong>Versão:</strong> 1.0.0 (Beta)
              </p>
              <p>
                <strong>Desenvolvido para:</strong> Análise de força de mordida e prevenção do bruxismo
              </p>
              <p>
                <strong>Status:</strong> Protótipo em desenvolvimento
              </p>
              <p className="text-xs text-gray-500 mt-0.75rem">
                © 2024 BiteSync. Sistema desenvolvido para fins de demonstração e pesquisa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
