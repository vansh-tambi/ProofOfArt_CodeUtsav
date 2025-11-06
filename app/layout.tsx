import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers' // Note: This is a NAMED import
import Navbar from './components/Navbar'
import PageTransitionWrapper from './components/PageTransitionWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Authentica | Proof-of-Art',
  description: 'Verifiable Authorship for AI-Generated Content',
  icons: {
    icon: '/logo.png', // Points to public/logo.png
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* The Navbar is sticky, so it's outside the main content area */}
          <Navbar />
          
          {/* Main content area with padding-top to avoid the Navbar */}
          <main className="pt-28 px-4 md:px-8">
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
          </main>
        </Providers>
      </body>
    </html>
  )
}