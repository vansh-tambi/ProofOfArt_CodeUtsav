'use client'

import { motion } from 'framer-motion'
import { QRCode } from 'react-qrcode-logo' // Using this as it's a common drop-in for qrcode.react
import { format } from 'date-fns' // Comes with Next.js, but let's add `date-fns` if not: npm install date-fns

// Define the shape of our proof data
type ProofData = {
  creatorAddress: string
  timestamp: number
  prompt: string
  imageHash: string // Hash of the generated image
  proofHash: string // The combined hash
  txHash: string
  ipfsUrl: string
}

type Props = {
  proofData: ProofData
}

export default function CertificateDisplay({ proofData }: Props) {
  // We'll generate a verification URL (even if the page isn't fully working yet)
  const verificationUrl = `${window.location.origin}/verify?hash=${proofData.proofHash}`

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add a simple "Copied!" feedback if you like
  }

  // Truncate wallet addresses
  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card mt-8 w-full max-w-2xl rounded-2xl p-6 md:p-8"
      id="certificate" // For printing
    >
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Proof-of-Art Certificate
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: QR Code and Image */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="bg-white p-2 rounded-lg">
            <QRCode
              value={verificationUrl}
              size={160}
              qrStyle="squares"
              eyeRadius={8}
            />
          </div>
          <p className="text-sm text-slate-300">Scan to Verify</p>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 space-y-3">
          <DetailItem
            label="Creator"
            value={truncateAddress(proofData.creatorAddress)}
            onCopy={() => copyToClipboard(proofData.creatorAddress)}
          />
          <DetailItem
            label="Timestamp"
            value={format(new Date(proofData.timestamp), 'dd MMM yyyy, HH:mm:ss')}
          />
          <DetailItem label="Prompt" value={`"${proofData.prompt}"`} />
          <DetailItem
            label="Proof Hash"
            value={truncateAddress(proofData.proofHash)}
            onCopy={() => copyToClipboard(proofData.proofHash)}
          />
          <DetailItem
            label="Transaction"
            value={truncateAddress(proofData.txHash)}
            onCopy={() => copyToClipboard(proofData.txHash)}
          />
        </div>
      </div>
      
      {/* Print Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.print()} // Simple print functionality
        className="glass-card mt-8 w-full rounded-xl px-8 py-3
                   text-lg font-semibold text-white
                   transition-all duration-300
                   hover:bg-white/10"
      >
        Print Certificate
      </motion.button>
    </motion.div>
  )
}

// A helper component to keep the list clean
function DetailItem({
  label,
  value,
  onCopy,
}: {
  label: string
  value: string
  onCopy?: () => void
}) {
  return (
    <div className="text-left">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-lg text-white font-mono break-all">{value}</p>
        {onCopy && (
          <button
            onClick={onCopy}
            title="Copy"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        )}
      </div>
    </div>
  )
}