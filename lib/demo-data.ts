import type { SupabaseClient } from '@supabase/supabase-js'

export const createDemoPatients = async (supabase: SupabaseClient, userId: string) => {
  const demoPatients = [
    {
      user_id: userId,
      full_name: "Arthur Almeida",
      email: "arthur.almeida@email.com",
      phone: "(11) 99999-1111",
      birth_date: "1985-03-15",
    },
    {
      user_id: userId,
      full_name: "Carla Martins",
      email: "carla.martins@email.com",
      phone: "(11) 99999-2222",
      birth_date: "1990-07-22",
    },
    {
      user_id: userId,
      full_name: "Ricardo Moreira",
      email: "ricardo.moreira@email.com",
      phone: "(11) 99999-3333",
      birth_date: "1988-11-08",
    },
    {
      user_id: userId,
      full_name: "Sofia Pereira",
      email: "sofia.pereira@email.com",
      phone: "(11) 99999-4444",
      birth_date: "1992-05-30",
    },
  ]

  try {
    const { data, error } = await supabase.from("patients").insert(demoPatients).select()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating demo patients:", error)
    return null
  }
}

export const createDemoBiteForceReadings = async (supabase: SupabaseClient, userId: string, patientId: string) => {
  const now = new Date()
  const readings: Array<{ patient_id: string; user_id: string; force_value: number; timestamp: string; session_date: string }> = []

  // Generate readings for the last 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)
    const dateStr = date.toISOString().split("T")[0]

    // Generate multiple readings per day (simulating hourly readings)
    for (let hour = 0; hour < 24; hour += 2) {
      const timestamp = new Date(date)
      timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0)

      // Generate realistic bite force values (200-600 N with some variation)
      const baseForce = 300 + Math.sin((hour / 24) * Math.PI * 2) * 100 // Daily cycle
      const variation = (Math.random() - 0.5) * 100 // Random variation
      const forceValue = Math.max(150, Math.min(600, baseForce + variation))

      readings.push({
        patient_id: patientId,
        user_id: userId,
        force_value: Math.round(forceValue),
        timestamp: timestamp.toISOString(),
        session_date: dateStr,
      })
    }
  }

  try {
    const { data, error } = await supabase.from("bite_force_readings").insert(readings).select()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating demo bite force readings:", error)
    return null
  }
}
