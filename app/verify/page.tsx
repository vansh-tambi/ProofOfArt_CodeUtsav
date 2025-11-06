'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import LoadingSpinner from '../components/LoadingSpinner'
import { format } from 'date-fns'
import Image from 'next/image' // <-- Import Image component

// Define the shape of the data we expect from verification
type VerifiedProof = {
  creatorAddress: string
  timestamp: number
  prompt: string
  ipfsUrl: string
  txHash: string
}

// Mock function to "check" the blockchain
const mockFetchProof = (hash: string): Promise<VerifiedProof> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a "Not Found" error for any hash except our mock one
      if (hash !== '0x' + 'b'.repeat(64)) {
        reject(new Error('Proof not found. The hash is invalid or not registered.'))
      }

      // Simulate a successful lookup
      resolve({
        creatorAddress: '0x1234...5678',
        timestamp: new Date('2025-10-30T14:30:00Z').getTime(),
        prompt: "A cyberpunk city skyline, neon purple and blue, 8k resolution",
        ipfsUrl: 'ipfs://' + 'd'.repeat(46),
        txHash: '0x' + 'c'.repeat(64),
      })
    }, 2000)
  })
}

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const hashFromUrl = searchParams.get('hash')

  // --- Page State ---
  const [hashInput, setHashInput] = useState(hashFromUrl || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifiedProof | null>(null)

  // --- New Image Upload States ---
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null)
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null)

  // --- Main Verification Logic (takes hash) ---
  const handleVerify = async (hashToVerify: string) => {
    if (!hashToVerify) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const proof = await mockFetchProof(hashToVerify)
      setResult(proof)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Auto-verify if hash is in URL ---
  useEffect(() => {
    if (hashFromUrl) {
      setHashInput(hashFromUrl)
      handleVerify(hashFromUrl)
    }
  }, [hashFromUrl])

  // --- Image Handlers ---
  const clearImage = () => {
    setUploadedImageFile(null)
    setUploadedImagePreview(null)
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setUploadedImageFile(file)
        setUploadedImagePreview(URL.createObjectURL(file))
        setHashInput('') // Clear hash input
        setError(null)
      } else {
        setError('Please upload a valid image file.')
        clearImage()
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImageFile(file)
      setUploadedImagePreview(URL.createObjectURL(file))
      setHashInput('') // Clear hash input
      setError(null)
    } else {
      setError('Please drop a valid image file.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // --- Form Submission (Handles BOTH inputs) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let hashToVerify = '';

    if (uploadedImageFile) {
      // In a real app, you'd hash the image client-side first
      // const imageHash = await hashImage(uploadedImageFile);
      // hashToVerify = imageHash;

      // --- MOCK LOGIC ---
      // For this demo, we'll pretend any uploaded image
      // has the "correct" hash to pass verification.
      console.log('Simulating hashing of image:', uploadedImageFile.name)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate hashing time
      hashToVerify = '0x' + 'b'.repeat(64)
      // --- END MOCK LOGIC ---
      
    } else if (hashInput) {
      hashToVerify = hashInput
    } else {
      setError('Please enter a hash or upload an image.')
      return
    }

    handleVerify(hashToVerify) // Call the verification logic
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[70vh] pb-20">
      {/* --- The Verification Form --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-6 md:p-8 rounded-2xl"
      >
        <form onSubmit={handleSubmit}>
          <h2 className="block text-3xl font-bold text-white mb-4 text-center">
            Verify Proof-of-Art
          </h2>
          <p className="text-center text-slate-300 mb-6">
            Enter a Proof Hash or upload an image to verify its authenticity.
          </p>
          
          {/* Hash Input */}
          <label htmlFor="hash" className="block text-xl font-semibold text-white mb-3">
            Verify by Hash
          </label>
          <input
            id="hash"
            type="text"
            value={hashInput}
            onChange={(e) => {
              setHashInput(e.target.value)
              if (e.target.value) clearImage() // Clear image if user types hash
            }}
            placeholder="0x..."
            className="w-full p-4 rounded-lg bg-black/20 text-white font-mono
                       border border-white/20 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
            disabled={isLoading || !!uploadedImageFile} // Disable if image is uploaded
          />

          <div className="text-center text-slate-400 my-4 text-lg">
            — OR —
          </div>

          {/* Image Dropzone */}
          <label htmlFor="image-upload" className="block text-xl font-semibold text-white mb-3">
            Verify by Image
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`
              w-full p-6 md:p-10 rounded-lg border-2 border-dashed
              flex flex-col items-center justify-center cursor-pointer
              transition-colors duration-200
              ${
                uploadedImageFile
                  ? 'border-green-400 bg-green-900/10'
                  : 'border-white/30 hover:border-blue-400 bg-black/20'
              }
            `}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploadedImagePreview ? (
              <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
                <Image
                  src={uploadedImagePreview}
                  alt="Uploaded preview"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg max-h-full max-w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); clearImage() }}
                  className="absolute top-2 right-2 p-2 bg-red-600/70 hover:bg-red-600 rounded-full text-white"
                  title="Remove image"
                >
                  &times;
                </motion.button>
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-slate-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a3 3 0 013 3v10a2 2 0 01-2 2H7a2 2 0 01-2-2v-1a4 4 0 012-4z"
                  ></path>
                </svg>
                <p className="text-lg text-slate-300">
                  Drag & Drop image here, or{' '}
                  <span className="text-blue-400 font-medium">click to upload</span>
                </p>
              </>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading || !!hashInput} // Disable if hash is entered
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || (!hashInput && !uploadedImageFile)}
            className="mt-6 w-full rounded-xl px-8 py-4
                       text-lg font-semibold text-white
                       bg-white/10 hover:bg-white/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </motion.button>
        </form>
      </motion.div>

      {/* --- The Results --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingSpinner size="lg" />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-8 w-full max-w-2xl p-6 rounded-2xl border-2 border-red-500/50"
          >
            <h3 className="text-2xl font-bold text-red-400 text-center">
              Verification Failed
            </h3>
            <p className="text-center text-red-300 mt-2">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-8 w-full max-w-2xl p-6 md:p-8 rounded-2xl border-2 border-green-500/50"
          >
            <h3 className="text-2xl font-bold text-green-400 text-center mb-6">
              ✅ Proof Verified
            </h3>
            <div className="space-y-3">
              <DetailItem
                label="Creator"
                value={result.creatorAddress}
              />
              <DetailItem
                label="Timestamp"
                value={format(new Date(result.timestamp), 'dd MMM yyyy, HH:mm:ss')}
              />
              <DetailItem label="Prompt" value={`"${result.prompt}"`} />
              <DetailItem
                label="Transaction"
                value={result.txHash}
              />
              <DetailItem
                label="IPFS Data"
                value={result.ipfsUrl}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper component for displaying details
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left py-2 border-b border-white/10">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="text-lg text-white font-mono break-all">{value}</p>
    </div>
  )
}