import OpenAI from 'openai';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Initialize Gemini for text generation
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate image using DALL-E
 */
export async function generateImage(prompt: string): Promise<Buffer> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned');
    }

    // Download image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(imageResponse.data);
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Generate text using GPT or Gemini (if GEMINI_API_KEY is set)
 */
export async function generateText(prompt: string): Promise<string> {
  // Use Gemini if API key is available, otherwise fall back to GPT
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini text generation error:', error);
      // Fall back to GPT if Gemini fails
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('Failed to generate text with Gemini');
      }
    }
  }

  // Fall back to GPT-4
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Text generation error:', error);
    throw new Error('Failed to generate text');
  }
}

/**
 * Alternative: Generate image using Stability AI
 */
export async function generateImageStability(prompt: string): Promise<Buffer> {
  try {
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    );

    const data = JSON.parse(Buffer.from(response.data).toString());
    const imageUrl = data.artifacts[0].base64;

    if (!imageUrl) {
      throw new Error('No image returned');
    }

    return Buffer.from(imageUrl, 'base64');
  } catch (error) {
    console.error('Stability AI generation error:', error);
    throw new Error('Failed to generate image with Stability AI');
  }
}




