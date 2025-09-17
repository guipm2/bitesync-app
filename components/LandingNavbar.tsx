import Link from "next/link"
import Image from 'next/image'

export default function LandingNavbar() {
  return (
    <nav className="w-full flex items-center justify-center glassy bg-gradient-to-r from-blue-200 via-blue-300 to-white/60 backdrop-blur-md shadow-lg" style={{ minHeight: '90px' }}>
      <div className="flex items-center justify-between w-full max-w-6xl px-16">
        <div className="flex items-center gap-6">
          <Image src="/globe.svg" alt="BiteSync Logo" className="h-14 w-14" width={56} height={56} />
          <span className="font-bold text-4xl text-blue-900 tracking-wide">BITESYNC</span>
        </div>
        <div className="flex items-center gap-12">
          <Link href="/components/LandingPlans" className="px-8 py-3 rounded-xl bg-white/60 text-blue-700 font-semibold shadow-md hover:bg-blue-100 transition glassy text-xl">Encomende Agora</Link>
          <Link href="/auth/login" className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition glassy text-xl">Assine Já</Link>
          <Link href="/auth/login" className="px-8 py-3 rounded-xl bg-white/60 text-blue-700 font-semibold shadow-md hover:bg-blue-100 transition glassy text-xl">Login</Link>
        </div>
      </div>
    </nav>
  )
}
