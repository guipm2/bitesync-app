"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!containerRef.current || reduce) return
    const el = containerRef.current
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      // compute a small offset based on scroll position in viewport
      const t = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1)
      setOffset(t)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [reduce])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#ffffff", "#337591", "#84dcf4", "#224f62", "#73c0c2"]}
        speed={0.3}
        style={reduce ? undefined : { transform: `translateY(${offset * -40}px)` }}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#337591", "#84dcf4", "#73c0c2", "#73c0c2"]}
        speed={0.2}
        style={reduce ? undefined : { transform: `translateY(${offset * -20}px)` }}
      />

      {children}
    </div>
  )
}
