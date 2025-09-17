"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface Patient {
  id: string
  full_name: string
  email: string
  phone?: string
  birth_date?: string
  avatar_url?: string
  created_at: string
}

interface PatientModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onPatientSaved: () => void
  patient?: Patient
  mode: "add" | "edit"
}

export default function PatientModal({ isOpen, onClose, userId, onPatientSaved, patient, mode }: PatientModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (mode === "edit" && patient) {
      setFormData({
        full_name: patient.full_name,
        email: patient.email,
        phone: patient.phone || "",
        birth_date: patient.birth_date || "",
      })
    } else {
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        birth_date: "",
      })
    }
  }, [mode, patient, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === "add") {
        const { error } = await supabase.from("patients").insert({
          user_id: userId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          birth_date: formData.birth_date || null,
        })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("patients")
          .update({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null,
            birth_date: formData.birth_date || null,
          })
          .eq("id", patient!.id)
        if (error) throw error
      }

      onPatientSaved()
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : `Erro ao ${mode === "add" ? "adicionar" : "atualizar"} paciente`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      birth_date: "",
    })
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-700">
            {mode === "add" ? "Adicionar Paciente" : "Editar Paciente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-1rem">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
              Nome completo *
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="mt-0.25rem h-2.75rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-0.25rem h-2.75rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="mt-0.25rem h-2.75rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            />
          </div>

          <div>
            <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700">
              Data de nascimento
            </Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="mt-0.25rem h-2.75rem border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-0.75rem pt-1rem">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent h-2.75rem text-base"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 h-2.75rem text-base"
            >
              {isLoading
                ? mode === "add"
                  ? "Adicionando..."
                  : "Salvando..."
                : mode === "add"
                  ? "Adicionar"
                  : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
