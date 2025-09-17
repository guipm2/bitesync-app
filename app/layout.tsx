import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Rubik_Mono_One } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})


const RubikMonoOne = Rubik_Mono_One({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-rubik-mono-one",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BiteSync",
  description: "ByteSync App",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-rubik-mono-one: ${RubikMonoOne.variable};
}
:root {
  --primary: #337591; /* main brand blue */
  --accent: #73c0c2;  /* accent */
  --glass: rgba(255,255,255,0.06);
  --muted: rgba(255,255,255,0.6);
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${RubikMonoOne.variable}`}>{children}</body>
    </html>
  )
}
