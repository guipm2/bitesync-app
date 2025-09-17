"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import Header from "@/components/header"
import PageContainer from "@/components/PageContainer"
import LandingAbout from "@/components/LandingAbout"
import LandingPlans from "@/components/LandingPlans"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import MotionButton from "@/components/ui/motion-button"

export default function Page() {
  const desktopContainerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ container: desktopContainerRef })
  const heroSpacerMobileRef = useRef<HTMLDivElement | null>(null)

  const scrollToId = (id: string) => {
    // Prefer scrolling inside the desktop container when it exists
    if (desktopContainerRef.current) {
      const target = desktopContainerRef.current.querySelector(`#${id}`) as HTMLElement | null
      if (target) {
        desktopContainerRef.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
        return
      }
    }
    // Fallback to document scroll (mobile stacked or if element is not inside the container)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [showHero, setShowHero] = useState<boolean>(true)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = isDesktop ? desktopContainerRef.current : window
    if (!el) return

    const onScroll = () => {
      if (isDesktop) {
        const top = (desktopContainerRef.current?.scrollTop) || 0
        setShowHero(top < 20)
      } else {
        const spacer = heroSpacerMobileRef.current
        if (spacer) {
          const rect = spacer.getBoundingClientRect()
          // Show hero while spacer is still in view
          setShowHero(rect.bottom > 0)
        } else {
          setShowHero(window.scrollY < 20)
        }
      }
    }
    onScroll()
    if (isDesktop) {
      const container = desktopContainerRef.current
      container?.addEventListener('scroll', onScroll, { passive: true })
      return () => container?.removeEventListener('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [isDesktop])

  return (
    <ShaderBackground>
      <Header onNavigateTo={scrollToId} />

      {/* Hero overlay + decorative pulse (desktop only) */}
      {isDesktop && (
        <>
          <HeroContent visible={showHero} onNavigateTo={scrollToId} />
          <PulsingCircle />
        </>
      )}

      {/* Desktop top progress bar */}
      <motion.div className="hidden lg:block fixed top-0 left-0 right-0 h-1 bg-white/70 z-40 origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Mobile/tablet stacked sections */}
      <div className="relative z-10 lg:hidden">
        {/* Anchor for header logo/CTA scroll-to-top */}
        <div id="hero-spacer" ref={heroSpacerMobileRef} className="h-0" />

        {/* Compact mobile hero in-flow */}
        <section id="hero" className="pt-24 pb-10">
          <PageContainer>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full mb-3 bg-white/6 border border-white/10">
                <span className="text-white/90 text-xs font-light">🦷 Monitore remotamente</span>
              </div>
              <h1 className="text-3xl sm:text-4xl leading-tight tracking-tight font-bold text-white mb-2" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>
                <span className="block uppercase">BITESYNC</span>
              </h1>
              <h2 className="text-base sm:text-lg font-semibold text-white mb-3">O dispositivo que protege seu sorriso.</h2>
              <p className="text-sm text-white/80 mb-5 leading-relaxed">
                Pensamos além de uma consulta: um sistema que monitora em tempo real a força da mordida.
              </p>
              <div className="flex items-center gap-3 justify-center flex-wrap">
                <MotionButton
                  href="#precos"
                  onClick={(e) => { e.preventDefault(); scrollToId('precos') }}
                  className="px-6 py-2 rounded-full bg-transparent border border-white/30 text-white font-medium text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50"
                >
                  Encomende já
                </MotionButton>
                <MotionButton
                  href="/auth/sign-up"
                  className="px-6 py-2 rounded-full bg-white text-black font-medium text-sm transition-all duration-200 hover:bg-white/90"
                >
                  Criar conta
                </MotionButton>
              </div>
            </div>
          </PageContainer>
        </section>
        <section id="diferencial" className="py-10">
          <PageContainer>
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>
                O que é o BiteSync?
              </h2>
              <p className="text-sm text-white/85 mb-5 leading-relaxed">
                Um sistema de monitoramento intraoral que captura leituras da força da mordida e apresenta esses dados em um painel digital seguro.
              </p>

              {/* Principais destaques */}
              <div className="grid grid-cols-1 gap-3 max-w-4xl mx-auto mb-5">
                {[
                  { title: 'Monitoramento contínuo', desc: 'Leituras por sessão e histórico para análises.' },
                  { title: 'Suporte clínico', desc: 'Dados objetivos que complementam o diagnóstico.' },
                  { title: 'Melhor acompanhamento', desc: 'Acompanhamento remoto e alertas quando necessário.' },
                ].map((card) => (
                  <article key={card.title} className="bg-white/6 border border-white/10 rounded-xl p-4 text-left">
                    <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
                    <p className="text-xs text-white/80">{card.desc}</p>
                  </article>
                ))}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>
                Funções
              </h3>

              {/* Funções */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {[
                  { title: 'Diagnóstico orientado por dados', desc: 'Relatórios que auxiliam decisões clínicas.' },
                  { title: 'Sensores intraorais', desc: 'Medições pontuais e confiáveis da força da mordida.' },
                  { title: 'Histórico por paciente', desc: 'Acompanhe evolução ao longo do tempo.' },
                  { title: 'Interface digital', desc: 'Painel para visualizar tendências e leituras.' },
                ].map((c) => (
                  <div key={c.title} className="bg-white/6 rounded-lg p-4 border border-white/8 text-left">
                    <h5 className="text-sm font-semibold text-white mb-1">{c.title}</h5>
                    <p className="text-xs text-white/80">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        <section id="impactos" className="py-10">
          <PageContainer>
            <div className="glassy bg-white/6 rounded-2xl p-6">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Impactos Positivos</h2>
              <ul className="list-disc pl-6 text-white/85 space-y-2 text-sm md:text-base">
                <li>Maior adesão ao tratamento.</li>
                <li>Acompanhamento clínico com base em dados reais.</li>
                <li>Envolvimento do paciente no acompanhamento do próprio progresso.</li>
              </ul>
            </div>
          </PageContainer>
        </section>

        <section id="precos" className="py-12">
          <PageContainer>
            <LandingPlans />
          </PageContainer>
        </section>

        <section id="faq" className="py-12">
          <PageContainer className="max-w-6xl">
            <div className="glassy bg-white/6 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">FAQ</h2>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="font-semibold">Como funciona o BiteSync?</h3>
                  <p>O BiteSync é um molde intraoral com sensores que registram a força da mordida e enviam os dados para um sistema digital seguro.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Quanto custa o dispositivo?</h3>
                  <p>O custo estimado varia entre R$2500 e R$3500, dependendo das opções de personalização e laboratório responsável.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Como assinar a plataforma?</h3>
                  <p>Você pode assinar clicando em &quot;Assine Já&quot; na navbar ou no botão de &quot;Criar conta&quot; para acessar o cadastro.</p>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </div>

      {/* Desktop inner-scroll container with snap */}
  <div ref={desktopContainerRef} className="hidden lg:block relative z-20 h-screen overflow-y-auto overscroll-y-contain touch-pan-y snap-y snap-mandatory hide-native-scrollbar">
        <section id="hero-spacer" className="h-screen snap-start" aria-hidden />

        <section id="diferencial" className="h-screen snap-start flex items-center">
          <PageContainer className="py-20">
            <LandingAbout isActive />
          </PageContainer>
        </section>

        <section id="impactos" className="h-screen snap-start flex items-center">
          <PageContainer className="py-20">
            <div className="glassy bg-white/6 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-3">Impactos Positivos</h2>
              <ul className="list-disc pl-6 text-white/85 space-y-2 text-base md:text-lg">
                <li>Maior adesão ao tratamento.</li>
                <li>Acompanhamento clínico com base em dados reais.</li>
                <li>Envolvimento do paciente no acompanhamento do próprio progresso.</li>
                <li>Redução de danos dentários e dores musculares.</li>
                <li>Personalização mais ágil e eficiente dos tratamentos.</li>
              </ul>
            </div>
          </PageContainer>
        </section>

        <section id="precos" className="h-screen snap-start flex items-center">
          <PageContainer className="py-20">
            <LandingPlans />
          </PageContainer>
        </section>

        <section id="faq" className="h-screen snap-start flex items-center">
          <PageContainer className="py-20 max-w-6xl">
            <div className="glassy bg-white/6 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">FAQ</h2>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="font-semibold">Como funciona o BiteSync?</h3>
                  <p>O BiteSync é um molde intraoral com sensores que registram a força da mordida e enviam os dados para um sistema digital seguro.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Quanto custa o dispositivo?</h3>
                  <p>O custo estimado varia entre R$2500 e R$3500, dependendo das opções de personalização e laboratório responsável.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Como assinar a plataforma?</h3>
                  <p>Você pode assinar clicando em &quot;Assine Já&quot; na navbar ou no botão de &quot;Criar conta&quot; para acessar o cadastro.</p>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </div>
    </ShaderBackground>
  )
}
