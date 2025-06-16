// pages/api/mistral.js
import { MistralClient } from '@mistralai/mistralai';

const client = new MistralClient({ apiKey: process.env.MISTRAL_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.MISTRAL_API_KEY) {
    console.error('Missing MISTRAL_API_KEY');
    return res.status(500).json({
      error: 'API key missing',
      message: 'Please contact our support team at 6298 8775 for assistance'
    });
  }

  try {
    const {
      model = 'mistral-small',
      messages = [],
      temperature = 0.7,
      max_tokens = 100
    } = req.body;

    const response = await client.chat({
      model,
      messages,
      temperature,
      maxTokens: max_tokens
    });

    res.status(200).json({
      choices: [{
        message: {
          content: response.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error('Mistral API Error:', error);

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
      message: error.message
    });
  }
}
