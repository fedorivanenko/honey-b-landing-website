import { Poly, Inter } from 'next/font/google'

export const poly = Poly({
  subsets: ['latin'],
  weight: "400",
  variable: '--font-poly-serif',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans',
  display: 'swap',
})