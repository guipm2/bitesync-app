"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface Patient {
  id: string
  full_name: string
  email: string
  phone?: string
  birth_date?: string
  avatar_url?: string
  created_at: string
}

interface BiteForceReading {
  id: string
  patient_id: string
  force_value: number
  timestamp: string
  session_date: string
  created_at: string
}

interface PatientDetailsContentProps {
  patient: Patient
  readings: BiteForceReading[]
  sessionDates: string[]
}

export default function PatientDetailsContent({ patient, readings, sessionDates }: PatientDetailsContentProps) {
  const [selectedDate, setSelectedDate] = useState(sessionDates[0] || "")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Get readings for selected date and group by hour
  const selectedDateReadings = readings.filter((reading) => reading.session_date === selectedDate)

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourReadings = selectedDateReadings.filter((reading) => {
      const readingHour = new Date(reading.timestamp).getHours()
      return readingHour === hour
    })

    const averageForce =
      hourReadings.length > 0
        ? Math.round(hourReadings.reduce((sum, r) => sum + r.force_value, 0) / hourReadings.length)
        : 0

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      force: averageForce,
    }
  }).filter((data) => data.force > 0) // Only show hours with data

  // Calculate statistics for selected date
  const selectedDateStats = {
    totalReadings: selectedDateReadings.length,
    averageForce:
      selectedDateReadings.length > 0
        ? Math.round(selectedDateReadings.reduce((sum, r) => sum + r.force_value, 0) / selectedDateReadings.length)
        : 0,
    maxForce: selectedDateReadings.length > 0 ? Math.max(...selectedDateReadings.map((r) => r.force_value)) : 0,
    minForce: selectedDateReadings.length > 0 ? Math.min(...selectedDateReadings.map((r) => r.force_value)) : 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/patients">
              <Button variant="ghost" size="icon" className="text-slate-700">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-700">BITESYNC</h1>
          </div>
        </div>
      </header>

      {/* Patient Info */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={patient.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
              {getInitials(patient.full_name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-bold text-slate-700">{patient.full_name}</h2>
            <p className="text-gray-600">{patient.email}</p>
            {patient.phone && <p className="text-sm text-gray-500">{patient.phone}</p>}
          </div>
        </div>

        {/* Usage History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Histórico de uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionDates.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado de uso disponível</p>
            ) : (
              <div className="space-y-2">
                {sessionDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDate === date ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Force Chart */}
        {selectedDate && hourlyData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Força de mordida ({formatDate(selectedDate)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      domain={[0, 600]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`${value} N`, "Força"]}
                      labelFormatter={(label) => `Horário: ${label}`}
                    />
                    <Bar dataKey="force" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {selectedDate && selectedDateReadings.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{selectedDateStats.averageForce}</div>
                <p className="text-xs text-gray-500 mt-1">Força média (N)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{selectedDateStats.maxForce}</div>
                <p className="text-xs text-gray-500 mt-1">Força máxima (N)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{selectedDateStats.totalReadings}</div>
                <p className="text-xs text-gray-500 mt-1">Total de leituras</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{selectedDateStats.minForce}</div>
                <p className="text-xs text-gray-500 mt-1">Força mínima (N)</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No data message */}
        {selectedDate && selectedDateReadings.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Nenhum dado disponível para {formatDate(selectedDate)}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
