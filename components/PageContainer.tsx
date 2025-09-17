"use client"

import React from 'react'

type Props = React.PropsWithChildren<{ as?: 'div' | 'section' | 'article'; className?: string }>

export default function PageContainer({ children, className = '' }: Omit<Props, 'as'>) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-6 ${className}`}>{children}</div>
  )
}
