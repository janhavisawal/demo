// pages/api/mistral.js
import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  // Check for API key
  if (!process.env.MISTRAL_API_KEY) {
    console.error('Missing MISTRAL_API_KEY environment variable');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Please contact our support team at 6298 8775 for assistance'
    });
  }

  // Validate request body
  if (!req.body) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Request body is required'
    });
  }

  try {
    const {
      model = 'mistral-small',
      messages = [],
      temperature = 0.7,
      max_tokens = 100
    } = req.body;

    // Validate required parameters
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required and cannot be empty'
      });
    }

    // Validate temperature range
    if (temperature < 0 || temperature > 1) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'Temperature must be between 0 and 1'
      });
    }

    // Validate max_tokens
    if (max_tokens < 1 || max_tokens > 4096) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'max_tokens must be between 1 and 4096'
      });
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({
          error: 'Invalid message format',
          message: 'Each message must have role and content properties'
        });
      }
      
      if (!['system', 'user', 'assistant'].includes(message.role)) {
        return res.status(400).json({
          error: 'Invalid message role',
          message: 'Message role must be system, user, or assistant'
        });
      }
    }

    console.log(`Making request to Mistral API with model: ${model}`);
    
    // Add system prompt for more varied responses
    const enhancedMessages = [...messages];
    
    // If no system message exists, add one to reduce repetitiveness
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    if (!hasSystemMessage) {
      enhancedMessages.unshift({
        role: 'system',
        content: `You are a SINDA (Singapore Indian Development Association) support helper. Be conversational, empathetic, and vary your responses naturally. Avoid repeating the same phrases like "I'm glad you reached out" or "Can you share with me" in every response. 

Key guidelines:
- Use different conversation starters and transitions
- Be warm but not overly formal
- Ask follow-up questions naturally based on context
- Provide specific help related to SINDA services when appropriate
- Keep responses concise and personalized
- Vary your language and approach in each interaction
- Show genuine interest without using repetitive phrases

Available SINDA services include: education support, family services, employment assistance, eldercare, childcare, financial assistance, and community programs. Contact 6298 8775 for immediate help.`
      });
    }
    
    // Increase temperature slightly for more variety while keeping it controlled
    const adjustedTemperature = Math.min(temperature + 0.1, 0.9);
    
    // Use the correct SDK method based on your reference
    const response = await client.chat.complete({
      model,
      messages: enhancedMessages,
      temperature: adjustedTemperature,
      maxTokens: max_tokens
    });

    // Validate response structure
    if (!response?.choices?.[0]?.message?.content) {
      console.error('Invalid response structure from Mistral API:', response);
      throw new Error('Invalid response structure from Mistral API');
    }

    return res.status(200).json({
      choices: [{
        message: {
          content: response.choices[0].message.content,
          role: response.choices[0].message.role || 'assistant'
        }
      }],
      model: response.model || model,
      usage: response.usage || null
    });

  } catch (error) {
    console.error('Mistral API Error:', {
      message: error.message,
      status: error.status || error.statusCode,
      code: error.code,
      timestamp: new Date().toISOString()
    });

    // Handle rate limiting
    if (error.status === 429 || error.statusCode === 429) {
      return res.status(200).json({
        choices: [{
          message: {
            content: "I'm currently experiencing high demand. Our community team is available at 6298 8775 for immediate assistance with SINDA programs and services.",
            role: 'assistant'
          }
        }]
      });
    }

    // Handle authentication errors
    if (error.status === 401 || error.statusCode === 401) {
      return res.status(500).json({
        error: 'Authentication failed',
        message: 'Please contact our support team at 6298 8775 for assistance'
      });
    }

    // Handle quota exceeded
    if (error.status === 402 || error.statusCode === 402) {
      return res.status(500).json({
        error: 'Service temporarily unavailable',
        message: 'Please contact our support team at 6298 8775 for assistance'
      });
    }

    // Handle invalid model
    if (error.status === 404 || error.statusCode === 404) {
      return res.status(400).json({
        error: 'Invalid model',
        message: 'The specified model is not available'
      });
    }

    // Handle timeout or network errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      return res.status(500).json({
        error: 'Request timeout',
        message: 'The request took too long to process. Please try again.'
      });
    }

    // Generic error handling
    return res.status(500).json({
      error: 'SINDA AI assistant temporarily unavailable',
      message: 'Please try again in a few moments or contact support at 6298 8775'
    });
  }
}
