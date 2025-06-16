import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Users, Globe } from 'lucide-react';

const SINDAAssistant = () => {
  const [currentStep, setCurrentStep] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const messagesEndRef = useRef(null);

  const languages = {
    english: { name: 'English', greeting: 'Hello! Welcome to SINDA.' },
    tamil: { name: 'தமிழ்', greeting: 'வணக்கம்! SINDA க்கு வரவேற்கிறோம்.' },
    hindi: { name: 'हिंदी', greeting: 'नमस्ते! SINDA में आपका स्वागत है।' },
    telugu: { name: 'తెలుగు', greeting: 'నమస్కారం! SINDA కి స్వాగతం.' },
    malayalam: { name: 'മലയാളം', greeting: 'നമസ്കാരം! SINDA യിലേക്ക് സ്വാഗതം.' }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, isUser = false) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, message]);
  };

  const queryMistral = async (userMessage) => {
    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral-tiny',
          messages: [
            {
              role: 'system',
              content: `You are SINDA's assistant. Respond warmly in 2–3 lines. Help users with education, finance, family, and crisis support.`
            },
            ...conversationContext.slice(-4),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 120,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const aiReply = data.choices[0]?.message?.content || "I'm here to help! You can also call 6298 8775.";

      setConversationContext(prev => [
        ...prev.slice(-4),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiReply }
      ]);

      return aiReply;
    } catch (err) {
      console.error('Mistral error:', err);
      return "I'm facing a technical issue. Please call 6298 8775 for immediate help.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    const response = await queryMistral(userMessage);
    setTimeout(() => {
      addMessage(response, false);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">SINDA Assistant</h1>
              <p className="text-sm text-gray-600">Helping you with SINDA services</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <Globe size={16} className="inline mr-1" />
            {languages[selectedLanguage]?.name}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {currentStep === 'language' && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Choose your language</h2>
            <p className="text-sm text-gray-600 mb-4">We'll start in the language you prefer</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedLanguage(key);
                    addMessage(lang.greeting, false);
                    setCurrentStep('chat');
                  }}
                  className="language-card"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.isUser ? 'bg-orange-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 text-right opacity-60">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              Need help? Call SINDA at <strong>6298 8775</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SINDAAssistant;
