'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image' // Import Image component

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Create', href: '/create' },
    { name: 'Verify', href: '/verify' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card fixed top-4 left-4 right-4 z-50 
                 flex items-center justify-between rounded-xl p-4 shadow-lg"
    >
      {/* App Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center gap-2"> {/* Added flex to align image and text */}
          <Image
            src="/logo.png" // Path to your logo in the `app` directory
            alt="Authentica Logo"
            width={36} // Adjust size as needed
            height={36} // Adjust size as needed
            priority // For better LCP
          />
          <span className="text-2xl font-bold text-white tracking-tighter hidden md:block"> {/* Hide on small screens if desired */}
            Authentica
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              text-lg font-medium transition-colors duration-300
              ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Wallet Connection Button */}
      <div className="flex-shrink-0">
        <ConnectButton
          accountStatus="avatar"
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </motion.nav>
  )
}