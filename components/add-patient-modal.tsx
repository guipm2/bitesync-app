"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onPatientAdded: () => void
}

export default function AddPatientModal({ isOpen, onClose, userId, onPatientAdded }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("patients").insert({
        user_id: userId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        birth_date: formData.birth_date || null,
      })

      if (error) throw error

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        birth_date: "",
      })

      onPatientAdded()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao adicionar paciente")
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-700">Adicionar Paciente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
