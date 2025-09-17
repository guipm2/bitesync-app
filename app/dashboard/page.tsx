import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get patients count
  const { count: patientsCount } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  // Get total readings count
  const { count: readingsCount } = await supabase
    .from("bite_force_readings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  // Get recent readings for average calculation
  const { data: recentReadings } = await supabase
    .from("bite_force_readings")
    .select("force_value")
    .eq("user_id", data.user.id)
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })

  const averageForce =
    recentReadings && recentReadings.length > 0
      ? Math.round(
          recentReadings.reduce((sum, reading) => sum + Number(reading.force_value), 0) / recentReadings.length,
        )
      : 0

  return (
    <DashboardContent
      user={data.user}
      profile={profile}
      patientsCount={patientsCount || 0}
      readingsCount={readingsCount || 0}
      averageForce={averageForce}
    />
  )
}
