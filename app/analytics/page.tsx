import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AnalyticsContent from "@/components/analytics-content"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all patients for the current user
  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", data.user.id)
    .order("full_name", { ascending: true })

  if (patientsError) {
    console.error("Error fetching patients:", patientsError)
  }

  // Get all bite force readings for the current user
  const { data: readings, error: readingsError } = await supabase
    .from("bite_force_readings")
    .select("*")
    .eq("user_id", data.user.id)
    .order("timestamp", { ascending: true })

  if (readingsError) {
    console.error("Error fetching readings:", readingsError)
  }

  return <AnalyticsContent patients={patients || []} readings={readings || []} />
}
