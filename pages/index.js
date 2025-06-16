// pages/index.js - Beautiful SINDA Community Support Chatbot
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
    { text: '🚨 Urgent Help Needed', type: 'crisis', style: 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' },
    { text: '💰 Money Problems', type: 'financial', style: 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200' },
    { text: '👨‍👩‍👧‍👦 Family Issues', type: 'family', style: 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' },
    { text: '📚 Education Help', type: 'education', style: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' },
    { text: '💼 Job Support', type: 'employment', style: 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200' },
    { text: '💬 Just Need to Talk', type: 'general', style: 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' }
  ];

  // Natural conversation flow
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
        
        if (message.includes('urgent') || message.includes('emergency') || message.includes('crisis') || message.includes('help now')) {
          nextStage = 'crisis';
          response = `${updatedInfo.name}, this sounds urgent. Are you safe right now? Do you need immediate help?`;
        } else if (message.includes('money') || message.includes('financial') || message.includes('bill') || message.includes('debt')) {
          nextStage = 'financial_details';
          response = `I understand money worries can be really stressful, ${updatedInfo.name}. Can you tell me a bit more about your financial situation? Are you struggling with bills, or is it something else?`;
        } else if (message.includes('family') || message.includes('husband') || message.includes('wife') || message.includes('marriage') || message.includes('relationship')) {
          nextStage = 'family_details';
          response = `Family situations can be really challenging, ${updatedInfo.name}. Would you feel comfortable sharing more about what's happening at home?`;
        } else if (message.includes('job') || message.includes('work') || message.includes('unemployment') || message.includes('career')) {
          nextStage = 'employment_details';
          response = `Work-related stress can be overwhelming, ${updatedInfo.name}. Are you currently employed, or are you looking for work?`;
        } else if (message.includes('school') || message.includes('education') || message.includes('study') || message.includes('tuition')) {
          nextStage = 'education_details';
          response = `Education is so important, ${updatedInfo.name}. Is this about your own studies, or are you concerned about your children's education?`;
        } else {
          nextStage = 'general_support';
          response = `Thank you for sharing that with me, ${updatedInfo.name}. It takes courage to reach out. How long has this been bothering you?`;
        }
        break;

      case 'financial_details':
        nextStage = 'support_offer';
        response = `I hear you, ${updatedInfo.name}. Financial stress affects the whole family. SINDA has emergency financial assistance and budgeting support. Would you like me to connect you with our financial counselor?`;
        break;

      case 'family_details':
        nextStage = 'support_offer';
        response = `${updatedInfo.name}, family relationships are precious but can be complex. We have professional family counselors who understand our community. Would you be interested in speaking with one of them?`;
        break;

      case 'employment_details':
        nextStage = 'support_offer';
        response = `${updatedInfo.name}, finding good work or dealing with job stress is tough. We have employment coaches and skills training programs. Would you like to know more about these?`;
        break;

      case 'education_details':
        nextStage = 'support_offer';
        response = `Education opens so many doors, ${updatedInfo.name}. We offer tuition assistance, study materials, and academic guidance. Would you like me to have our education coordinator contact you?`;
        break;

      case 'general_support':
        nextStage = 'support_offer';
        response = `${updatedInfo.name}, sometimes we all need someone to talk to. That's completely normal. Would you like me to arrange for one of our counselors to give you a call?`;
        break;

      case 'support_offer':
        nextStage = 'contact_details';
        response = `I'm glad you're open to getting help, ${updatedInfo.name}. Would you like me to have someone from our team call you within the next day or two? It would be completely confidential.`;
        // Auto-show contact form after response
        setTimeout(() => setShowContactForm(true), 2000);
        break;

      case 'crisis':
        if (message.includes('yes') || message.includes('safe') || message.includes('okay')) {
          response = `I'm glad you're safe, ${updatedInfo.name}. Let's get you the right help. What would be most helpful right now - someone to talk to, or practical assistance?`;
          nextStage = 'crisis_support';
        } else {
          response = `${updatedInfo.name}, please call our emergency line at 6298 8775 right now. If it's life-threatening, call 995 immediately. Your safety is the most important thing.`;
        }
        break;

      case 'contact_details':
        response = `Thank you ${updatedInfo.name}. I've noted everything down. Our team will reach out to you soon with the right support. Remember, you're not alone in this.`;
        nextStage = 'complete';
        break;

      case 'complete':
        response = `I'm still here if you need to talk more, ${updatedInfo.name}. You've taken a really positive step today by reaching out.`;
        break;

      default:
        response = "I'm here to listen and help. What would you like to talk about?";
    }

    setUserInfo(updatedInfo);
    setConversationStage(nextStage);
    return response;
  }, [conversationStage, userInfo]);

  // Enhanced Mistral AI Integration
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

  // Message handling functions
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

  // Enhanced send message function with Mistral AI
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use AI for more natural responses after name collection
      const response = conversationStage === 'name' || conversationStage === 'age' || conversationStage === 'location'
        ? getConversationResponse(userMessage)
        : await queryMistralAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false, true);
        setIsTyping(false);
        
        // Add crisis support message if needed
        if (userMessage.toLowerCase().includes('urgent') || userMessage.toLowerCase().includes('crisis') || userMessage.toLowerCase().includes('emergency')) {
          setTimeout(() => {
            addMessage("🚨 If this is an emergency, please call our 24/7 helpline at 6298 8775 immediately.", false, true);
          }, 1500);
        }
      }, Math.random() * 800 + 1200); // 1.2-2 seconds realistic delay
      
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
    
    // Start conversation after a delay
    setTimeout(() => {
      addMessage(languages[langKey].greeting, false, true);
    }, 500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactData, userInfo);
    setShowContactForm(false);
    addMessage(`Thank you, ${contactData.name}! I've passed your details to our team. A SINDA counselor will contact you within 24 hours. Remember, you can always call 6298 8775 if you need immediate support.`, false, true);
    
    // Reset contact form
    setContactData({ name: '', phone: '', preferredTime: '', description: '' });
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | Caring Help When You Need It</title>
        <meta name="description" content="SINDA provides compassionate community support for Indian families in Singapore. Talk to someone who understands and cares." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 animate-spin-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-200 to-blue-200 opacity-20 animate-pulse"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white shadow-xl border-b-4 border-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                    🤝
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                    💚
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SINDA Support
                  </h1>
                  <p className="text-gray-600 font-medium">Caring community support when you need it most</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">24/7 Crisis Support</p>
                  <a href="tel:62988775" className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors">
                    6298 8775
                  </a>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl animate-pulse">
                  🆘
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-4xl mx-auto p-6">
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl backdrop-blur-sm">
                    💙
                  </div>
                  <h2 className="text-4xl font-bold mb-4">We're Here for You</h2>
                  <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    Life can be challenging. You don't have to face it alone. Our caring team understands and is ready to help.
                  </p>
                </div>
              </div>
              
              <div className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {[
                    { icon: '👂', title: 'Someone to Listen', desc: 'Compassionate counselors who understand your culture' },
                    { icon: '🛡️', title: 'Real Support', desc: 'Practical help with education, family, and finances' },
                    { icon: '🤲', title: 'No Judgment', desc: 'Safe, confidential space to share your concerns' }
                  ].map((feature, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleWelcomeStart}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    💬 Start Conversation
                  </button>
                  <p className="text-gray-500 text-sm mt-4">Free • Confidential • Available in your language</p>
                </div>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white">
                  🌍
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Choose Your Language</h2>
                <p className="text-gray-600">We want you to feel comfortable expressing yourself</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:bg-blue-50 transition-all duration-200 text-center group"
                  >
                    <div className="text-xl font-bold text-gray-800 group-hover:text-blue-600 mb-2">
                      {lang.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {key === 'english' && 'I need someone to talk to'}
                      {key === 'tamil' && 'எனக்கு யாராவது பேச வேண்டும்'}
                      {key === 'hindi' && 'मुझे किसी से बात करनी है'}
                      {key === 'telugu' && 'నేను ఎవరితోనైనా మాట్లాడాలి'}
                      {key === 'malayalam' && 'എനിക്ക് ആരെങ്കിലുമായി സംസാരിക്കണം'}
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold">
                      Select Language
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {currentStep === 'chat' && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                        💙
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">SINDA Support Helper</h3>
                      <p className="text-blue-100 text-sm">Online • Here to listen and help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm transition-all"
                  >
                    📞 Get Call Back
                  </button>
                </div>
              </div>

              {/* Quick Help Buttons */}
              {messages.length === 0 && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <p className="text-center text-gray-600 font-medium mb-4">Or choose what you need help with:</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickHelp.map((help, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickHelp(help)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-105 hover:shadow-md ${help.style}`}
                      >
                        {help.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                    }`}>
                      <p className="leading-relaxed">{message.content}</p>
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
                    <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 border border-gray-200 shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.16}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Listening...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex space-x-4 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isTyping}
                    className="flex-1 border-2 border-gray-300 focus:border-blue-500 rounded-2xl px-6 py-3 outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all disabled:cursor-not-allowed hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-4">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                    🚨 Emergency? Call 6298 8775 immediately
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Card */}
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                SINDA is Always Here for You
              </h3>
              <p className="text-gray-600">Multiple ways to get the support you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-white">
                  🆘
                </div>
                <h4 className="font-bold text-red-700 mb-2">24/7 Crisis Support</h4>
                <a href="tel:62988775" className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-2">
                  6298 8775
                </a>
                <p className="text-sm text-red-600">Always available • Immediate help</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-white">
                  ✉️
                </div>
                <h4 className="font-bold text-blue-700 mb-2">Email Support</h4>
                <a href="mailto:info@sinda.org.sg" className="font-bold text-blue-600 hover:text-blue-700 block mb-2">
                  info@sinda.org.sg
                </a>
                <p className="text-sm text-blue-600">Response within 24 hours</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-white">
                  🏢
                </div>
                <h4 className="font-bold text-green-700 mb-2">Visit Our Center</h4>
                <p className="font-bold text-green-600 mb-2">1 Beatty Road</p>
                <p className="text-sm text-green-600">Singapore 209943 • Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-2xl">💙</span>
                <h4 className="font-bold text-blue-800">Remember: You're Not Alone</h4>
                <span className="text-2xl">💙</span>
              </div>
              <p className="text-blue-700 leading-relaxed mb-4">
                SINDA has been supporting families in our community since 1991. Whatever you're going through, 
                we understand your culture, values, and challenges. Our caring team is here to listen and help you find solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white px-4 py-2 rounded-full text-blue-700 font-medium">✓ Completely Confidential</span>
                <span className="bg-white px-4 py-2 rounded-full text-blue-700 font-medium">✓ Culturally Sensitive</span>
                <span className="bg-white px-4 py-2 rounded-full text-blue-700 font-medium">✓ Free Support</span>
                <span className="bg-white px-4 py-2 rounded-full text-blue-700 font-medium">✓ Multiple Languages</span>
              </div>
            </div>
          </div>
        </main>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-scaleIn">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white">
                  📞
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Support Call</h3>
                <p className="text-gray-600">Our caring team will reach out to you personally</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl outline-none transition-all"
                    placeholder="What should we call you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl outline-none transition-all"
                    placeholder="+65 XXXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Best time to call</label>
                  <select
                    value={contactData.preferredTime}
                    onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl outline-none transition-all"
                  >
                    <option value="">When would you prefer we call?</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">How can we help? (optional)</label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Share anything you'd like us to know beforehand..."
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl outline-none resize-vertical transition-all"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl bg-white text-gray-600 font-bold transition-all hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!contactData.name || !contactData.phone}
                    className="flex-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    💙 Request Call Back
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    ✓ Confidential support • ✓ Response within 24 hours • ✓ Free consultation
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }

          /* Smooth scrolling for chat */
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </div>
    </>
  );
}
