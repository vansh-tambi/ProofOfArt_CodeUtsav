'use client' // Required for Framer Motion

import { motion } from 'framer-motion'
import AnimatedButton from './components/AnimatedButton' // Import our new button

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animate children one after another
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        className="flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
        >
          Verifiable Authorship for
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            AI-Generated Art
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-slate-300 max-w-2xl"
        >
          Create, verify, and own your digital creations. Our platform binds
          your identity, your prompt, and your art to the blockchain—forever.
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 mt-6"
        >
          <AnimatedButton
            href="/create"
            className="bg-white/10 hover:bg-white/20" // Primary CTA style
          >
            Create Your Proof
          </AnimatedButton>
          
          <AnimatedButton
            href="/verify"
            className="bg-black/10 hover:bg-black/20" // Secondary CTA style
          >
            Verify an Artwork
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div>
  )
}