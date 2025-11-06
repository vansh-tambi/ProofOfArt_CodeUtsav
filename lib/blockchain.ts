import { ethers } from 'ethers';
// After compilation, use: import ProofOfArtABI from '../artifacts/contracts/ProofOfArt.sol/ProofOfArt.json';
import { ProofOfArtABI } from './contract-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

/**
 * Get contract instance
 */
export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, ProofOfArtABI.abi, signerOrProvider);
}

/**
 * Register proof on blockchain
 */
export async function registerProofOnChain(
  signer: ethers.Signer,
  proofData: {
    promptHash: string;
    outputHash: string;
    combinedHash: string;
    ipfsLink: string;
  }
): Promise<string> {
  try {
    const contract = getContract(signer);
    const tx = await contract.registerProof(
      proofData.promptHash,
      proofData.outputHash,
      proofData.combinedHash,
      proofData.ipfsLink
    );

    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('Blockchain registration error:', error);
    throw new Error('Failed to register proof on blockchain');
  }
}

/**
 * Verify proof on blockchain
 */
export async function verifyProofOnChain(
  provider: ethers.Provider,
  combinedHash: string
): Promise<{
  exists: boolean;
  creator: string;
  timestamp: number;
  ipfsLink: string;
}> {
  try {
    const contract = getContract(provider);
    const result = await contract.verifyProof(combinedHash);
    
    return {
      exists: result[0],
      creator: result[1],
      timestamp: Number(result[2]),
      ipfsLink: result[3],
    };
  } catch (error) {
    console.error('Blockchain verification error:', error);
    throw new Error('Failed to verify proof on blockchain');
  }
}

/**
 * Get provider for read-only operations
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

