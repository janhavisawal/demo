// pages/index.js - SINDA Community Support Chatbot with Tailwind CSS
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
  const [conversationStage, setConversationStage] = useState('greeting');
  const [userInfo, setUserInfo] = useState({
    name: '',
    situation: '',
    urgency: '',
    supportType: '',
    details: ''
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
      greeting: 'Hello! I\'m here to listen and help you with whatever you\'re going through. What\'s your name?'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'வணக்கம்! நீங்கள் எதை எதிர்கொண்டாலும் நான் கேட்டு உதவ இங்கே இருக்கிறேன். உங்கள் பெயர் என்ன?'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'नमस्ते! आप जो भी सामना कर रहे हैं, मैं सुनने और मदद करने के लिए यहाँ हूँ। आपका नाम क्या है?'
    },
    telugu: { 
      name: 'తెలుగు', 
      greeting: 'నమస్కారం! మీరు ఎదుర్కొంటున్న దేనికైనా నేను వినడానికి మరియు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీ పేరు ఏమిటి?'
    },
    malayalam: { 
      name: 'മലയാളം', 
      greeting: 'നമസ്കാരം! നിങ്ങൾ അഭിമുഖീകരിക്കുന്ന എന്തിനും ഞാൻ കേൾക്കാനും സഹായിക്കാനും ഇവിടെയുണ്ട്. നിങ്ങളുടെ പേര് എന്താണ്?'
    }
  };

  const supportAreas = [
    { id: 'education', name: 'Educational Support', emoji: '📚', description: 'Tuition assistance, study materials, academic guidance' },
    { id: 'financial', name: 'Financial Assistance', emoji: '💰', description: 'Emergency aid, grants, financial counseling' },
    { id: 'family', name: 'Family Support', emoji: '👨‍👩‍👧‍👦', description: 'Family counseling, parenting support, relationship guidance' },
    { id: 'employment', name: 'Employment Help', emoji: '💼', description: 'Job search assistance, skills training, career guidance' },
    { id: 'elderly', name: 'Elderly Care', emoji: '👴👵', description: 'Senior citizen support, healthcare, social activities' },
    { id: 'youth', name: 'Youth Programs', emoji: '🌟', description: 'Youth development, mentorship, leadership programs' },
    { id: 'crisis', name: 'Crisis Support', emoji: '🚨', description: 'Emergency assistance, crisis counseling, immediate help' },
    { id: 'legal', name: 'Legal Guidance', emoji: '⚖️', description: 'Legal advice, documentation help, rights awareness' }
  ];

  const quickHelp = [
    { text: 'I need urgent help', type: 'crisis', priority: 'high' },
    { text: 'Financial difficulties', type: 'financial', priority: 'high' },
    { text: 'Family problems', type: 'family', priority: 'medium' },
    { text: 'Educational support', type: 'education', priority: 'medium' },
    { text: 'Job-related help', type: 'employment', priority: 'medium' },
    { text: 'Just have questions', type: 'general', priority: 'low' }
  ];

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
              content: `You are a compassionate SINDA counselor helping ${userInfo.name || 'someone'} who needs community support.
              
              Conversation context:
              - User's name: ${userInfo.name}
              - Current situation: ${userInfo.situation}
              - Stage: ${conversationStage}
              
              SINDA provides:
              - Educational support and tuition assistance
              - Family counseling and relationship guidance  
              - Financial assistance and emergency aid
              - Employment help and skills training
              - Elderly care and youth programs
              - Crisis support and legal guidance
              
              Respond with empathy, keep it conversational (1-2 sentences), and focus on understanding their feelings. Ask gentle follow-up questions to learn more about their situation.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 120,
          temperature: 0.8
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
  }, [userInfo, conversationStage]);

  // Conversation flow logic
  const getConversationResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    let response = "";
    let nextStage = conversationStage;
    const updatedInfo = { ...userInfo };

    switch (conversationStage) {
      case 'greeting':
        if (message.length > 2) {
          updatedInfo.name = userMessage.split(' ')[0];
          nextStage = 'understanding';
          response = `Nice to meet you, ${updatedInfo.name}. I'm here to support you. Can you tell me a bit about what's been on your mind lately?`;
        } else {
          response = "I'd love to know what to call you. What's your name?";
        }
        break;

      case 'understanding':
        updatedInfo.situation = userMessage;
        
        if (message.includes('urgent') || message.includes('emergency') || message.includes('crisis') || message.includes('help now')) {
          nextStage = 'crisis';
          response = `${updatedInfo.name}, I can hear this is urgent. Are you in immediate danger or need emergency help right now?`;
        } else {
          nextStage = 'familyContext';
          response = `I can hear that this is important to you, ${updatedInfo.name}. How long has this been a concern for you?`;
        }
        break;

      case 'familyContext':
        nextStage = 'urgency';
        response = `Thank you for sharing that with me, ${updatedInfo.name}. Are you dealing with this alone, or do you have family support?`;
        break;

      case 'urgency':
        updatedInfo.urgency = userMessage;
        nextStage = 'specific_help';
        
        if (message.includes('urgent') || message.includes('immediate') || message.includes('now')) {
          response = `I understand this is urgent, ${updatedInfo.name}. Let me help you right away. For immediate assistance, you can call our 24/7 helpline at 6298 8775. Would you also like me to have someone call you back today?`;
        } else {
          response = `Based on what you've shared, ${updatedInfo.name}, I think I can help connect you with the right support. What kind of help would be most useful for you right now?`;
        }
        break;

      case 'specific_help':
        updatedInfo.supportType = userMessage;
        nextStage = 'next_steps';
        
        if (message.includes('education') || message.includes('school') || message.includes('study')) {
          response = `${updatedInfo.name}, I can definitely help with educational support. We have tuition assistance, study programs, and academic counseling. Would you like me to connect you with our education team?`;
        } else if (message.includes('money') || message.includes('financial') || message.includes('bill')) {
          response = `I understand financial stress can be overwhelming, ${updatedInfo.name}. We have emergency assistance and financial counseling available. Shall I arrange for our financial counselor to speak with you?`;
        } else if (message.includes('family') || message.includes('marriage') || message.includes('relationship')) {
          response = `Family challenges can be really difficult, ${updatedInfo.name}. We offer free family counseling and support. Would you like me to set up a consultation for you?`;
        } else if (message.includes('job') || message.includes('work') || message.includes('employment')) {
          response = `Employment challenges can be stressful, ${updatedInfo.name}. We have job search assistance, skills training, and career guidance available. Would you like me to connect you with our employment services team?`;
        } else {
          response = `I'm thinking about how to help you best, ${updatedInfo.name}. Would you like to know about the specific programs we have that might help?`;
        }
        break;

      case 'next_steps':
        response = `Thank you for sharing so much with me, ${updatedInfo.name}. Based on everything you've told me, I think our team can really help you. I'll arrange for one of our specialists to call you within 24 hours. In the meantime, remember you can always call 6298 8775 if you need immediate support. Is there anything else you'd like to know right now?`;
        nextStage = 'complete';
        // Auto-show contact form after response
        setTimeout(() => setShowContactForm(true), 3000);
        break;

      case 'crisis':
        if (message.includes('yes') || message.includes('danger')) {
          response = `${updatedInfo.name}, please call 6298 8775 right now or if it's a life-threatening emergency, call 995. Is there someone who can be with you? Don't hesitate to reach out immediately.`;
        } else {
          response = `I'm glad you're safe, ${updatedInfo.name}. Let's work together to get you the help you need. Can you tell me what specific support would help you most right now?`;
          nextStage = 'specific_help';
        }
        break;

      case 'complete':
        response = `I'm here if you need to talk more, ${updatedInfo.name}. You've taken a brave step by reaching out. Our team will be in touch soon. Is there anything else on your mind?`;
        break;

      default:
        response = "I'm here to listen and help. Can you tell me more about what's going on?";
    }

    setUserInfo(updatedInfo);
    setConversationStage(nextStage);
    return response;
  }, [conversationStage, userInfo]);

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
      // Try AI first, fallback to conversation flow
      const response = await queryMistralAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false, true);
        setIsTyping(false);
        
        // Add crisis support message if needed
        const message = userMessage.toLowerCase();
        if (message.includes('urgent') || message.includes('crisis') || message.includes('emergency')) {
          setTimeout(() => {
            addMessage("If this is an urgent situation, please don't hesitate to call our 24/7 helpline at 6298 8775 immediately. Our crisis counselors are trained to provide immediate support.", false, true);
          }, 2000);
        }
      }, Math.random() * 1000 + 1500); // 1.5-2.5 seconds realistic delay
      
    } catch (error) {
      setTimeout(() => {
        const fallbackResponse = getConversationResponse(userMessage);
        addMessage(fallbackResponse, false, true);
        setIsTyping(false);
      }, 1500);
    }
  }, [inputMessage, isTyping, addMessage, queryMistralAI, getConversationResponse]);

  const handleQuickHelp = useCallback((help) => {
    setInputMessage(help.text);
    setTimeout(() => handleSendMessage(), 100);
  }, [handleSendMessage]);

  const handleSupportAreaClick = useCallback((area) => {
    const message = `I need help with ${area.name.toLowerCase()}`;
    setInputMessage(message);
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
    addMessage(`Thank you, ${contactData.name}! I've noted your information. A SINDA counselor will contact you within 24 hours to provide personalized assistance. In the meantime, if you have any urgent needs, please call 6298 8775.`, false, true);
    
    // Reset contact form
    setContactData({ name: '', phone: '', preferredTime: '', description: '' });
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | We're Here to Help You</title>
        <meta name="description" content="SINDA provides caring community support for Indian families in Singapore. Get help with education, family, financial, and personal challenges." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-blue-200 opacity-20 animate-pulse"></div>
        <div className="absolute top-[60%] right-[10%] w-36 h-36 rounded-full bg-sky-200 opacity-15 animate-bounce"></div>

        {/* Header */}
        <header className="sinda-gradient shadow-lg relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm animate-pulse">
                  🤝
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-sm">
                    SINDA Community Support
                  </h1>
                  <p className="text-sm text-white opacity-90">
                    💙 Here to help you through life's challenges
                  </p>
                </div>
              </div>
              <a 
                href="tel:62988775"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse"
              >
                🚨 Crisis Helpline: 6298 8775
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-4 lg:p-8 relative z-5">
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div className="sinda-card p-8 lg:p-12 text-center relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-sky-50 opacity-50 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="sinda-gradient w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl animate-bounce">
                  💙
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4">
                  We're Here to Help
                </h2>
                
                <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                  {[
                    { icon: '🤗', title: 'Caring Support', desc: 'Empathetic assistance from trained counselors' },
                    { icon: '🏠', title: 'Community Focus', desc: 'Understanding your culture and values' },
                    { icon: '🌟', title: 'Real Solutions', desc: 'Practical help and resources available' }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-sky-100 p-6 rounded-xl border-2 border-sky-200 hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-3xl mb-3">{feature.icon}</div>
                      <h4 className="text-blue-700 font-bold mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleWelcomeStart}
                  className="sinda-button text-xl px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  💙 Get Support Now
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  ✓ Confidential • Free support • Available in multiple languages
                </p>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div className="sinda-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="sinda-gradient w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg animate-pulse">
                  🌏
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                  Choose Your Language
                </h2>
                <p className="text-lg text-gray-600">
                  We want you to feel comfortable expressing yourself
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    className="language-card group"
                  >
                    <div className="text-xl font-bold text-gray-800 group-hover:text-orange-600 mb-2 transition-colors">
                      {lang.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {key === 'english' && 'I need help'}
                      {key === 'tamil' && 'எனக்கு உதவி வேண்டும்'}
                      {key === 'hindi' && 'मुझे मदद चाहिए'}
                      {key === 'telugu' && 'నాకు సహాయం కావాలి'}
                      {key === 'malayalam' && 'എനിക്ക് സഹായം വേണം'}
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      💙 CARING SUPPORT
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {currentStep === 'chat' && (
            <div className="sinda-card overflow-hidden">
              
              {/* Chat Header */}
              <div className="sinda-gradient text-white p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-2xl text-xl backdrop-blur-sm">
                      💙
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        SINDA Support Helper
                      </h3>
                      <p className="text-sm opacity-90">
                        🟢 Here to listen and help • Confidential support
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-105 backdrop-blur-sm"
                  >
                    📞 Request Call Back
                  </button>
                </div>
              </div>

              {/* Support Areas */}
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 border-b-2 border-sky-100">
                <h4 className="text-blue-700 font-bold text-center mb-5">
                  💙 What kind of support do you need today?
                </h4>
                
                {/* Quick Help Options */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {quickHelp.map((help, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickHelp(help)}
                      className={`p-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 hover:shadow-lg ${
                        help.priority === 'high' 
                          ? 'bg-red-50 border-2 border-red-300 text-red-600 hover:bg-red-100 animate-pulse' 
                          : 'bg-white border-2 border-sky-200 text-blue-600 hover:bg-sky-50'
                      }`}
                    >
                      {help.priority === 'high' && '🚨 '}
                      {help.text}
                    </button>
                  ))}
                </div>

                {/* Support Areas Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {supportAreas.slice(0, 4).map((area) => (
                    <div
                      key={area.id}
                      onClick={() => handleSupportAreaClick(area)}
                      className="bg-white border-2 border-sky-100 hover:border-blue-400 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 text-center"
                    >
                      <div className="text-2xl mb-2">{area.emoji}</div>
                      <div className="text-xs font-bold text-gray-800 mb-1">
                        {area.name}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {area.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-br-sm shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-bl-sm shadow-lg'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border-2 border-gray-200 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.16}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          Support helper is listening...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t-2 border-gray-200 bg-white p-6">
                <div className="flex gap-4 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind... we're here to listen"
                    disabled={isTyping}
                    className="flex-1 border-2 border-gray-300 focus:border-blue-500 rounded-full px-6 py-3 text-sm outline-none transition-all disabled:opacity-70"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="sinda-button w-12 h-12 rounded-full flex items-center justify-center text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-110"
                  >
                    💙
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  💡 Need urgent help? Call our 24/7 crisis line: <strong className="text-red-600">6298 8775</strong>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="sinda-card p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
              💙 SINDA is Here When You Need Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 text-center hover:shadow-lg transition-all">
                <span className="text-3xl block mb-3">🚨</span>
                <h4 className="font-bold text-red-600 mb-2">Crisis Helpline (24/7)</h4>
                <p className="text-lg font-bold text-red-600 mb-1">6298 8775</p>
                <p className="text-sm text-red-800">Immediate support available</p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center hover:shadow-lg transition-all">
                <span className="text-3xl block mb-3">📧</span>
                <h4 className="font-bold text-blue-600 mb-2">Email Support</h4>
                <p className="text-sm font-bold text-blue-600 mb-1">info@sinda.org.sg</p>
                <p className="text-sm text-blue-800">Response within 24 hours</p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center hover:shadow-lg transition-all">
                <span className="text-3xl block mb-3">🏢</span>
                <h4 className="font-bold text-blue-600 mb-2">Visit Our Center</h4>
                <p className="text-sm font-bold text-blue-600 mb-1">1 Beatty Road, Singapore 209943</p>
                <p className="text-sm text-blue-800">Walk-ins welcome • Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-2xl mt-6 text-center border-2 border-sky-200">
              <p className="font-bold text-blue-800 mb-3">
                💙 Remember: You're not alone in this journey
              </p>
              <p className="text-sm text-blue-700 mb-3 leading-relaxed">
                SINDA has been supporting families like yours since 1991. Whatever challenges you're facing, our caring team is here to help you find solutions and move forward with confidence.
              </p>
              <a 
                href="https://sinda.org.sg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-bold text-sm hover:underline transition-all"
              >
                🌐 Learn more about SINDA
              </a>
            </div>
          </div>
        </main>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border-3 border-blue-500 shadow-2xl animate-scaleIn">
              <div className="text-center mb-6">
                <div className="sinda-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl animate-pulse">
                  📞
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Request Support Call
                </h3>
                <p className="text-sm text-gray-600">
                  Our counselors will reach out to provide personalized assistance
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Best time to call
                  </label>
                  <select
                    value={contactData.preferredTime}
                    onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all"
                  >
                    <option value="">Select preferred time</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Brief description of how we can help (optional)
                  </label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Feel free to share what kind of support you're looking for..."
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 rounded-xl text-sm outline-none resize-vertical transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl bg-white text-gray-600 text-sm font-bold transition-all hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!contactData.name || !contactData.phone}
                    className="flex-2 px-6 py-3 sinda-button rounded-xl text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 transition-all"
                  >
                    💙 Request Call Back
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-3 leading-relaxed">
                  ✓ Confidential support • Response within 24 hours • No cost for consultation
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }

          /* Mobile responsiveness improvements */
          @media (max-width: 640px) {
            .grid-cols-2 {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  );
}
