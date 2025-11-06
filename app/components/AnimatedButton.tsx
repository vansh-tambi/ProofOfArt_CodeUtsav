'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function AnimatedButton({ href, children, className = '' }: Props) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`
          glass-card
          rounded-xl px-8 py-3
          text-lg font-semibold text-white
          shadow-lg
          transition-all duration-300
          hover:shadow-2xl hover:border-white/30
          ${className}
        `}
      >
        {children}
      </motion.button>
    </Link>
  )
}