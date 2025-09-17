import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SettingsContent from "@/components/settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
  }

  return <SettingsContent user={data.user} profile={profile} />
}
