import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ziya Creations',
  description: 'Premium e-commerce platform for lifestyle products',
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
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const hideLayout = pathname.startsWith('/admin') || pathname.startsWith('/admin-login')

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {!hideLayout && <Navbar />}
                <main className={!hideLayout ? 'pb-16 md:pb-0' : ''}>
                  {children}
                </main>
                {!hideLayout && <Footer />}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
