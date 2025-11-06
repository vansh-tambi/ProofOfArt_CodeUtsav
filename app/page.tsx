'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Proof of Art
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Verifiable Generative AI Framework
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Prove your AI-generated artwork&apos;s authorship and originality
            with blockchain-backed cryptographic proof. Your creativity,
            permanently verified.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/create"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Art
            </Link>
            <Link
              href="/verify"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Verify Art
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">
              Cryptographic Proof
            </h3>
            <p className="text-gray-600">
              Every artwork is linked to its creator, prompt, and timestamp
              through SHA-256 hashing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">⛓️</div>
            <h3 className="text-xl font-semibold mb-2">
              Blockchain Storage
            </h3>
            <p className="text-gray-600">
              Immutable records on Ethereum/Polygon ensure your proof cannot
              be altered or forged.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">
              Decentralized Storage
            </h3>
            <p className="text-gray-600">
              Your artwork and metadata are stored on IPFS for permanent,
              decentralized access.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Connect Wallet</h4>
              <p className="text-sm text-gray-600">
                Link your Web3 wallet to establish your identity
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Create Art</h4>
              <p className="text-sm text-gray-600">
                Enter your prompt and generate AI artwork
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Generate Proof</h4>
              <p className="text-sm text-gray-600">
                System creates cryptographic hash and stores on blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Get Certificate</h4>
              <p className="text-sm text-gray-600">
                Receive verifiable certificate of your artwork&apos;s authenticity
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 Proof of Art. Built for Web3 Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}





