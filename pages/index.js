// pages/index.js - SINDA Chatbot with Official Website Aesthetic
import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // User conversation state
  const [conversationStage, setConversationStage] = useState('name');
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    location: '',
    situation: '',
    urgency: '',
    supportType: ''
  });

  // Contact form data
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    description: ''
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: 'Hello! I\'m here to help and support you. To start, may I know your name?'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'வணக்கம்! நான் உங்களுக்கு உதவி மற்றும் ஆதரவு வழங்க இங்கே இருக்கிறேன். தொடங்க, உங்கள் பெயரைக் கூற முடியுமா?'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'नमस्ते! मैं आपकी मदद और सहायता के लिए यहाँ हूँ। शुरुआत के लिए, क्या मैं आपका नाम जान सकता हूँ?'
    },
    telugu: { 
      name: 'తెలుగు', 
      greeting: 'నమస్కారం! నేను మీకు సహాయం మరియు మద్దతు అందించడానికి ఇక్కడ ఉన్నాను. ప్రారంభించడానికి, మీ పేరు తెలుసుకోవచ్చా?'
    },
    malayalam: { 
      name: 'മലയാളം', 
      greeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളെ സഹായിക്കാനും പിന്തുണയ്ക്കാനും ഇവിടെയുണ്ട്. ആരംഭിക്കാൻ, നിങ്ങളുടെ പേര് അറിയാമോ?'
    }
  };

  const quickHelp = [
    { text: '🚨 Urgent Help', type: 'crisis', color: 'bg-red-500 hover:bg-red-600' },
    { text: '💰 Financial Support', type: 'financial', color: 'bg-orange-500 hover:bg-orange-600' },
    { text: '👨‍👩‍👧‍👦 Family Matters', type: 'family', color: 'bg-blue-500 hover:bg-blue-600' },
    { text: '📚 Education Help', type: 'education', color: 'bg-green-500 hover:bg-green-600' },
    { text: '💼 Employment', type: 'employment', color: 'bg-purple-500 hover:bg-purple-600' },
    { text: '💬 General Support', type: 'general', color: 'bg-gray-500 hover:bg-gray-600' }
  ];

  const supportServices = [
    {
      icon: '🎓',
      title: 'Educational Support',
      description: 'Tuition assistance, scholarships, academic guidance for students of all ages',
      color: 'border-l-green-500'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Services',
      description: 'Counseling, parenting support, family crisis intervention and mediation',
      color: 'border-l-blue-500'
    },
    {
      icon: '💰',
      title: 'Financial Assistance',
      description: 'Emergency aid, budget counseling, assistance with basic necessities',
      color: 'border-l-orange-500'
    },
    {
      icon: '👥',
      title: 'Community Programs',
      description: 'Social activities, cultural events, youth and elderly care programs',
      color: 'border-l-purple-500'
    }
  ];

  // Natural conversation flow (keeping the same logic from before)
  const getConversationResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase().trim();
    let response = "";
    let nextStage = conversationStage;
    const updatedInfo = { ...userInfo };

    switch (conversationStage) {
      case 'name':
        if (message.length > 1) {
          updatedInfo.name = userMessage.trim();
          nextStage = 'age';
          response = `Nice to meet you, ${updatedInfo.name}! How old are you?`;
        } else {
          response = "I'd love to know what to call you. What's your name?";
        }
        break;

      case 'age':
        updatedInfo.age = userMessage.trim();
        nextStage = 'location';
        response = `Thank you, ${updatedInfo.name}. Which area of Singapore are you from?`;
        break;

      case 'location':
        updatedInfo.location = userMessage.trim();
        nextStage = 'understanding';
        response = `I see you're from ${updatedInfo.location}. Now ${updatedInfo.name}, I'm here to listen. What's been troubling you lately?`;
        break;

      case 'understanding':
        updatedInfo.situation = userMessage;
        
        if (message.includes('urgent') || message.includes('emergency') || message.includes('crisis')) {
          nextStage = 'crisis';
          response = `${updatedInfo.name}, this sounds urgent. Are you safe right now? Do you need immediate help?`;
        } else if (message.includes('money') || message.includes('financial') || message.includes('bill')) {
          nextStage = 'financial_details';
          response = `I understand money worries can be really stressful, ${updatedInfo.name}. Can you tell me a bit more about your financial situation?`;
        } else if (message.includes('family') || message.includes('husband') || message.includes('wife')) {
          nextStage = 'family_details';
          response = `Family situations can be really challenging, ${updatedInfo.name}. Would you feel comfortable sharing more about what's happening?`;
        } else if (message.includes('job') || message.includes('work') || message.includes('unemployment')) {
          nextStage = 'employment_details';
          response = `Work-related stress can be overwhelming, ${updatedInfo.name}. Are you currently employed, or are you looking for work?`;
        } else if (message.includes('school') || message.includes('education') || message.includes('study')) {
          nextStage = 'education_details';
          response = `Education is so important, ${updatedInfo.name}. Is this about your own studies, or your children's education?`;
        } else {
          nextStage = 'general_support';
          response = `Thank you for sharing that with me, ${updatedInfo.name}. It takes courage to reach out. How long has this been bothering you?`;
        }
        break;

      case 'financial_details':
        nextStage = 'support_offer';
        response = `I hear you, ${updatedInfo.name}. SINDA has emergency financial assistance and budgeting support. Would you like me to connect you with our financial counselor?`;
        break;

      case 'family_details':
        nextStage = 'support_offer';
        response = `${updatedInfo.name}, we have professional family counselors who understand our community. Would you be interested in speaking with one of them?`;
        break;

      case 'employment_details':
        nextStage = 'support_offer';
        response = `${updatedInfo.name}, we have employment coaches and skills training programs. Would you like to know more about these?`;
        break;

      case 'education_details':
        nextStage = 'support_offer';
        response = `Education opens so many doors, ${updatedInfo.name}. We offer tuition assistance and academic guidance. Would you like me to have our education coordinator contact you?`;
        break;

      case 'support_offer':
        nextStage = 'contact_details';
        response = `I'm glad you're open to getting help, ${updatedInfo.name}. Would you like me to have someone from our team call you within the next day or two?`;
        setTimeout(() => setShowContactForm(true), 2000);
        break;

      case 'crisis':
        if (message.includes('yes') || message.includes('safe')) {
          response = `I'm glad you're safe, ${updatedInfo.name}. Let's get you the right help. What would be most helpful right now?`;
          nextStage = 'crisis_support';
        } else {
          response = `${updatedInfo.name}, please call our emergency line at 6298 8775 right now. Your safety is the most important thing.`;
        }
        break;

      default:
        response = "I'm here to listen and help. What would you like to talk about?";
    }

    setUserInfo(updatedInfo);
    setConversationStage(nextStage);
    return response;
  }, [conversationStage, userInfo]);

  // Enhanced Mistral AI Integration (keeping same logic)
  const queryMistralAI = useCallback(async (userMessage) => {
    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a caring SINDA counselor talking to ${userInfo.name || 'someone'} (age: ${userInfo.age}, from: ${userInfo.location}).
              
              Current conversation stage: ${conversationStage}
              
              Guidelines:
              - Be warm, empathetic, and conversational
              - Ask ONE follow-up question max
              - Keep responses to 1-2 sentences
              - Use their name when appropriate
              - Focus on understanding their feelings
              - Avoid generic responses
              
              SINDA services: education support, family counseling, financial assistance, employment help, elderly care, youth programs, crisis support.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 100,
          temperature: 0.9
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getConversationResponse(userMessage);
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return getConversationResponse(userMessage);
    }
  }, [userInfo, conversationStage, getConversationResponse]);

  // Message handling functions (keeping same logic)
  const addMessage = useCallback((content, isUser = false, isHelper = false) => {
    const newMessage = {
      id: messageId,
      content,
      isUser,
      isHelper,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = conversationStage === 'name' || conversationStage === 'age' || conversationStage === 'location'
        ? getConversationResponse(userMessage)
        : await queryMistralAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false, true);
        setIsTyping(false);
        
        if (userMessage.toLowerCase().includes('urgent') || userMessage.toLowerCase().includes('crisis')) {
          setTimeout(() => {
            addMessage("🚨 If this is an emergency, please call our 24/7 helpline at 6298 8775 immediately.", false, true);
          }, 1500);
        }
      }, Math.random() * 800 + 1200);
      
    } catch (error) {
      setTimeout(() => {
        const fallbackResponse = getConversationResponse(userMessage);
        addMessage(fallbackResponse, false, true);
        setIsTyping(false);
      }, 1200);
    }
  }, [inputMessage, isTyping, addMessage, queryMistralAI, getConversationResponse, conversationStage]);

  const handleQuickHelp = useCallback((help) => {
    setInputMessage(help.text);
    setTimeout(() => handleSendMessage(), 100);
  }, [handleSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleWelcomeStart = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setCurrentStep('chat');
    
    setTimeout(() => {
      addMessage(languages[langKey].greeting, false, true);
    }, 500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactData, userInfo);
    setShowContactForm(false);
    addMessage(`Thank you, ${contactData.name}! A SINDA counselor will contact you within 24 hours. Remember, you can always call 6298 8775 if you need immediate support.`, false, true);
    
    setContactData({ name: '', phone: '', preferredTime: '', description: '' });
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | Here to Help You Through Life's Challenges</title>
        <meta name="description" content="SINDA provides compassionate community support for Indian families in Singapore. Connect with our caring counselors today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        
        {/* SINDA Official Header */}
        <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-2xl p-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">S</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">SINDA Community Support</h1>
                  <p className="text-orange-100 text-sm">💜 Here to help you through life's challenges</p>
                </div>
              </div>
              
              <div className="flex items-center bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full transition-colors">
                <span className="text-white font-bold">🚨 Crisis Helpline: 6298 8775</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-500">
              
              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-16 text-center">
                <div className="absolute inset-0 bg-white bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">💙</span>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-white mb-6">We're Here for You</h2>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
                  </p>
                </div>
              </div>

              {/* Services Overview */}
              <div className="px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {supportServices.map((service, index) => (
                    <div key={index} className={`bg-gray-50 rounded-2xl p-6 border-l-4 ${service.color} hover:shadow-lg transition-shadow`}>
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{service.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <button
                    onClick={handleWelcomeStart}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    💬 Start Conversation
                  </button>
                  <p className="text-gray-500 mt-4">Free • Confidential • Available in multiple languages</p>
                </div>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div className="bg-white rounded-3xl shadow-xl p-12 border-4 border-blue-500">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white shadow-lg">
                  🌍
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Language</h2>
                <p className="text-xl text-gray-600">We want you to feel comfortable expressing yourself</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    className="p-8 rounded-2xl border-3 border-gray-200 hover:border-orange-400 hover:shadow-xl hover:bg-orange-50 transition-all duration-200 text-center group"
                  >
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 mb-3">
                      {lang.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {key === 'english' && 'I need someone to talk to'}
                      {key === 'tamil' && 'எனக்கு யாராவது பேச வேண்டும்'}
                      {key === 'hindi' && 'मुझे किसी से बात करनी है'}
                      {key === 'telugu' && 'నేను ఎవరితోనైనా మాట్లాడాలి'}
                      {key === 'malayalam' && 'എനിക്ക് ആരെങ്കിലുമായി സംസാരിക്കണം'}
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Select Language
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {currentStep === 'chat' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-500">
              
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                        💙
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">SINDA Support Helper</h3>
                      <p className="text-orange-100">Online • Ready to listen and help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-2xl font-bold backdrop-blur-sm transition-all"
                  >
                    📞 Request Call Back
                  </button>
                </div>
              </div>

              {/* Quick Help Buttons */}
              {messages.length === 0 && (
                <div className="p-6 bg-gray-50 border-b">
                  <p className="text-center text-gray-700 font-semibold mb-6">What type of support do you need today?</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickHelp.map((help, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickHelp(help)}
                        className={`${help.color} text-white p-4 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg`}
                      >
                        {help.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-sm lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                    }`}>
                      <p className="leading-relaxed text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 border border-gray-200 shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.16}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">SINDA helper is listening...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex space-x-4 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isTyping}
                    className="flex-1 border-2 border-gray-300 focus:border-orange-500 rounded-2xl px-6 py-4 text-lg outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white p-4 rounded-2xl transition-all disabled:cursor-not-allowed hover:scale-110 shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm">
                    🚨 Emergency? Call 6298 8775 immediately
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SINDA Contact Information */}
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border-4 border-orange-300">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">SINDA is Always Here for You</h3>
              <p className="text-xl text-gray-600">Multiple ways to get the support you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-200">
                <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg">
                  🚨
                </div>
                <h4 className="text-xl font-bold text-red-700 mb-3">24/7 Crisis Support</h4>
                <a href="tel:62988775" className="text-3xl font-bold text-red-600 hover:text-red-700 block mb-3">
                  6298 8775
                </a>
                <p className="text-red-600 font-medium">Always available • Immediate help</p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-200">
                <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg">
                  ✉️
                </div>
                <h4 className="text-xl font-bold text-blue-700 mb-3">Email Support</h4>
                <a href="mailto:info@sinda.org.sg" className="text-lg font-bold text-blue-600 hover:text-blue-700 block mb-3">
                  info@sinda.org.sg
                </a>
                <p className="text-blue-600 font-medium">Response within 24 hours</p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-200">
                <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg">
                  🏢
                </div>
                <h4 className="text-xl font-bold text-green-700 mb-3">Visit Our Center</h4>
                <p className="text-lg font-bold text-green-600 mb-3">1 Beatty Road</p>
                <p className="text-green-600 font-medium">Singapore 209943 • Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            
            {/* SINDA Heritage & Values */}
            <div className="mt-12 p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl border-4 border-orange-200">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xl">S</span>
                  </div>
                  <h4 className="text-2xl font-bold text-orange-800">Since 1991: Serving Our Community</h4>
                </div>
                <p className="text-orange-700 text-lg leading-relaxed max-w-4xl mx-auto">
                  SINDA has been the cornerstone of support for Indian families in Singapore for over three decades. 
                  We understand your culture, values, and the unique challenges you face. Our experienced counselors 
                  and social workers are here to provide compassionate, culturally-sensitive support when you need it most.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white">
                    🤝
                  </div>
                  <h5 className="font-bold text-orange-800 mb-1">Trusted Support</h5>
                  <p className="text-sm text-orange-600">30+ years serving families</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white">
                    🏠
                  </div>
                  <h5 className="font-bold text-orange-800 mb-1">Cultural Understanding</h5>
                  <p className="text-sm text-orange-600">Respects your values & traditions</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white">
                    🔒
                  </div>
                  <h5 className="font-bold text-orange-800 mb-1">Completely Confidential</h5>
                  <p className="text-sm text-orange-600">Your privacy is protected</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white">
                    💝
                  </div>
                  <h5 className="font-bold text-orange-800 mb-1">Free Services</h5>
                  <p className="text-sm text-orange-600">No cost for support & counseling</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <a 
                  href="https://sinda.org.sg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
                >
                  🌐 Learn More About SINDA
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-orange-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white shadow-lg">
                  📞
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Request Support Call</h3>
                <p className="text-gray-600 text-lg">Our caring counselors will reach out to you personally</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Your Name</label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-6 py-4 border-3 border-gray-300 focus:border-orange-500 rounded-2xl text-lg outline-none transition-all"
                    placeholder="What should we call you?"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Phone Number</label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-6 py-4 border-3 border-gray-300 focus:border-orange-500 rounded-2xl text-lg outline-none transition-all"
                    placeholder="+65 XXXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Best time to call</label>
                  <select
                    value={contactData.preferredTime}
                    onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-6 py-4 border-3 border-gray-300 focus:border-orange-500 rounded-2xl text-lg outline-none transition-all"
                  >
                    <option value="">When would you prefer we call?</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">How can we help? (optional)</label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    placeholder="Share anything you'd like us to know beforehand..."
                    className="w-full px-6 py-4 border-3 border-gray-300 focus:border-orange-500 rounded-2xl text-lg outline-none resize-vertical transition-all"
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-8 py-4 border-3 border-gray-300 hover:border-gray-400 rounded-2xl bg-white text-gray-600 font-bold text-lg transition-all hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!contactData.name || !contactData.phone}
                    className="flex-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg rounded-2xl transition-all disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    💙 Request Call Back
                  </button>
                </div>

                <div className="text-center pt-6">
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong>Your privacy matters:</strong> All conversations are confidential. 
                      Our counselors will respond within 24 hours. Free consultation with no obligations.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out;
          }

          /* Custom scrollbar for chat */
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: #f97316 #f3f4f6;
          }
          
          .overflow-y-auto::-webkit-scrollbar {
            width: 8px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 4px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: #f97316;
            border-radius: 4px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: #ea580c;
          }

          /* SINDA brand colors and effects */
          .border-3 {
            border-width: 3px;
          }
          
          .border-4 {
            border-width: 4px;
          }
        `}</style>
      </div>
    </>
  );
}
