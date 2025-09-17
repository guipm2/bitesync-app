"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type QA = { q: string; a: string }

const faqs: QA[] = [
  {
    q: 'Como funciona o BiteSync?',
    a: 'O BiteSync é um molde intraoral com sensores que registram a força da mordida e enviam os dados para um painel digital seguro. O profissional acessa leituras por sessão e históricos para apoiar decisões clínicas.'
  },
  {
    q: 'Quanto custa o dispositivo?',
    a: 'O custo estimado varia entre R$2500 e R$3500, dependendo das opções de personalização e do laboratório responsável. Planos de assinatura da plataforma são cobrados separadamente.'
  },
  {
    q: 'Como assinar a plataforma?',
    a: 'Você pode criar uma conta clicando em "Criar conta" no topo da página ou usar o botão "Assine Já" presente na seção de preços para iniciar o cadastro.'
  }
]

export default function FAQ({ isActive }: { isActive?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const parent = {
    hidden: { opacity: 0, transition: { when: 'afterChildren', staggerChildren: 0.06, staggerDirection: -1 } },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.06, staggerDirection: 1 } },
  }

  const child = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32 } },
  }

  // If isActive is undefined (component used outside desktop flow), default to visible
  const animateState = typeof isActive === 'undefined' ? 'visible' : isActive ? 'visible' : 'hidden'

  return (
    <div className="w-full">
      <motion.div className="grid gap-3" initial="hidden" animate={animateState} variants={reduce ? undefined : parent}>
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <motion.div
              key={item.q}
              layout
              variants={reduce ? undefined : child}
              className="bg-white/6 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); setOpen(isOpen ? null : i)
                  }
                }}
                className="w-full text-left flex items-center justify-between px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="text-sm md:text-base font-medium text-white">{item.q}</span>
                <span className={`text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32 }}
                    className="px-4 pb-4 text-white/90 text-sm md:text-base"
                  >
                    <div className="pt-2">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
