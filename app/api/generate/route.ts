import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai';
import { generateProof, hashBuffer } from '@/lib/crypto';
import { uploadToIpfs, uploadMetadataToIpfs } from '@/lib/ipfs';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userAddress, type = 'image' } = await request.json();

    if (!prompt || !userAddress) {
      return NextResponse.json(
        { error: 'Prompt and user address are required' },
        { status: 400 }
      );
    }

    // Generate AI content
    let outputBuffer: Buffer;
    if (type === 'image') {
      outputBuffer = await generateImage(prompt);
    } else {
      return NextResponse.json(
        { error: 'Unsupported type' },
        { status: 400 }
      );
    }

    // Generate proof data
    const timestamp = Date.now();
    const proof = generateProof(prompt, outputBuffer, userAddress, timestamp);

    // Upload output to IPFS
    const outputCid = await uploadToIpfs(outputBuffer, `output-${timestamp}.png`);
    const outputHash = hashBuffer(outputBuffer);

    // Create metadata
    const metadata = {
      prompt,
      promptHash: proof.promptHash,
      outputHash: proof.outputHash,
      combinedHash: proof.combinedHash,
      creator: userAddress,
      timestamp,
      ipfsLink: outputCid,
      type,
    };

    // Upload metadata to IPFS
    const metadataCid = await uploadMetadataToIpfs(metadata);

    return NextResponse.json({
      success: true,
      proof: {
        ...proof,
        outputCid,
        metadataCid,
        outputBuffer: outputBuffer.toString('base64'),
      },
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}





