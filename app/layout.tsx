import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Lora, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], variable: '--font-manrope' })
const lora = Lora({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'EcoPavlodar — качество воздуха и погода Павлодарской области',
  description:
    'Открытый экомонитор: индекс качества воздуха, PM2.5, NO2, SO2, ветер и погода в Павлодаре, Экибастузе и Аксу с ориентирами ВОЗ.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2f6b4f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${lora.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
