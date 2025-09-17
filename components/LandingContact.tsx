"use client"

import { motion } from "framer-motion"
import Image from 'next/image'

type Props = { isActive?: boolean }

export default function LandingContact({ isActive }: Props) {
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <>
      <motion.section
        id="contato"
        initial="hidden"
        animate={typeof isActive === 'undefined' ? undefined : isActive ? 'visible' : 'hidden'}
        whileInView={typeof isActive === 'undefined' ? { opacity: 1, y: 0 } : undefined}
        variants={variants}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.2 }}
  className="w-full py-20"
        style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top))', paddingBottom: '6rem' }}
      >
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>Fale Conosco</h2>
          <p className="text-white/85 mb-4 text-sm md:text-base max-w-3xl mx-auto">Quer conversar sobre integrações ou parcerias? Envie uma mensagem e nossa equipe entrará em contato.</p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <input className="col-span-1 p-4 rounded-lg border border-white/10 bg-black/10 text-white" placeholder="Seu nome" />
            <input className="col-span-1 p-4 rounded-lg border border-white/10 bg-black/10 text-white" placeholder="Seu e-mail" />
            <textarea className="col-span-1 md:col-span-2 p-4 rounded-lg border border-white/10 bg-black/10 text-white h-36" placeholder="Sua mensagem"></textarea>
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button className="px-6 py-3 rounded-lg bg-white text-black font-bold hover:brightness-95">Enviar Mensagem</button>
            </div>
          </form>
        </div>
      </motion.section>

      <motion.section
        id="encomende"
        initial="hidden"
        animate={typeof isActive === 'undefined' ? undefined : isActive ? 'visible' : 'hidden'}
        whileInView={typeof isActive === 'undefined' ? { opacity: 1, y: 0 } : undefined}
        variants={variants}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
  className="w-full py-20"
        style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top))', paddingBottom: '6rem' }}
      >
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>Encomende Já</h2>
          <p className="text-white/85 mb-4 text-sm md:text-base max-w-3xl mx-auto">A compra do BiteSync é feita por encomenda; entre em contato conosco para iniciar o processo.</p>
          <div className="mb-8 max-w-3xl mx-auto text-left text-white/85">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Entre em contato</h3>
            <ul className="text-white/85 space-y-2 text-base md:text-lg">
              <li><strong>Escritório:</strong> Rua Qualquer, 123, Vila Velha, ES, Brasil. ((27)992492116)</li>
              <li><strong>Mídias Sociais:</strong> Instagram: bitesync_</li>
              <li><strong>Email:</strong> llorenzoni2004@gmail.com</li>
            </ul>
          </div>
          <div className="flex items-center gap-6 mt-10 justify-center">
            <Image src="/window.svg" alt="BiteSync Logo" className="" width={80} height={80} />
            <span className="font-bold text-2xl md:text-3xl text-white tracking-wide">BITESYNC</span>
          </div>
          <p className="text-sm md:text-base text-white/70 mt-10">O futuro do cuidado com o bruxismo começa aqui!</p>
        </div>
      </motion.section>
    </>
  )
}
