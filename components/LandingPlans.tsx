"use client"

import { motion, useReducedMotion, useMotionValue, useTransform, useInView } from "framer-motion"
import React, { useEffect, useRef, useState } from 'react'

type Props = { isActive?: boolean }

export default function LandingPlans({ isActive }: Props) {
  const shouldReduce = !!useReducedMotion()

  const parentWithDirection = {
    hidden: { opacity: 0, transition: { when: 'afterChildren', staggerChildren: 0.06, staggerDirection: -1 } },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.06, staggerDirection: 1 } },
  }

  const child = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36 } },
  }

  const plans = [
    { name: 'Basic', price: 'R$120/semana', perks: ['Relatórios básicos', '1 paciente'] },
    { name: 'Pro', price: 'R$350/mês', perks: ['Relatórios avançados', '5 pacientes'] },
    { name: 'Clinic', price: 'R$3600/ano', perks: ['Suporte clínico', 'Pacientes ilimitados'] },
  ]

  return (
    <motion.section
      id="precos"
      initial="hidden"
      animate={typeof isActive === 'undefined' ? 'visible' : isActive ? 'visible' : 'hidden'}
      variants={parentWithDirection}
      className="w-full py-20"
      style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top))', paddingBottom: '6rem' }}
    >
      <div className="text-center">
        <motion.h2 variants={child} className="text-3xl md:text-4xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>
          Planos e Preços
        </motion.h2>

        <motion.div variants={child} className="mb-6 max-w-3xl mx-auto text-left text-white/85">
          <h3 className="text-xl md:text-2xl font-semibold mb-3">Dispositivo BiteSync</h3>
          <p className="mb-2 text-sm md:text-base">Custo estimado: <span className="font-bold">R$2500 a R$3500</span> (inclui avaliação clínica, moldagem e tecnologia para monitoramento).</p>
        </motion.div>

        <div className="mb-10 max-w-4xl mx-auto text-left text-white/85">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {plans.map((p) => (
              <PriceCard key={p.name} plan={p} reduced={shouldReduce} />
            ))}
          </div>

          <motion.p variants={child} className="text-sm md:text-base">O profissional só precisa realizar o molde do paciente e enviar para nossa equipe. Todo o restante (confecção, instalação dos sensores e acesso aos dados digitais) fica sob nossa responsabilidade.</motion.p>

          <motion.div variants={child} className="mt-6 flex items-center gap-6">
            <div>
              <span className="text-2xl md:text-3xl font-bold">👩‍⚕️</span>
            </div>
            <div>
              <div className="text-sm text-white/80">Profissionais usando BiteSync</div>
              <AnimatedCount />
            </div>
          </motion.div>
        </div>

        <motion.div variants={child} className="flex gap-6 justify-center mt-8">
          <a href="#encomende" className="px-6 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/12 transition text-sm">Encomende Agora</a>
          <a href="/auth/sign-up" className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:brightness-95 transition text-sm">Assine Já</a>
        </motion.div>
      </div>
    </motion.section>
  )
}

function PriceCard({ plan, reduced }: { plan: { name: string; price: string; perks: string[] }; reduced: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-80, 80], [12, -12])
  const rotateY = useTransform(x, [-80, 80], [-12, 12])

  return (
    <motion.div
      ref={ref}
      className="bg-white/6 rounded-xl p-4 border border-white/10 perspective-1000"
      style={reduced ? {} : { rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (reduced) return
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const px = e.clientX - rect.left - rect.width / 2
        const py = e.clientY - rect.top - rect.height / 2
        x.set(px / (rect.width / 2) * 60)
        y.set(py / (rect.height / 2) * 60)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      whileHover={reduced ? undefined : { scale: 1.03 }}
    >
      <h4 className="text-sm font-semibold text-white mb-1">{plan.name}</h4>
      <div className="text-sm text-white/90 font-bold mb-2">{plan.price}</div>
      <ul className="text-xs text-white/80 space-y-1 mb-2">
        {plan.perks.map((k) => <li key={k}>• {k}</li>)}
      </ul>
      <a href="/auth/sign-up" className="inline-block mt-2 text-sm bg-white text-black px-3 py-1 rounded">Assine</a>
    </motion.div>
  )
}

function AnimatedCount() {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let mounted = true
    const target = 128
    let cur = 0
    const step = Math.max(1, Math.floor(target / 40))
    const iv = setInterval(() => {
      cur += step
      if (!mounted) return
      if (cur >= target) {
        setN(target)
        clearInterval(iv)
      } else {
        setN(cur)
      }
    }, 40)
    return () => { mounted = false; clearInterval(iv) }
  }, [inView])
  return <div ref={ref} className="text-xl md:text-2xl font-bold">{n}+</div>
}
