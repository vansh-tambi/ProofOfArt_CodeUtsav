import { create } from 'ipfs-http-client';

// Initialize IPFS client
let ipfsClient: ReturnType<typeof create> | null = null;

function getIpfsClient() {
  if (!ipfsClient) {
    // Use public IPFS gateway or Pinata
    const ipfsApiUrl = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001/api/v0';
    const auth = process.env.IPFS_AUTH 
      ? `Basic ${Buffer.from(process.env.IPFS_AUTH).toString('base64')}`
      : undefined;

    ipfsClient = create({
      url: ipfsApiUrl,
      headers: auth ? { authorization: auth } : undefined,
    });
  }
  return ipfsClient;
}

/**
 * Upload file to IPFS
 */
export async function uploadToIpfs(file: Buffer, filename?: string): Promise<string> {
  try {
    const client = getIpfsClient();
    const result = await client.add({
      path: filename || `proof-${Date.now()}`,
      content: file,
    });
    
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadMetadataToIpfs(metadata: object): Promise<string> {
  try {
    const client = getIpfsClient();
    const metadataString = JSON.stringify(metadata, null, 2);
    const result = await client.add({
      path: `metadata-${Date.now()}.json`,
      content: Buffer.from(metadataString),
    });
    
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS metadata upload error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get IPFS gateway URL
 */
export function getIpfsUrl(cid: string): string {
  const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  return `${gateway}${cid}`;
}





