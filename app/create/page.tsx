'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import LoadingSpinner from '../components/LoadingSpinner'
import CertificateDisplay from '../components/CertificateDisplay'
import Image from 'next/image' // For displaying the generated image

// Define the shape of our proof data
type ProofData = {
  creatorAddress: string
  timestamp: number
  prompt: string
  imageHash: string
  proofHash: string
  txHash: string
  ipfsUrl: string
}

export default function CreatePage() {
  const { isConnected, address } = useAccount()

  // --- Page State ---
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // --- Results State ---
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [proof, setProof] = useState<ProofData | null>(null)

  // --- Mock API Call Function ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt || !address) return

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)
    setProof(null)

    try {
      // --- STAGE 1: Call API to generate image (Mocked) ---
      // In a real app:
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({ prompt, userAddress: address }),
      // });
      // const data = await response.json();
      
      // Mocking the API call:
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Mocked image result (use a real placeholder)
      const mockImageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/512/512`
      setGeneratedImage(mockImageUrl)

      
      // --- STAGE 2: Register on-chain (Mocked) ---
      // In a real app, this is where you'd call the smart contract
      // const tx = await registerProofOnChain(...)
      
      // Mocking the blockchain transaction:
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mocked proof data:
      const mockProof: ProofData = {
        creatorAddress: address,
        timestamp: Date.now(),
        prompt: prompt,
        imageHash: '0x' + 'a'.repeat(64),
        proofHash: '0x' + 'b'.repeat(64),
        txHash: '0x' + 'c'.repeat(64),
        ipfsUrl: 'ipfs://' + 'd'.repeat(46),
      }
      setProof(mockProof)

    } catch (err) {
      console.error(err)
      setError('Failed to generate proof. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Render Wallet Connect Message ---
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card text-center p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-xl text-slate-300">
            Please connect your wallet to create a Proof-of-Art.
          </p>
        </motion.div>
      </div>
    )
  }

  // --- Render Main Page ---
  return (
    <div className="flex flex-col items-center w-full min-h-[70vh] pb-20">
      {/* --- The Form --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-6 md:p-8 rounded-2xl"
      >
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="prompt"
            className="block text-2xl font-semibold text-white mb-4"
          >
            Enter Your Prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A cyberpunk city skyline, neon purple and blue, 8k resolution'"
            className="w-full p-4 rounded-lg bg-black/20 text-white
                       border border-white/20 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || !prompt}
            className="mt-6 w-full rounded-xl px-8 py-4
                       text-lg font-semibold text-white
                       bg-white/10 hover:bg-white/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
          >
            {isLoading ? 'Generating...' : 'Generate & Create Proof'}
          </motion.button>
        </form>
      </motion.div>

      {/* --- The Results --- */}
      {isLoading && <LoadingSpinner size="lg" />}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-red-400 bg-red-900/50 p-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Generated Image Preview */}
      {generatedImage && !proof && ( // Show image *before* certificate
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-2xl text-white font-semibold mb-4">
            Image Generated!
          </h3>
          <Image
            src={generatedImage}
            alt="AI generated art"
            width={512}
            height={512}
            className="rounded-xl shadow-lg"
          />
          <p className="text-slate-300 mt-4">
            Registering proof on the blockchain...
          </p>
        </motion.div>
      )}

      {/* Final Certificate */}
      {proof && <CertificateDisplay proofData={proof} />}
    </div>
  )
}