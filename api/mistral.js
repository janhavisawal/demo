// api/mistral.js
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
    return res.status(500).json({ 
      error: 'MISTRAL_API_KEY not configured',
      message: 'Please contact our support team at 6298 8775 for assistance'
    });
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API Error:', response.status, errorText);
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'SINDA AI assistant temporarily unavailable',
      message: 'Our community team is available at 6298 8775 for immediate assistance with SINDA programs and services.'
    });
  }
}
