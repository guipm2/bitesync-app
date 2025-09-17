"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { createDemoPatients, createDemoBiteForceReadings } from "@/lib/demo-data"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

export default function DemoSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const setupDemoData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("Usuário não autenticado")

      // Create demo patients
      const patients = await createDemoPatients(supabase, user.id)
      if (!patients) throw new Error("Erro ao criar pacientes de demonstração")

      // Create demo bite force readings for each patient
      for (const patient of patients) {
        await createDemoBiteForceReadings(supabase, user.id, patient.id)
      }

      setIsComplete(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao configurar dados de demonstração")
    } finally {
      setIsLoading(false)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dados criados com sucesso!</h2>
            <p className="text-gray-600">Redirecionando para o dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-slate-700">
            Configurar Dados de Demonstração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Clique no botão abaixo para criar pacientes e dados de força de mordida de demonstração para testar o
            sistema.
          </p>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button onClick={setupDemoData} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando dados...
              </>
            ) : (
              "Criar Dados de Demonstração"
            )}
          </Button>

          <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
            Pular e ir para o Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
