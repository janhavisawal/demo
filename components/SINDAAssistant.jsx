import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Globe, Phone, Mail, MapPin, User, Heart, GraduationCap, Users, Briefcase, Home } from 'lucide-react';

const SINDAAssistant = () => {
  const [currentStep, setCurrentStep] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const messagesEndRef = useRef(null);

  // Lead Data Collection
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    interests: [],
    serviceNeeds: [],
    preferredLanguage: 'english'
  });

  const languages = {
    english: { name: 'English', greeting: 'Vanakkam! Welcome to SINDA.' },
    tamil: { name: 'தமிழ்', greeting: 'வணக்கம்! SINDA க்கு வரவேற்கிறோம்.' },
    hindi: { name: 'हिंदी', greeting: 'नमस्ते! SINDA में आपका स्वागत है।' },
    telugu: { name: 'తెలుగు', greeting: 'నమస్కారం! SINDA కి స్వాగతం.' },
    malayalam: { name: 'മലയാളം', greeting: 'നമസ്കാരം! SINDA യിലേക്ക് സ്വാഗതം.' }
  };

  const services = [
    { id: 'education', name: 'Educational Support', icon: GraduationCap, description: 'Tuition assistance and learning programs' },
    { id: 'community', name: 'Community Welfare', icon: Users, description: 'Community support and social programs' },
    { id: 'cultural', name: 'Cultural Programs', icon: Heart, description: 'Heritage preservation and celebrations' },
    { id: 'professional', name: 'Professional Development', icon: Briefcase, description: 'Skills training and career guidance' },
    { id: 'family', name: 'Family Support', icon: Home, description: 'Counseling and family assistance' }
  ];

  const locations = [
    'Central Singapore', 'North Singapore', 'South Singapore', 
    'East Singapore', 'West Singapore', 'Jurong', 'Tampines', 
    'Woodlands', 'Ang Mo Kio', 'Clementi', 'Other'
  ];

  // Mistral AI Integration
  const queryMistralAI = async (userMessage) => {
    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for SINDA (Singapore Indian Development Association). You have collected the following information:
              - Name: ${leadData.name}
              - Email: ${leadData.email}
              - Phone: ${leadData.phone}
              - Interests: ${leadData.interests.join(', ')}
              - Service Needs: ${leadData.serviceNeeds.join(', ')}
              - Location: ${leadData.location}
              
              SINDA provides:
              - Educational support and tuition assistance
              - Community welfare programs
              - Cultural heritage programs
              - Professional development and skills training
              - Family counseling and support services
              - Youth development programs
              - Senior citizen care
              - Financial assistance schemes
              
              Provide helpful, culturally sensitive responses about SINDA's programs and services. Keep responses warm and community-focused. Limit responses to 2-3 sentences.`
            },
            ...conversationContext.slice(-5),
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'd be happy to connect you with our community team for more detailed assistance.";
      
      setConversationContext(prev => [
        ...prev.slice(-4),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);

      return aiResponse;
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return "I'm experiencing some technical difficulties. Our community team will be able to provide you with detailed information when they contact you.";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, isUser = false, isSystem = false) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      isSystem,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, message]);
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setLeadData(prev => ({ ...prev, preferredLanguage: langKey }));
    addMessage(languages[langKey].greeting, false, true);
    addMessage("I'm here to help you learn about our community programs, educational support, and services. How can I assist you today?", false, true);
    setCurrentStep('chat');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await queryMistralAI(userMessage);
      setTimeout(() => {
        addMessage(aiResponse, false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        addMessage("I apologize for the technical difficulty. Our community team is available at 6298 8775 for immediate assistance.", false);
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
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} />
          {messages.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SINDA Community Assistant</h1>
                <p className="text-sm text-gray-600">Here to help with programs, services & community support</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Globe size={16} className="inline mr-1" />
                {languages[selectedLanguage]?.name || 'English'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {currentStep === 'language' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Globe className="text-orange-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SINDA</h2>
              <p className="text-gray-600">Singapore Indian Development Association</p>
              <p className="text-sm text-gray-500 mt-2">Please select your preferred language to continue</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => handleLanguageSelect(key)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-center group"
                >
                  <div className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">
                    {lang.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {key === 'english' && 'Select Language'}
                    {key === 'tamil' && 'மொழியைத் தேர்ந்தெடுக்கவும்'}
                    {key === 'hindi' && 'भाषा चुनें'}
                    {key === 'telugu' && 'భాషను ఎంచుకోండి'}
                    {key === 'malayalam' && 'ഭാഷ തിരഞ്ഞെടുക്കുക'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">SINDA Community Assistant</h3>
                    <p className="text-sm opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            {/* Services Quick Access */}
            <div className="bg-orange-50 p-4 border-b">
              <div className="flex flex-wrap gap-2">
                {services.slice(0, 3).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      const message = `Tell me more about ${service.name}`;
                      setInputMessage(message);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="flex items-center space-x-2 bg-white hover:bg-orange-100 px-3 py-2 rounded-full text-sm border border-orange-200 transition-colors"
                  >
                    <service.icon size={16} className="text-orange-600" />
                    <span>{service.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? 'bg-orange-600 text-white rounded-br-sm'
                        : message.isSystem
                        ? 'bg-blue-100 text-blue-800 rounded-bl-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">SINDA Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="text-orange-600" size={20} />
              <div>
                <p className="font-medium">Hotline</p>
                <p className="text-sm text-gray-600">6298 8775</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-orange-600" size={20} />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">info@sinda.org.sg</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-orange-600" size={20} />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-600">1 Beatty Road, Singapore 209943</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SINDAAssistant;
