import LandingNavbar from "@/components/LandingNavbar"
import LandingHero from "@/components/LandingHero"
import LandingAbout from "@/components/LandingAbout"
import LandingPlans from "@/components/LandingPlans"
import LandingContact from "@/components/LandingContact"

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-white/70">
      <LandingNavbar />
      <LandingHero />
      <LandingAbout />
      <LandingPlans />
      <LandingContact />
      <footer className="w-full text-center py-6 text-blue-700 text-sm bg-white/40 glassy mt-8">
        © 2025 BITESYNC. O futuro do cuidado com o bruxismo começa aqui!
      </footer>
    </main>
  )
}
