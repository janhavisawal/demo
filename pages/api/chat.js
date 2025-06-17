// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Missing message' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are SINDA Assistant, a supportive and informative guide.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      message: assistantMessage || "Sorry, I couldn't understand that.",
      isCrisis: /suicide|depressed|help me|kill myself/i.test(message),
      suggestedPrograms: message.includes('tuition')
        ? ['Tuition Support Program']
        : message.includes('job')
        ? ['Career Guidance', 'Job Matching Program']
        : []
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
