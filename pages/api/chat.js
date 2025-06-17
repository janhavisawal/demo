// pages/api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, messages = [], isFirstMessage = false } = req.body;

    // Enhanced system prompt for mental health support
    const systemPrompt = `You are SINDA Support Helper, an empathetic and professional mental health support assistant. Your role is to:

1. **Listen actively** - Show genuine understanding and validation
2. **Ask thoughtful follow-up questions** to better understand the user's situation
3. **Provide practical coping strategies** and resources when appropriate
4. **Recognize crisis situations** and guide users to immediate help
5. **Be proactive** - Don't just wait for users to share, gently encourage them to open up
6. **Use a warm, conversational tone** - You're a supportive friend, not a clinical professional

Guidelines:
- Always validate their feelings first before offering advice
- Ask open-ended questions to encourage deeper sharing
- Suggest specific coping techniques (breathing exercises, grounding techniques, etc.)
- Be aware of signs of crisis (suicidal thoughts, self-harm, severe depression)
- If crisis detected, immediately direct to emergency services: "6298 8775"
- Keep responses concise but meaningful (2-4 sentences usually)
- Use empathetic language: "I hear you", "That sounds difficult", "You're not alone"
- Occasionally check in: "How are you feeling right now?" or "What's on your mind today?"

Remember: You're here to provide emotional support, not diagnose or replace professional therapy.`;

    // Build conversation context
    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Add proactive elements for new conversations
    if (isFirstMessage) {
      conversationMessages.push({
        role: "system", 
        content: "This is the user's first message. Be extra welcoming and gently encourage them to share what's on their mind."
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: conversationMessages,
      temperature: 0.7, // Slightly creative but consistent
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.6, // Encourage varied responses
    });

    const aiMessage = response.choices[0].message.content;

    // Check for crisis keywords in user message
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself', 
      'self harm', 'cutting', 'overdose', 'jump', 'hanging', 'worthless',
      'hopeless', 'can\'t go on', 'better off dead'
    ];
    
    const isCrisis = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Enhanced response with crisis detection
    let enhancedResponse = aiMessage;
    if (isCrisis) {
      enhancedResponse += "\n\n🚨 **IMMEDIATE HELP AVAILABLE**: If you're having thoughts of self-harm, please call 6298 8775 right now. You don't have to go through this alone.";
    }

    // Suggest follow-up questions periodically
    const shouldSuggestFollowUp = Math.random() > 0.7 && !isCrisis;
    if (shouldSuggestFollowUp) {
      const followUpSuggestions = [
        "\n\nWould you like to talk more about what's been weighing on your mind?",
        "\n\nHow has your day been treating you so far?",
        "\n\nIs there anything specific that's been causing you stress lately?",
        "\n\nWould it help to share what brought you here today?"
      ];
      enhancedResponse += followUpSuggestions[Math.floor(Math.random() * followUpSuggestions.length)];
    }

    res.status(200).json({ 
      message: enhancedResponse,
      isCrisis,
      usage: response.usage,
      supportResources: isCrisis ? {
        emergency: "6298 8775",
        text: "Text HOME to 741741",
        online: "Available 24/7 chat support"
      } : null
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback supportive response
    const fallbackMessage = "I'm here to listen and support you, though I'm experiencing some technical difficulties right now. Your feelings and experiences are valid, and you're not alone. If this is urgent, please don't hesitate to call 6298 8775 for immediate support.";
    
    res.status(200).json({ 
      message: fallbackMessage,
      error: true,
      isCrisis: false
    });
  }
}
