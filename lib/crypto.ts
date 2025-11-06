import crypto from 'crypto';

/**
 * Generate SHA-256 hash of a string
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Generate SHA-256 hash of a buffer (file)
 */
export function hashBuffer(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Generate combined hash from prompt, output, user, and timestamp
 */
export function generateCombinedHash(
  promptHash: string,
  outputHash: string,
  userAddress: string,
  timestamp: number
): string {
  const combined = `${promptHash}${outputHash}${userAddress}${timestamp}`;
  return hashString(combined);
}

/**
 * Generate proof data structure
 */
export interface ProofData {
  promptHash: string;
  outputHash: string;
  combinedHash: string;
  userAddress: string;
  timestamp: number;
}

export function generateProof(
  prompt: string,
  outputBuffer: Buffer,
  userAddress: string,
  timestamp: number
): ProofData {
  const promptHash = hashString(prompt);
  const outputHash = hashBuffer(outputBuffer);
  const combinedHash = generateCombinedHash(promptHash, outputHash, userAddress, timestamp);

  return {
    promptHash,
    outputHash,
    combinedHash,
    userAddress,
    timestamp,
  };
}





