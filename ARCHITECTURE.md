# Proof of Art - System Architecture

## Overview

Proof of Art is a blockchain-based system that creates verifiable proof of authorship for AI-generated content. The system cryptographically links creators, prompts, outputs, and timestamps, storing them immutably on the blockchain.

## System Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Connect Wallet     │
│  (RainbowKit)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Enter Prompt       │
│  (Frontend)         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Generate AI Art    │
│  (OpenAI API)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Hash Generation    │
│  (SHA-256)          │
│  - Prompt Hash      │
│  - Output Hash      │
│  - Combined Hash    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Upload to IPFS     │
│  (Output + Metadata)│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Register on Chain  │
│  (Smart Contract)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Generate Certificate│
│  (QR Code + Proof)  │
└─────────────────────┘
```

## Components

### 1. Frontend (Next.js 14)

**Pages:**
- `/` - Home page with features and overview
- `/create` - Art creation interface
- `/verify` - Art verification portal

**Components:**
- Wallet connection via RainbowKit
- Prompt input form
- AI generation interface
- Certificate display with QR code
- Verification form

**Technologies:**
- React 18
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Wagmi for Web3 interactions
- RainbowKit for wallet connection

### 2. Backend API (Next.js API Routes)

**Endpoints:**

#### `/api/generate`
- **Method**: POST
- **Input**: `{ prompt, userAddress, type }`
- **Process**:
  1. Generate AI content (image/text)
  2. Compute hashes (prompt, output, combined)
  3. Upload to IPFS
  4. Return proof data
- **Output**: `{ proof, outputCid, metadataCid, outputBuffer }`

#### `/api/verify`
- **Method**: POST
- **Input**: `{ file, combinedHash }`
- **Process**:
  1. Query blockchain for proof
  2. Verify hash matches
  3. Return verification result
- **Output**: `{ verified, proof }`

### 3. Smart Contract (Solidity)

**Contract**: `ProofOfArt.sol`

**Functions:**
- `registerProof()` - Register new proof on blockchain
- `verifyProof()` - Verify proof existence and retrieve details
- `getCreatorProofs()` - Get all proofs by creator
- `getTotalProofs()` - Get total number of proofs

**Storage:**
- `mapping(string => ArtProof) proofs` - Hash to proof mapping
- `mapping(address => string[]) creatorProofs` - Creator to proofs mapping
- `string[] allProofHashes` - Array of all proof hashes

**Events:**
- `ProofRegistered` - Emitted when proof is registered

### 4. Services (`lib/`)

#### `crypto.ts`
- `hashString()` - SHA-256 hash of string
- `hashBuffer()` - SHA-256 hash of buffer/file
- `generateCombinedHash()` - Combined hash from components
- `generateProof()` - Complete proof generation

#### `ai.ts`
- `generateImage()` - Generate image using DALL-E
- `generateText()` - Generate text using GPT-4
- `generateImageStability()` - Alternative using Stability AI

#### `ipfs.ts`
- `uploadToIpfs()` - Upload file to IPFS
- `uploadMetadataToIpfs()` - Upload JSON metadata to IPFS
- `getIpfsUrl()` - Get IPFS gateway URL

#### `blockchain.ts`
- `getContract()` - Get contract instance
- `registerProofOnChain()` - Register proof transaction
- `verifyProofOnChain()` - Verify proof query
- `getProvider()` - Get blockchain provider

## Data Flow

### Creation Flow

1. **User Input**:
   - User connects wallet
   - Enters prompt
   - Clicks "Generate"

2. **AI Generation**:
   - Frontend calls `/api/generate`
   - Backend calls OpenAI API
   - Returns generated image

3. **Proof Generation**:
   - Backend computes:
     - `H1 = SHA-256(prompt)`
     - `H2 = SHA-256(output)`
     - `H3 = SHA-256(userAddress + timestamp)`
     - `CombinedHash = SHA-256(H1 + H2 + H3)`

4. **IPFS Upload**:
   - Upload output image → `outputCid`
   - Upload metadata JSON → `metadataCid`

5. **Blockchain Registration**:
   - Frontend calls smart contract `registerProof()`
   - Transaction includes: `promptHash`, `outputHash`, `combinedHash`, `ipfsLink`
   - Transaction mined and confirmed

6. **Certificate Generation**:
   - Frontend generates certificate with:
     - Artwork preview
     - Prompt
     - Creator address
     - Timestamp
     - Blockchain transaction hash
     - IPFS links
     - QR code for verification

### Verification Flow

1. **User Input**:
   - User navigates to `/verify`
   - Enters hash or uploads file

2. **Hash Computation** (if file uploaded):
   - Compute SHA-256 hash of file

3. **Blockchain Query**:
   - Frontend calls `verifyProofOnChain()`
   - Smart contract returns proof details if exists

4. **Verification Result**:
   - Display creator, timestamp, IPFS link
   - Show verification status (verified/not found)

## Security Considerations

### Cryptographic Hashing
- Uses SHA-256 for all hashing
- Combined hash ensures tamper-proof linkage
- Even single pixel change changes hash

### Blockchain Immutability
- Once recorded, proof cannot be altered
- Public ledger ensures transparency
- Smart contract code is auditable

### IPFS Storage
- Decentralized storage prevents single point of failure
- Content addressing ensures integrity
- Multiple gateways for redundancy

### Access Control
- Only creator can register their proof
- Verification is public (read-only)
- No centralized authority required

## Scalability

### Current Limitations
- Single blockchain (Ethereum/Polygon)
- Sequential generation (one at a time)
- IPFS may be slow for large files

### Future Enhancements
- Multi-chain support
- Batch processing
- Layer 2 solutions (Polygon, Arbitrum)
- Pinned IPFS storage (Pinata, Infura)
- Caching layer for verification

## Deployment

### Smart Contract
- Deploy to testnet (Sepolia) for development
- Deploy to mainnet (Ethereum/Polygon) for production
- Verify contract on Etherscan/Polygonscan

### Frontend/Backend
- Deploy to Vercel/Netlify
- Configure environment variables
- Set up IPFS gateway
- Configure RPC endpoints

### Monitoring
- Track contract events
- Monitor API usage
- Log IPFS uploads
- Track verification queries

## Testing

### Unit Tests
- Hash generation functions
- Smart contract functions
- IPFS upload/retrieval

### Integration Tests
- End-to-end creation flow
- Verification flow
- Blockchain interaction

### Manual Testing
- Wallet connection
- Art generation
- Certificate generation
- Verification

## Future Extensions

1. **Multi-modal Support**: Text, video, music generation
2. **Watermarking**: Embed hash in pixel data
3. **NFT Integration**: Mint as NFT with proof
4. **Proof-of-Human**: Privacy-preserving biometric verification
5. **Plagiarism Detection**: Hash-based similarity matching
6. **Creator Dashboard**: Analytics and proof management
7. **Marketplace**: Verified AI art marketplace



