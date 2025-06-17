import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Users, Globe, AlertTriangle } from 'lucide-react';

const SINDAAssistant = () => {
  const [currentStep, setCurrentStep] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef(null);

  const languages = {
    english: { name: 'English', greeting: 'Hello! Welcome to SINDA. I\'m here to listen and support you. What would you like to talk about?' },
    tamil: { name: 'தமிழ்', greeting: 'வணக்கம்! SINDA க்கு வரவேற்கிறோம். நான் உங்களைக் கேட்க மற்றும் ஆதரிக்க இங்கே இருக்கிறேன். நீங்கள் எதைப் பற்றி பேச விரும்புகிறீர்கள்?' },
    hindi: { name: 'हिंदी', greeting: 'नमस्ते! SINDA में आपका स्वागत है। मैं यहाँ आपकी बात सुनने और आपका साथ देने के लिए हूँ। आप किस बारे में बात करना चाहेंगे?' },
    telugu: { name: 'తెలుగు', greeting: 'నమస్కారం! SINDA కి స్వాగతం. నేను మీ మాట వినడానికి మరియు మీకు మద్దతు ఇవ్వడానికి ఇక్కడ ఉన్నాను. మీరు దేని గురించి మాట్లాడాలని అనుకుంటున్నారు?' },
    malayalam: { name: 'മലയാളം', greeting: 'നമസ്കാരം! SINDA യിലേക്ക് സ്വാഗതം. ഞാൻ നിങ്ങളെ കേൾക്കാനും പിന്തുണയ്ക്കാനും ഇവിടെയുണ്ട്. നിങ്ങൾ എന്തിനെക്കുറിച്ചാണ് സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നത്?' }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, isUser = false, isCrisis = false) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      isCrisis,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, message]);
  };

  const queryOpenAI = async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          messages: conversationContext,
          isFirstMessage: isFirstMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle crisis detection
      if (data.isCrisis) {
        setShowCrisisAlert(true);
        setTimeout(() => setShowCrisisAlert(false), 10000);
      }

      // Update conversation context
      setConversationContext(prev => [
        ...prev.slice(-8), // Keep last 8 messages for context
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.message }
      ]);

      return {
        message: data.message,
        isCrisis: data.isCrisis
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        message: "I'm experiencing some technical difficulties right now. Your feelings and experiences are valid, and you're not alone. If this is urgent, please don't hesitate to call 6298 8775 for immediate support.",
        isCrisis: false
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await queryOpenAI(userMessage);
      
      setTimeout(() => {
        addMessage(response.message, false, response.isCrisis);
        setIsLoading(false);
        
        // Mark that first message has been sent
        if (isFirstMessage) {
          setIsFirstMessage(false);
        }
      }, 1000);

    } catch (error) {
      setTimeout(() => {
        addMessage("I'm sorry, I'm having trouble connecting right now. Please try again, or if this is urgent, call 6298 8775 immediately.", false);
        setIsLoading(false);
      }, 1000);
    }
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
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SINDA Support Helper</h1>
              <p className="text-sm text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online • Ready to listen and help
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Globe size={16} className="mr-1" />
            {languages[selectedLanguage]?.name}
          </div>
        </div>
      </div>

      {/* Crisis Alert */}
      {showCrisisAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded-r-lg shadow-md">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-3" size={24} />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">
                Crisis support is available 24/7. Please call 6298 8775 if you need immediate help.
              </p>
            </div>
            <button 
              onClick={() => setShowCrisisAlert(false)}
              className="ml-3 text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4">
        {currentStep === 'language' && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose your language</h2>
              <p className="text-gray-600">We want you to feel comfortable expressing yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedLanguage(key);
                    addMessage(lang.greeting, false);
                    setCurrentStep('chat');
                  }}
                  className="group bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 hover:border-orange-400 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600">
                    {lang.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Start conversation
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">💙</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">SINDA Support Helper</h3>
                    <p className="text-orange-100 text-sm">Here to listen and support you</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-orange-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.isUser 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                      : msg.isCrisis
                        ? 'bg-red-50 text-red-800 border border-red-200' 
                        : 'bg-white text-gray-800 border border-gray-200'
                  } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    <p className={`text-xs mt-2 ${
                      msg.isUser 
                        ? 'text-blue-100' 
                        : msg.isCrisis
                          ? 'text-red-600'
                          : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">SINDA helper is listening...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    rows="2"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  <Send size={20} />
                </button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                <AlertTriangle size={14} className="mr-1 text-red-500" />
                <span>Need urgent help? Call SINDA: <strong className="text-red-600">6298 8775</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SINDAAssistant;
