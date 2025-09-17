"use client"

import { motion } from "framer-motion"
import MotionButton from './ui/motion-button'

type HeroProps = { visible?: boolean; onNavigateTo?: (id: string) => void }

export default function HeroContent({ visible = true, onNavigateTo }: HeroProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.08 } },
  }

  const child = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.46 } },
  }

  return (
    <motion.main
      className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-16"
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={container}
      style={{ pointerEvents: 'none' }}
    >
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-6 text-center">
        <motion.div className="inline-flex items-center px-3 py-1 rounded-full mb-4 relative" style={{ pointerEvents: 'auto' }} variants={child}>
          <span className="text-white/90 text-sm font-light relative z-10">🦷 Monitore remotamente</span>
        </motion.div>

        <motion.h1 variants={child} className="text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight font-bold text-white mb-3" style={{ pointerEvents: 'auto', fontFamily: 'var(--font-rubik-mono-one)' }}>
          <motion.span className="block font-bold tracking-tight text-white text-3xl md:text-5xl lg:text-6xl uppercase" variants={child}>BITESYNC</motion.span>
        </motion.h1>

        <motion.h2 variants={child} className="text-3xl md:text-3xl lg:text-3xl leading-tight tracking-tight font-bold text-white mb-3">
          <motion.span className="block" variants={child}>O dispositivo que protege seu sorriso.</motion.span>
        </motion.h2>

        <motion.p variants={child} className="text-base md:text-lg font-light text-white/85 mb-4 leading-relaxed" style={{ pointerEvents: 'auto' }}>
          Pensamos além de uma consulta: um sistema que monitora em tempo real a força da mordida.
        </motion.p>

        <motion.div variants={child} className="flex items-center gap-4 justify-center flex-wrap" style={{ pointerEvents: 'auto' }}>
          <MotionButton
            href="#precos"
            onClick={(e) => {
              // If a container scroll handler is provided, use it and prevent default anchor behavior
              if (onNavigateTo) {
                e.preventDefault()
                onNavigateTo('precos')
              }
            }}
            className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-medium text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50"
          >
            Encomende já
          </MotionButton>

          <MotionButton href="/auth/sign-up" className="px-8 py-3 rounded-full bg-white text-black font-medium text-sm transition-all duration-200 hover:bg-white/90">
            Criar conta
          </MotionButton>
        </motion.div>

        <motion.div variants={child} className="mt-8 flex justify-center" style={{ pointerEvents: 'auto' }}>
          <button
            aria-label="Scroll down"
            onClick={() => {
              if (onNavigateTo) return onNavigateTo('diferencial')
              const next = document.getElementById('diferencial')
              if (next) next.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white/90 hover:bg-white/6 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </motion.div>
        </div>
      </div>
    </motion.main>
  )
}
