"use client"

import { useState } from 'react'
import Image from 'next/image'
import MotionButton from './ui/motion-button'

type HeaderProps = { onNavigateTo?: (id: string) => void }

export default function Header({ onNavigateTo }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-transparent pointer-events-none">
      {/* Logo */}
      <div className="flex items-center pointer-events-auto">
        <a
          href="#hero-spacer"
          aria-label="BiteSync home"
          onClick={(e) => {
            if (onNavigateTo) {
              e.preventDefault()
              onNavigateTo('hero-spacer')
            }
          }}
          className="pointer-events-auto"
        >
          <Image src="/logo.png" alt="BiteSync" width={36} height={11} priority className="object-contain filter invert brightness-150" />
        </a>
      </div>

      {/* Navigation - hidden on small screens */}
      <nav className="hidden md:flex items-center space-x-2 pointer-events-auto">
        <a
          href="#diferencial"
          onClick={(e) => {
            if (onNavigateTo) {
              e.preventDefault()
              onNavigateTo('diferencial')
            }
          }}
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200 select-none pointer-events-auto"
        >
          Diferencial
        </a>
        <a
          href="#precos"
          onClick={(e) => {
            if (onNavigateTo) {
              e.preventDefault()
              onNavigateTo('precos')
            }
          }}
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200 select-none pointer-events-auto"
        >
          Preços
        </a>
        <a
          href="#faq"
          onClick={(e) => {
            if (onNavigateTo) {
              e.preventDefault()
              onNavigateTo('faq')
            }
          }}
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200 select-none pointer-events-auto"
        >
          FAQ
        </a>
      </nav>

      {/* Mobile menu button and Login group */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="hidden md:flex" id="gooey-btn" style={{ filter: 'url(#gooey-filter)' }}>
          <MotionButton className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0 pointer-events-auto">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </MotionButton>
          <MotionButton href="/auth/login" className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10 pointer-events-auto">Login</MotionButton>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 rounded-lg bg-white/6 pointer-events-auto">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute right-4 top-full mt-2 w-48 bg-black/60 rounded-lg p-3 backdrop-blur-md z-50 md:hidden pointer-events-auto">
          <a
            href="#diferencial"
            onClick={(e) => {
              if (onNavigateTo) {
                e.preventDefault()
                onNavigateTo('diferencial')
              }
            }}
            className="block px-3 py-2 text-white/90 rounded pointer-events-auto"
          >
            Diferencial
          </a>
          <a
            href="#precos"
            onClick={(e) => {
              if (onNavigateTo) {
                e.preventDefault()
                onNavigateTo('precos')
              }
            }}
            className="block px-3 py-2 text-white/90 rounded pointer-events-auto"
          >
            Preços
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              if (onNavigateTo) {
                e.preventDefault()
                onNavigateTo('faq')
              }
            }}
            className="block px-3 py-2 text-white/90 rounded pointer-events-auto"
          >
            FAQ
          </a>
          <a href="/auth/login" className="block px-3 py-2 text-white/90 rounded pointer-events-auto">Login</a>
        </div>
      )}
    </header>
  )
}
