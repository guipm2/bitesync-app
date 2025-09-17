"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type MotionButtonProps = {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: React.MouseEventHandler
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function MotionButton({ children, className = '', href, onClick, type = 'button', disabled }: MotionButtonProps) {
  const reduce = useReducedMotion()
  const hover = reduce ? undefined : { scale: 1.04 }
  const tap = reduce ? undefined : { scale: 0.98 }

  if (href) {
    return (
      <motion.a href={href} whileHover={hover} whileTap={tap} className={className} onClick={onClick}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type={type} disabled={disabled} whileHover={hover} whileTap={tap} className={className} onClick={onClick}>
      {children}
    </motion.button>
  )
}
