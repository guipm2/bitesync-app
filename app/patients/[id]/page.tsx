import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PatientDetailsContent from "@/components/patient-details-content"

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get patient details
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (patientError || !patient) {
    redirect("/patients")
  }

  // Get bite force readings for this patient
  const { data: readings, error: readingsError } = await supabase
    .from("bite_force_readings")
    .select("*")
    .eq("patient_id", id)
    .eq("user_id", data.user.id)
    .order("timestamp", { ascending: false })

  if (readingsError) {
    console.error("Error fetching readings:", readingsError)
  }

  // Get unique session dates
  const sessionDates = Array.from(new Set((readings || []).map((reading) => reading.session_date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  return <PatientDetailsContent patient={patient} readings={readings || []} sessionDates={sessionDates} />
}
