import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PatientsContent from "@/components/patients-content"

export default async function PatientsPage() {
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
    .order("created_at", { ascending: false })

  if (patientsError) {
    console.error("Error fetching patients:", patientsError)
  }

  return <PatientsContent patients={patients || []} userId={data.user.id} />
}
