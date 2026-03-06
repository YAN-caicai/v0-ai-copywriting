import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSans = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-sans', weight: ['300', '400', '500', '700'] })
const notoSerif = Noto_Serif_SC({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'SoulWrite | 灵感文案生成器',
  description: '用 AI 的力量，将你的情绪化为动人文字。SoulWrite 帮你生成治愈、高级、可爱、搞笑的灵感文案。',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F8F7FA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSans.variable} ${notoSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
