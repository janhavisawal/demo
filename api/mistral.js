// api/mistral.js - Fixed for Mistral Free Tier
import { Mistral } from '@mistralai/mistralai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key exists
  if (!process.env.MISTRAL_API_KEY) {
    console.log('MISTRAL_API_KEY not found in environment variables');
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please contact our support team at 6298 8775 for assistance'
    });
  }

  try {
    // Initialize Mistral client
    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY
    });

    console.log('Calling Mistral API with free tier model...');

    // Use the FREE tier model instead of mistral-large-latest
    const chatResponse = await client.chat.complete({
      model: 'mistral-7b-instruct-v0.1', // FREE model
      messages: req.body.messages,
      maxTokens: req.body.max_tokens || 100, // Reduced for free tier
      temperature: req.body.temperature || 0.7
    });

    console.log('Mistral API Success');

    // Return the response in the expected format
    res.status(200).json({
      choices: [{
        message: {
          content: chatResponse.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error('Mistral API Error:', error);
    
    // Handle specific rate limit error
    if (error.statusCode === 429) {
      return res.status(200).json({
        choices: [{
          message: {
            content: "I'm currently experiencing high demand. Our community team is available at 6298 8775 for immediate assistance with SINDA programs and services."
          }
        }]
      });
    }
    
    res.status(500).json({ 
      error: 'SINDA AI assistant temporarily unavailable',
      message: 'Our community team is available at 6298 8775 for immediate assistance.'
    });
  }
}
