"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"

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

interface AnalyticsContentProps {
  patients: Patient[]
  readings: BiteForceReading[]
}

export default function AnalyticsContent({ patients, readings }: AnalyticsContentProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("7")

  // Filter readings based on selected patient and time range
  const filteredReadings = readings.filter((reading) => {
    const isPatientMatch = selectedPatient === "all" || reading.patient_id === selectedPatient
    const isTimeMatch = (() => {
      const days = Number.parseInt(timeRange)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      return new Date(reading.timestamp) >= cutoffDate
    })()
    return isPatientMatch && isTimeMatch
  })

  // Prepare daily trend data
  const dailyTrendData = (() => {
    const dailyData: { [key: string]: { total: number; count: number } } = {}

    filteredReadings.forEach((reading) => {
      const date = reading.session_date
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, count: 0 }
      }
      dailyData[date].total += reading.force_value
      dailyData[date].count += 1
    })

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
        fullDate: date,
        force: Math.round(data.total / data.count),
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-10) // Show last 10 days
  })()

  // Prepare hourly distribution data
  const hourlyDistributionData = (() => {
    const hourlyData: { [key: number]: number[] } = {}

    filteredReadings.forEach((reading) => {
      const hour = new Date(reading.timestamp).getHours()
      if (!hourlyData[hour]) {
        hourlyData[hour] = []
      }
      hourlyData[hour].push(reading.force_value)
    })

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, "0")}:00`,
      force: hourlyData[hour]
        ? Math.round(hourlyData[hour].reduce((sum, val) => sum + val, 0) / hourlyData[hour].length)
        : 0,
      count: hourlyData[hour]?.length || 0,
    })).filter((data) => data.count > 0)
  })()

  // Prepare patient comparison data
  const patientComparisonData = patients
    .map((patient) => {
      const patientReadings = readings.filter((r) => r.patient_id === patient.id)
      const averageForce =
        patientReadings.length > 0
          ? Math.round(patientReadings.reduce((sum, r) => sum + r.force_value, 0) / patientReadings.length)
          : 0

      return {
        name: patient.full_name.split(" ")[0], // First name only
        force: averageForce,
        readings: patientReadings.length,
      }
    })
    .filter((data) => data.readings > 0)

  // Calculate statistics
  const stats = {
    totalReadings: filteredReadings.length,
    averageForce:
      filteredReadings.length > 0
        ? Math.round(filteredReadings.reduce((sum, r) => sum + r.force_value, 0) / filteredReadings.length)
        : 0,
    maxForce: filteredReadings.length > 0 ? Math.max(...filteredReadings.map((r) => r.force_value)) : 0,
    activeDays: new Set(filteredReadings.map((r) => r.session_date)).size,
  }

  // chart colors (kept inline where needed)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-700">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-700">Força de mordida ao longo do tempo</h1>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecionar paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pacientes</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="14">Últimos 14 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalReadings}</div>
                  <p className="text-xs text-gray-500 mt-1">Leituras</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageForce}</div>
                  <p className="text-xs text-gray-500 mt-1">Força média (N)</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.maxForce}</div>
                  <p className="text-xs text-gray-500 mt-1">Força máxima (N)</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeDays}</div>
                  <p className="text-xs text-gray-500 mt-1">Dias ativos</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Trend Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Tendência da Força de Mordida</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyTrendData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      domain={[100, 600]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`${value} N`, "Força"]}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="force"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#2563EB", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        {hourlyDistributionData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Distribuição por Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`${value} N`, "Força média"]}
                      labelFormatter={(label) => `Horário: ${label}`}
                    />
                    <Bar dataKey="force" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Comparison */}
        {patientComparisonData.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Comparação entre Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "force" ? `${value} N` : value,
                        name === "force" ? "Força média" : "Leituras",
                      ]}
                    />
                    <Bar dataKey="force" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No data message */}
        {filteredReadings.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
              <p className="text-gray-500">Não há dados de força de mordida para os filtros selecionados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
