# Quick Start Guide - Proof of Art

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment

Create a `.env` file in the root directory:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-...

# Required: Smart Contract Address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Required: Blockchain RPC URL
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Required: WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Step 3: Deploy Smart Contract

```bash
# Compile contract
npm run compile-contract

# Deploy to testnet (update hardhat.config.ts first)
npm run deploy-contract

# Copy the deployed address to .env
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test the Flow

1. **Connect Wallet**: Click "Connect Wallet" → Select MetaMask
2. **Create Art**: Go to `/create` → Enter prompt → Click "Generate"
3. **View Certificate**: After generation, view your proof certificate
4. **Verify**: Go to `/verify` → Paste hash → Verify authenticity

## 📋 Checklist

- [ ] Node.js 18+ installed
- [ ] MetaMask or compatible wallet installed
- [ ] OpenAI API key obtained
- [ ] WalletConnect Project ID created (https://cloud.walletconnect.com)
- [ ] Testnet ETH for deployment (https://sepoliafaucet.com/)
- [ ] Smart contract deployed
- [ ] Environment variables configured
- [ ] Development server running

## 🎯 Demo Flow

1. **Home Page** (`/`): Overview and features
2. **Create Page** (`/create`): 
   - Connect wallet
   - Enter prompt: "A futuristic cityscape at sunset"
   - Generate art
   - View certificate with QR code
3. **Verify Page** (`/verify`):
   - Enter hash from certificate
   - Verify on blockchain
   - View proof details

## 🐛 Common Issues

**"Contract ABI not found"**
→ Run `npm run compile-contract` first

**"Failed to connect wallet"**
→ Check WalletConnect Project ID in `.env`

**"IPFS upload failed"**
→ Use Pinata or Infura IPFS for reliable storage

**"AI generation failed"**
→ Check OpenAI API key and quota

**"Blockchain registration failed"**
→ Ensure you're on the correct network (Sepolia testnet)
→ Check contract address in `.env`

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [SETUP.md](./SETUP.md) for detailed setup

## 🎨 Customization

- **AI Model**: Update `lib/ai.ts` to use different AI providers
- **UI/UX**: Modify Tailwind classes in `app/` components
- **Smart Contract**: Add features to `contracts/ProofOfArt.sol`
- **Storage**: Configure IPFS in `lib/ipfs.ts`

Happy Hacking! 🚀





