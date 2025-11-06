# How to Run and Use Proof of Art

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Node.js 18 or higher installed ([Download here](https://nodejs.org/))
- ✅ npm or yarn package manager
- ✅ A code editor (VS Code recommended)
- ✅ MetaMask browser extension installed ([Download here](https://metamask.io/))

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages (Next.js, React, Web3 libraries, etc.).

### Step 2: Get API Keys

You'll need to obtain API keys for the following services:

#### A. OpenAI API Key (for AI image generation)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

#### B. WalletConnect Project ID (for wallet connection)
1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

#### C. Blockchain RPC URL (for connecting to blockchain)
**Option 1: Use Infura (Recommended)**
1. Go to [https://infura.io](https://infura.io)
2. Sign up and create a new project
3. Select "Sepolia" network (testnet)
4. Copy the HTTPS URL (looks like: `https://sepolia.infura.io/v3/YOUR_KEY`)

**Option 2: Use Public RPC**
- Sepolia: `https://rpc.sepolia.org`
- Polygon Mumbai: `https://rpc.ankr.com/polygon_mumbai`

### Step 3: Create Environment File

Create a `.env` file in the root directory of your project:

```bash
# On Windows PowerShell
New-Item .env

# On Mac/Linux
touch .env
```

Open the `.env` file and add your configuration:

```env
# OpenAI API Key (Required)
OPENAI_API_KEY=sk-your-openai-key-here

# WalletConnect Project ID (Required)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id

# Blockchain RPC URL (Required)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Smart Contract Address (Will be filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Private Key for Deployment (Only needed for deployment)
PRIVATE_KEY=your-private-key-here

# Deployment RPC URLs (Only needed for deployment)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

**⚠️ Important**: 
- Never share your `.env` file
- Never commit it to git (it's already in `.gitignore`)
- Keep your `PRIVATE_KEY` secure

### Step 4: Deploy Smart Contract

#### Option A: Deploy to Sepolia Testnet (Recommended)

1. **Get testnet ETH**:
   - Go to [https://sepoliafaucet.com](https://sepoliafaucet.com) or [https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)
   - Enter your wallet address
   - Request testnet ETH (you'll need it for gas fees)

2. **Update Hardhat config** (already configured, just verify):
   - Open `hardhat.config.ts`
   - Make sure `SEPOLIA_RPC_URL` in `.env` is correct
   - Make sure `PRIVATE_KEY` in `.env` is your deployer wallet's private key

3. **Compile the contract**:
   ```bash
   npm run compile-contract
   ```

4. **Deploy the contract**:
   ```bash
   npm run deploy-contract
   ```

5. **Copy the deployed contract address**:
   - The terminal will show: `ProofOfArt deployed to: 0x...`
   - Copy this address

6. **Update `.env` file**:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x-your-deployed-contract-address-here
   ```

#### Option B: Use Local Hardhat Network (For Testing)

1. **Start local Hardhat node** (in one terminal):
   ```bash
   npx hardhat node
   ```

2. **Deploy contract** (in another terminal):
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

3. **Update `.env`**:
   ```env
   NEXT_PUBLIC_RPC_URL=http://localhost:8545
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x-your-deployed-contract-address
   ```

### Step 5: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

Open your browser and go to: **http://localhost:3000**

## 🎨 How to Use the Application

### 1. Connect Your Wallet

1. On the home page, click **"Connect Wallet"** (top right)
2. Select **MetaMask** (or your preferred wallet)
3. Approve the connection in MetaMask
4. Make sure you're on the **Sepolia testnet** (or your configured network)

**To switch to Sepolia testnet in MetaMask:**
- Click MetaMask extension
- Click network dropdown
- Select "Sepolia" (or add it if not present)
- Network details:
  - Network Name: Sepolia
  - RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY`
  - Chain ID: 11155111
  - Currency: ETH

### 2. Create AI Art with Proof

1. Click **"Create Art"** button (or go to `/create`)
2. You'll see the creation page
3. **Enter your prompt** in the text area, for example:
   - "A futuristic cityscape at sunset with flying cars"
   - "A cyberpunk robot in a neon-lit alley"
   - "A serene mountain landscape with cherry blossoms"
4. Click **"Generate & Create Proof"**
5. Wait for:
   - AI image generation (30-60 seconds)
   - Hash computation
   - IPFS upload
   - Blockchain registration

6. **View your certificate**:
   - After generation, you'll see your artwork
   - Below it, a **Proof of Art Certificate** will appear
   - The certificate includes:
     - Your wallet address
     - Timestamp
     - Prompt
     - Combined hash
     - Transaction hash
     - IPFS link
     - QR code for verification

7. **Download/Print certificate** (optional):
   - Click "Print Certificate" to save as PDF

### 3. Verify Artwork

#### Method 1: Using the Hash from Certificate

1. Go to **"Verify Art"** page (or `/verify`)
2. Copy the **Combined Hash** from your certificate
3. Paste it into the verification input
4. Click **"Verify"**
5. You'll see:
   - ✅ Verification status
   - Creator address
   - Registration timestamp
   - IPFS link

#### Method 2: Using the URL

1. The certificate includes a **Verification URL**
2. Click it or copy-paste in browser
3. It will automatically verify the hash

#### Method 3: Using QR Code

1. Scan the QR code on the certificate
2. It will open the verification page with the hash pre-filled

## 🔧 Troubleshooting

### Issue: "Contract ABI not found"
**Solution**: 
```bash
npm run compile-contract
```
This generates the contract ABI in the `artifacts/` folder.

### Issue: "Failed to connect wallet"
**Solutions**:
- Make sure MetaMask is installed and unlocked
- Check WalletConnect Project ID in `.env`
- Try refreshing the page
- Clear browser cache

### Issue: "AI generation failed"
**Solutions**:
- Check your OpenAI API key in `.env`
- Verify you have API credits/quota
- Check your internet connection
- Wait a moment and try again (rate limits)

### Issue: "IPFS upload failed"
**Solutions**:
- IPFS public gateway may be slow - this is normal
- Wait and try again
- For production, use Pinata or Infura IPFS (update `IPFS_API_URL` in `.env`)

### Issue: "Blockchain registration failed"
**Solutions**:
- Make sure you're on the correct network (Sepolia testnet)
- Check contract address in `.env` matches deployed contract
- Verify you have testnet ETH for gas fees
- Check RPC URL is correct and accessible

### Issue: "Cannot find module 'qrcode.react'"
**Solution**: 
```bash
npm install qrcode.react
```

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill the process using port 3000, or use a different port
npm run dev -- -p 3001
```

## 📱 Testing the Complete Flow

Here's a quick test flow to verify everything works:

1. ✅ **Connect Wallet**: Should connect without errors
2. ✅ **Generate Art**: 
   - Enter prompt: "A beautiful sunset over mountains"
   - Should generate image in 30-60 seconds
   - Should show certificate after blockchain registration
3. ✅ **Verify Art**:
   - Copy hash from certificate
   - Paste in verify page
   - Should show verification success with creator address

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Compile smart contract
npm run compile-contract

# Deploy smart contract
npm run deploy-contract

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Next Steps

Once everything is working:

1. **Customize the UI**: Modify Tailwind classes in `app/` components
2. **Add features**: Extend the smart contract or add new API endpoints
3. **Deploy to production**: Use Vercel/Netlify for frontend deployment
4. **Mainnet deployment**: Deploy contract to Ethereum mainnet/Polygon (after testing)

## 💡 Tips

- **Development**: Use Sepolia testnet to avoid spending real ETH
- **Testing**: Test all features before mainnet deployment
- **Security**: Never share your private keys or `.env` file
- **IPFS**: Consider using Pinata for reliable IPFS storage in production
- **Monitoring**: Check blockchain transactions on [Etherscan](https://sepolia.etherscan.io)

## 📚 Need Help?

- Check `README.md` for full documentation
- Check `SETUP.md` for detailed setup
- Check `ARCHITECTURE.md` for system design
- Review `QUICK_START.md` for quick reference

Happy creating! 🎨


