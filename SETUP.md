# Setup Guide for Proof of Art

## Quick Start

Follow these steps to get the Proof of Art system running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required: OpenAI API Key for image generation
OPENAI_API_KEY=sk-...

# Required: Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Required: WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Optional: IPFS Configuration
IPFS_API_URL=https://ipfs.infura.io:5001/api/v0
IPFS_AUTH=your_project_id:your_secret
```

### 3. Deploy Smart Contract

#### Option A: Deploy to Testnet (Recommended)

1. Get testnet ETH from a faucet (e.g., https://sepoliafaucet.com/)

2. Update `hardhat.config.ts` with your private key and RPC URL

3. Deploy:
```bash
npm run compile-contract
npm run deploy-contract
```

4. Copy the deployed contract address and update `.env`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

#### Option B: Use Local Hardhat Network (For Testing)

1. Start local node:
```bash
npx hardhat node
```

2. In another terminal, deploy:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3. Update `.env` with the contract address

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Contract ABI Not Found

If you see errors about missing contract ABI:
1. Compile the contract: `npm run compile-contract`
2. The ABI will be generated in `artifacts/contracts/ProofOfArt.sol/ProofOfArt.json`
3. Update `lib/blockchain.ts` to import from artifacts instead of `contract-abi.ts`

### Wallet Connection Issues

- Ensure you have MetaMask or a compatible wallet installed
- Make sure you're on the correct network (Sepolia testnet)
- Check your WalletConnect Project ID in `.env`

### IPFS Upload Fails

- If using public gateway, it may be slow or unreliable
- Consider using Pinata (https://pinata.cloud) or Infura IPFS
- Update `IPFS_API_URL` and `IPFS_AUTH` in `.env`

### AI Generation Fails

- Verify your OpenAI API key is valid
- Check your API quota/credits
- For alternative, configure Stability AI in `lib/ai.ts`

## Next Steps

1. Test the flow: Connect wallet → Create art → Verify
2. Check blockchain transaction on Etherscan/Polygonscan
3. Verify IPFS links are accessible
4. Customize UI/UX as needed

## Production Deployment

Before deploying to production:

1. **Security Audit**: Review smart contract and API endpoints
2. **Rate Limiting**: Implement rate limiting for API routes
3. **Error Handling**: Add comprehensive error handling
4. **Monitoring**: Set up monitoring and logging
5. **Mainnet**: Deploy to mainnet (Ethereum/Polygon) with proper testing
6. **IPFS Pinning**: Use Pinata or similar for reliable IPFS storage





