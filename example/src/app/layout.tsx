import { Layout } from '@/components/dom/Layout'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CAD Viewer',
  description: '3D CAD Viewer built with React Three Fiber',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body>
        <Layout>{children}</Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}