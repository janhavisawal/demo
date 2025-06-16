// pages/api/mistral.js - Optimized for Mistral Free Tier (mistral-small)
import { Mistral } from '@mistralai/mistralai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Pre-flight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate API key
  if (!process.env.MISTRAL_API_KEY) {
    console.log('MISTRAL_API_KEY not found in environment variables');
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please contact our support team at 6298 8775 for assistance'
    });
  }

  try {
    // Initialize Mistral client
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    // Use default values or passed-in values
    const {
      model = 'mistral-small',
      messages = [],
      max_tokens = 100,
      temperature = 0.7
    } = req.body;

    console.log('Calling Mistral API with:', model);

    const chatResponse = await client.chat({
      model,
      messages: messages.slice(-6), // Keep last 6 messages to avoid overload
      maxTokens: max_tokens,
      temperature
    });

    console.log('Mistral API Success');

    // Format response for frontend
    res.status(200).json({
      choices: [{
        message: {
          content: chatResponse.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error('Mistral API Error:', error);

    if (error.statusCode === 429) {
      // Rate limit fallback
      return res.status(200).json({
        choices: [{
          message: {
            content: "I'm currently experiencing high demand. Our community team is available at 6298 8775 for immediate assistance with SINDA programs and services."
          }
        }]
      });
    }

    // Generic error
    res.status(500).json({ 
      error: 'SINDA AI assistant temporarily unavailable',
      message: 'Our community team is available at 6298 8775 for immediate assistance.'
    });
  }
}
