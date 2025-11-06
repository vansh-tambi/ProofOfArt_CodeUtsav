'use client';

import { useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { registerProofOnChain } from '@/lib/blockchain';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [proof, setProof] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !isConnected || !address) {
      alert('Please connect your wallet and enter a prompt');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setProof(null);
    setCertificate(null);

    try {
      // Call API to generate image and create proof
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          userAddress: address,
          type: 'image',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(`data:image/png;base64,${data.proof.outputBuffer}`);
      setProof(data.proof);

      // Register on blockchain
      if (signer) {
        try {
          const txHash = await registerProofOnChain(signer, {
            promptHash: data.proof.promptHash,
            outputHash: data.proof.outputHash,
            combinedHash: data.proof.combinedHash,
            ipfsLink: data.proof.outputCid,
          });

          // Create certificate
          const cert = {
            creator: address,
            prompt,
            promptHash: data.proof.promptHash,
            outputHash: data.proof.outputHash,
            combinedHash: data.proof.combinedHash,
            timestamp: new Date(data.proof.timestamp).toISOString(),
            ipfsLink: data.proof.outputCid,
            metadataCid: data.proof.metadataCid,
            txHash,
            verificationUrl: `${window.location.origin}/verify?hash=${data.proof.combinedHash}`,
          };

          setCertificate(cert);
        } catch (error: any) {
          console.error('Blockchain registration error:', error);
          alert(
            'Image generated but blockchain registration failed: ' +
              error.message
          );
        }
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      alert('Failed to generate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Proof of Art
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Create Verifiable AI Art
          </h1>

          {!isConnected ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-lg text-gray-600 mb-4">
                Connect your wallet to get started
              </p>
              <ConnectButton />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic cityscape at sunset with flying cars..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate & Create Proof'}
                </button>
              </div>

              {generatedImage && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-4">Generated Artwork</h2>
                  <img
                    src={generatedImage}
                    alt="Generated artwork"
                    className="w-full rounded-lg mb-4"
                  />
                  {proof && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Combined Hash:</strong>{' '}
                        <code className="text-xs">{proof.combinedHash}</code>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {certificate && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border-2 border-blue-200">
                  <h2 className="text-3xl font-bold text-center mb-6">
                    🎨 Proof of Art Certificate
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Creator
                      </h3>
                      <p className="text-sm font-mono bg-white p-2 rounded">
                        {certificate.creator}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Timestamp
                      </h3>
                      <p className="text-sm bg-white p-2 rounded">
                        {new Date(certificate.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Prompt
                      </h3>
                      <p className="text-sm bg-white p-2 rounded">
                        {certificate.prompt}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Combined Hash
                      </h3>
                      <p className="text-xs font-mono bg-white p-2 rounded break-all">
                        {certificate.combinedHash}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Transaction Hash
                      </h3>
                      <p className="text-xs font-mono bg-white p-2 rounded break-all">
                        {certificate.txHash}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        IPFS Link
                      </h3>
                      <a
                        href={`https://ipfs.io/ipfs/${certificate.ipfsLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline break-all"
                      >
                        ipfs://{certificate.ipfsLink}
                      </a>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Verification URL
                      </h3>
                      <a
                        href={certificate.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline break-all"
                      >
                        {certificate.verificationUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCodeSVG value={certificate.verificationUrl} size={200} />
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head><title>Proof of Art Certificate</title></head>
                              <body>
                                <h1>Proof of Art Certificate</h1>
                                <p><strong>Creator:</strong> ${certificate.creator}</p>
                                <p><strong>Timestamp:</strong> ${certificate.timestamp}</p>
                                <p><strong>Prompt:</strong> ${certificate.prompt}</p>
                                <p><strong>Hash:</strong> ${certificate.combinedHash}</p>
                                <p><strong>Verify at:</strong> ${certificate.verificationUrl}</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Print Certificate
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

