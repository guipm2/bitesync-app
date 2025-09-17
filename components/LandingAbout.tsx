"use client"

import { motion } from "framer-motion"

type Props = { isActive?: boolean }

export default function LandingAbout({ isActive }: Props) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { when: 'beforeChildren', staggerChildren: 0.06 } },
  }

  const child = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36 } },
  }

  return (
  <motion.section
      initial="hidden"
      animate={typeof isActive === 'undefined' ? undefined : isActive ? 'visible' : 'hidden'}
      whileInView={typeof isActive === 'undefined' ? { opacity: 1, y: 0 } : undefined}
      variants={variants}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-20"
      style={{ paddingTop: 'calc(6.5rem + env(safe-area-inset-top))', paddingBottom: '5rem' }}
    >
      <div className="text-center">
        <motion.h2 variants={child} className="text-lg md:text-xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>O que é o BiteSync?</motion.h2>

        <motion.p variants={child} className="text-white/85 mb-6 text-sm md:text-base max-w-3xl mx-auto">
          Um sistema de monitoramento intraoral que captura leituras da força da mordida e as apresenta em um painel digital seguro, ajudando profissionais a tomar decisões melhor embasadas.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
          {[
            { title: 'Monitoramento contínuo', desc: 'Leituras por sessão e histórico para análises.' },
            { title: 'Suporte clínico', desc: 'Dados objetivos que complementam o diagnóstico.' },
            { title: 'Melhor acompanhamento', desc: 'Acompanhamento remoto e alertas quando necessário.' },
          ].map((card) => (
            <motion.article
              key={card.title}
              variants={child}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/6 border border-white/10 rounded-xl p-4"
              aria-label={card.title}
            >
              <h4 className="text-sm md:text-base font-semibold text-white mb-1">{card.title}</h4>
              <p className="text-xs md:text-sm text-white/80">{card.desc}</p>
            </motion.article>
          ))}
        </div>

        <motion.h3 variants={child} className="text-lg md:text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>Funções</motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
          {[
            { title: 'Diagnóstico orientado por dados', desc: 'Relatórios que auxiliam decisões clínicas.' },
            { title: 'Sensores intraorais', desc: 'Medições pontuais e confiáveis da força da mordida.' },
            { title: 'Histórico por paciente', desc: 'Acompanhe evolução ao longo do tempo.' },
            { title: 'Interface digital', desc: 'Painel para visualizar tendências e leituras.' },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={child}
              whileHover={{ y: -3 }}
              className="bg-white/6 rounded-lg p-4 border border-white/8"
              role="article"
              aria-label={c.title}
            >
              <h5 className="text-sm font-semibold text-white mb-1">{c.title}</h5>
              <p className="text-xs text-white/80">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
