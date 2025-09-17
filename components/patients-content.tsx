"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, ChevronRight, Plus, Search, Edit, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PatientModal from "@/components/patient-modal"

interface Patient {
  id: string
  full_name: string
  email: string
  phone?: string
  birth_date?: string
  avatar_url?: string
  created_at: string
}

interface PatientsContentProps {
  patients: Patient[]
  userId: string
}

export default function PatientsContent({ patients, userId }: PatientsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>()
  const router = useRouter()

  const filteredPatients = patients.filter(
    (patient) =>
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAddPatient = () => {
    setModalMode("add")
    setSelectedPatient(undefined)
    setIsModalOpen(true)
  }

  const handleEditPatient = (patient: Patient, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to patient details
    e.stopPropagation()
    setModalMode("edit")
    setSelectedPatient(patient)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPatient(undefined)
  }

  const handlePatientSaved = () => {
    setIsModalOpen(false)
    setSelectedPatient(undefined)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-1rem">
          <div className="flex items-center gap-0.75rem">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-700 h-2.5rem w-2.5rem">
                <ArrowLeft className="h-1.5rem w-1.5rem" />
              </Button>
            </Link>
            <h1 className="text-1.5rem font-bold text-slate-700">Pacientes</h1>
          </div>

          <Button onClick={handleAddPatient} size="icon" className="bg-blue-600 hover:bg-blue-700 h-2.5rem w-2.5rem">
            <Plus className="h-1.25rem w-1.25rem" />
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-1rem">
        <div className="relative">
          <Search className="absolute left-0.75rem top-1/2 transform -translate-y-1/2 text-gray-400 h-1.25rem w-1.25rem" />
          <Input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-2.5rem h-3rem bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="px-1rem pb-1rem">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-3rem">
            <div className="text-gray-400 mb-1rem">
              <Users className="h-4rem w-4rem mx-auto" />
            </div>
            <h3 className="text-1.125rem font-medium text-gray-900 mb-0.5rem">
              {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </h3>
            <p className="text-gray-500 mb-1.5rem text-base">
              {searchTerm
                ? "Tente buscar com outros termos"
                : "Adicione seu primeiro paciente para começar o monitoramento"}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleAddPatient}
                className="bg-blue-600 hover:bg-blue-700 h-2.75rem px-1.5rem text-base"
              >
                <Plus className="h-1.25rem w-1.25rem mr-0.5rem" />
                Adicionar Paciente
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-0.25rem">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white p-1rem rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Link href={`/patients/${patient.id}`} className="flex items-center gap-1rem flex-1 min-w-0">
                    <Avatar className="h-3.5rem w-3.5rem flex-shrink-0">
                      <AvatarImage src={patient.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-1.125rem font-semibold">
                        {getInitials(patient.full_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-1.125rem font-semibold text-slate-700 truncate">{patient.full_name}</h3>
                      <p className="text-gray-600 text-base truncate">{patient.email}</p>
                      {patient.phone && <p className="text-sm text-gray-500 truncate">{patient.phone}</p>}
                    </div>
                  </Link>

                  <div className="flex items-center gap-0.5rem flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditPatient(patient, e)}
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-2.25rem w-2.25rem"
                    >
                      <Edit className="h-1rem w-1rem" />
                    </Button>

                    <Link href={`/patients/${patient.id}`}>
                      <ChevronRight className="h-1.5rem w-1.5rem text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userId={userId}
        onPatientSaved={handlePatientSaved}
        patient={selectedPatient}
        mode={modalMode}
      />
    </div>
  )
}
