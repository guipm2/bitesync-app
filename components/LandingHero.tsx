import Image from 'next/image'

export default function LandingHero() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 px-0 bg-gradient-to-br from-blue-200 via-blue-300 to-white/70 glassy">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-lg">BITESYNC</h1>
        <p className="text-2xl text-blue-700 mb-10 font-medium">Tecnologia que protege seu sorriso enquanto você dorme!</p>
        <div className="flex flex-row items-center gap-16 mb-10">
          <Image src="/file.svg" alt="BiteSync Dispositivo" className="glassy shadow-xl" width={220} height={220} />
          <Image src="/window.svg" alt="BiteSync Dispositivo" className="glassy shadow-xl" width={220} height={220} />
        </div>
        <div className="flex gap-8">
          <a href="#encomende" className="px-8 py-3 rounded-xl bg-white/60 text-blue-700 font-bold shadow-md hover:bg-blue-100 transition glassy text-lg">Encomende Agora</a>
          <a href="#planos" className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition glassy text-lg">Assine Já</a>
        </div>
      </div>
    </section>
  )
}
