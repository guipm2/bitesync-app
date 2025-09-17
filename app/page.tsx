"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import LandingAbout from "@/components/LandingAbout"
import LandingPlans from "@/components/LandingPlans"
import FAQ from '@/components/FAQ'
import PageContainer from '@/components/PageContainer'

const sections = [
  { id: 'diferencial', label: 'Diferencial' },
  { id: 'precos', label: 'Preços' },
  { id: 'faq', label: 'FAQ' }
]

export default function ShaderShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [isDesktop, setIsDesktop] = useState<boolean>(true)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Observe snap sections and update activeSection when a section becomes the main visible one.
    const sectionEls = Array.from(el.querySelectorAll('section[id]')) as HTMLElement[]
    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // find the entry with largest intersectionRatio
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry
        }
        if (best && best.isIntersecting) {
          const idx = sectionEls.indexOf(best.target as HTMLElement)
          if (idx >= 0) setActiveSection(idx)
        }
      },
      { root: el, threshold: [0.25, 0.5, 0.75] }
    )

    sectionEls.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (index: number) => {
    if (!containerRef.current) return
    // find the section id from the nav and scroll that element into view inside the scroll container
    const targetId = sections[index].id
    const target = containerRef.current.querySelector(`#${targetId}`) as HTMLElement | null
    if (target) {
      // scroll the container so the target is at the top
      containerRef.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  const handleNavKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavClick(index)
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      handleNavClick(index - 1)
    }
    if (e.key === 'ArrowDown' && index < sections.length - 1) {
      e.preventDefault()
      handleNavClick(index + 1)
    }
  }

  const scrollToId = (id: string) => {
    if (!containerRef.current) return
    const target = containerRef.current.querySelector(`#${id}`) as HTMLElement | null
    if (target) {
      // focus the container to ensure pointer/scroll isn't trapped on another element
      try {
        containerRef.current.tabIndex = -1
        containerRef.current.focus()
      } catch {}
      containerRef.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
      // after the smooth scroll finishes, remove focus to avoid any trapped state
      let removed = false
      const onScroll = () => {
        if (!containerRef.current) return
        const reached = Math.abs(containerRef.current.scrollTop - target.offsetTop) < 8
        if (reached && !removed) {
          removed = true
          try { containerRef.current.blur() } catch {}
          containerRef.current.removeEventListener('scroll', onScroll)
        }
      }
      containerRef.current.addEventListener('scroll', onScroll, { passive: true })
      // fallback: if scroll doesn't reach in 500ms, clear focus anyway
      setTimeout(() => {
        if (!removed) {
          removed = true
          try { if (containerRef.current) containerRef.current.blur() } catch {}
          try { if (containerRef.current) containerRef.current.removeEventListener('scroll', onScroll) } catch {}
        }
      }, 500)
    }
  }

  return (
    <ShaderBackground>
  <Header onNavigateTo={isDesktop ? scrollToId : undefined} />

      {/* Right-side dots nav */}
      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-40 p-4">
        {sections.map((s, i) => {
          // compute which nav index is currently active by matching the observed section id
          let navActiveIndex = 0
          if (containerRef.current) {
            const sectionEls = Array.from(containerRef.current.querySelectorAll('section[id]')) as HTMLElement[]
            const activeEl = sectionEls[activeSection]
            if (activeEl) {
              const idx = sections.findIndex((x) => x.id === activeEl.id)
              navActiveIndex = Math.max(0, idx)
            }
          }
          return (
            <button
              key={s.id}
              onClick={() => handleNavClick(i)}
              onKeyDown={(e) => handleNavKey(e, i)}
              tabIndex={0}
              className={`w-3 h-3 rounded-full my-2 transition-all focus:outline-none focus:ring-2 focus:ring-white ${i === navActiveIndex ? 'bg-white scale-150' : 'bg-white/40'}`}
              aria-label={`Go to ${s.label}`}
            />
          )
        })}
      </nav>

  {/* Top progress bar */}
  <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white/70 z-40 origin-left" style={{ scaleX }} />

      {/* Pulsing and Hero (kept above the scroll container) */}
  <HeroContent visible={activeSection === 0 && isDesktop} onNavigateTo={isDesktop ? scrollToId : undefined} />
      <PulsingCircle />

      {/* Scroll container: only the content scrolls while ShaderBackground remains fixed on desktop; mobile falls back to normal flow */}
      {isDesktop ? (
  <div ref={containerRef} className="relative z-20 h-screen overflow-y-auto snap-y snap-mandatory hide-native-scrollbar">
          {/* spacer so the hero (overlay) is the only visible thing on first load */}
          <section id="hero-spacer" className="h-screen snap-start" aria-hidden />

          {/* compute active section id to pass robust isActive props */}
          {/** Note: activeSection is an index into the list of sections found inside the scroll container */}
          {
            (() => {
              let currentActiveId: string | null = null
              if (containerRef.current) {
                const sectionEls = Array.from(containerRef.current.querySelectorAll('section[id]')) as HTMLElement[]
                const el = sectionEls[activeSection]
                currentActiveId = el ? el.id : null
              }
              return (
                <>
                  <section id="diferencial" className="h-screen snap-start flex items-center">
                    <PageContainer className="py-20">
                      <LandingAbout isActive={currentActiveId === 'diferencial'} />
                    </PageContainer>
                  </section>

                  {/* Separate 'impactos' section to lower information density */}
                  <section id="impactos" className="h-screen snap-start flex items-center">
                    <PageContainer className="py-20">
                      <motion.div
                        initial="hidden"
                        animate={currentActiveId === 'impactos' ? 'visible' : 'hidden'}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.06 } }
                        }}
                        className="glassy bg-white/6 rounded-2xl p-8"
                      >
                        <motion.h2 variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-rubik-mono-one)' }}>Impactos Positivos</motion.h2>
                        <motion.ul variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="list-disc pl-6 text-white/85 space-y-2 text-base md:text-lg">
                          <li>Maior adesão ao tratamento.</li>
                          <li>Acompanhamento clínico com base em dados reais.</li>
                          <li>Envolvimento do paciente no acompanhamento do próprio progresso.</li>
                          <li>Redução de danos dentários e dores musculares.</li>
                          <li>Personalização mais ágil e eficiente dos tratamentos.</li>
                        </motion.ul>
                      </motion.div>
                    </PageContainer>
                  </section>

                  <section id="precos" className="h-screen snap-start flex items-center">
                    <PageContainer className="py-20">
                      <LandingPlans isActive={currentActiveId === 'precos'} />
                    </PageContainer>
                  </section>

                  <section id="faq" className="h-screen snap-start flex items-center">
                    <PageContainer className="py-20 max-w-6xl">
                      <div className="p-8">
                        <h2 style={{ fontFamily: 'var(--font-rubik-mono-one)' }} className="text-3xl font-bold text-white mb-4 text-center">FAQ</h2>
                        <FAQ isActive={currentActiveId === 'faq'} />
                      </div>
                    </PageContainer>
                  </section>
                </>
              )
            })()
          }
          
        </div>
      ) : (
        <div className="relative z-30">
          {/* Mobile/Tablet fallback: render sections in normal flow */}
          <div className="min-h-screen" />
          <section id="diferencial" className="py-12">
            <LandingAbout />
          </section>
          <section id="precos" className="py-12">
            <LandingPlans />
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
  )}
    </ShaderBackground>
  )
}
