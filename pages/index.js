// pages/index.js - SINDA Chatbot with Fixed Styling
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
    { text: '🚨 Urgent Help', type: 'crisis' },
    { text: '💰 Financial Support', type: 'financial' },
    { text: '👨‍👩‍👧‍👦 Family Matters', type: 'family' },
    { text: '📚 Education Help', type: 'education' },
    { text: '💼 Employment', type: 'employment' },
    { text: '💬 General Support', type: 'general' }
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

      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        
        {/* SINDA Official Header */}
        <header className="sinda-gradient" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '16px', 
                  padding: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#fbbf24', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <span style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '18px' }}>S</span>
                  </div>
                </div>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0' }}>
                    SINDA Community Support
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: '4px 0 0 0' }}>
                    💜 Here to help you through life's challenges
                  </p>
                </div>
              </div>
              
              <a 
                href="tel:62988775"
                style={{ 
                  background: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                onMouseOut={(e) => e.target.style.background = '#dc2626'}
              >
                🚨 Crisis Helpline: 6298 8775
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div className="sinda-card" style={{ overflow: 'hidden', border: '4px solid #3b82f6' }}>
              
              {/* Hero Section */}
              <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                padding: '60px 40px', 
                textAlign: 'center',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'rgba(255,255,255,0.1)'
                }}></div>
                <div style={{ position: 'relative', zIndex: '1' }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: '#1e40af', 
                    borderRadius: '50%', 
                    margin: '0 auto 30px auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    fontSize: '60px'
                  }}>
                    💙
                  </div>
                  
                  <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
                    We're Here for You
                  </h2>
                  <p style={{ fontSize: '20px', opacity: '0.9', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
                  </p>
                </div>
              </div>

              {/* Services Overview */}
              <div style={{ padding: '60px 40px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '30px', 
                  marginBottom: '50px' 
                }}>
                  {[
                    { icon: '🎓', title: 'Educational Support', desc: 'Tuition assistance, scholarships, academic guidance for students of all ages', color: '#10b981' },
                    { icon: '👨‍👩‍👧‍👦', title: 'Family Services', desc: 'Counseling, parenting support, family crisis intervention and mediation', color: '#3b82f6' },
                    { icon: '💰', title: 'Financial Assistance', desc: 'Emergency aid, budget counseling, assistance with basic necessities', color: '#f59e0b' },
                    { icon: '👥', title: 'Community Programs', desc: 'Social activities, cultural events, youth and elderly care programs', color: '#8b5cf6' }
                  ].map((service, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        background: '#f9fafb', 
                        borderRadius: '16px', 
                        padding: '30px', 
                        borderLeft: `6px solid ${service.color}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-4px)';
                        e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ fontSize: '36px' }}>{service.icon}</div>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                            {service.title}
                          </h3>
                          <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '14px' }}>
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleWelcomeStart}
                    className="sinda-button"
                    style={{ 
                      fontSize: '20px', 
                      padding: '16px 48px', 
                      borderRadius: '50px',
                      boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    💬 Start Conversation
                  </button>
                  <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '14px' }}>
                    Free • Confidential • Available in multiple languages
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div className="sinda-card" style={{ padding: '60px 40px', border: '4px solid #3b82f6' }}>
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  borderRadius: '50%', 
                  margin: '0 auto 30px auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  🌍
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  Choose Your Language
                </h2>
                <p style={{ fontSize: '18px', color: '#6b7280' }}>
                  We want you to feel comfortable expressing yourself
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '24px' 
              }}>
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    className="language-card"
                    style={{ padding: '32px 24px' }}
                  >
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                      {lang.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                      {key === 'english' && 'I need someone to talk to'}
                      {key === 'tamil' && 'எனக்கு யாராவது பேச வேண்டும்'}
                      {key === 'hindi' && 'मुझे किसी से बात करनी है'}
                      {key === 'telugu' && 'నేను ఎవరితోనైనా మాట్లాడాలి'}
                      {key === 'malayalam' && 'എനിക്ക് ആരെങ്കിലുമായി സംസാരിക്കണം'}
                    </div>
                    <div className="sinda-button" style={{ 
                      padding: '8px 16px', 
                      borderRadius: '50px', 
                      fontSize: '12px', 
                      background: '#ea580c',
                      color: 'white',
                      border: 'none'
                    }}>
                      Select Language
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {currentStep === 'chat' && (
            <div className="sinda-card" style={{ overflow: 'hidden', border: '4px solid #3b82f6' }}>
              
              {/* Chat Header */}
              <div className="sinda-gradient" style={{ padding: '24px', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '24px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        💙
                      </div>
                      <div style={{ 
                        position: 'absolute', 
                        top: '-2px', 
                        right: '-2px', 
                        width: '20px', 
                        height: '20px', 
                        background: '#10b981', 
                        borderRadius: '50%',
                        border: '2px solid white'
                      }}></div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                        SINDA Support Helper
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
                        Online • Ready to listen and help
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px', 
                      borderRadius: '16px', 
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    📞 Request Call Back
                  </button>
                </div>
              </div>

              {/* Quick Help Buttons */}
              {messages.length === 0 && (
                <div style={{ padding: '24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ textAlign: 'center', color: '#374151', fontWeight: '600', marginBottom: '20px' }}>
                    What type of support do you need today?
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px' 
                  }}>
                    {quickHelp.map((help, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickHelp(help)}
                        className="sinda-button"
                        style={{ 
                          padding: '16px', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          background: help.type === 'crisis' ? '#dc2626' : '#ea580c'
                        }}
                      >
                        {help.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div style={{ 
                height: '400px', 
                overflowY: 'auto', 
                padding: '24px', 
                background: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{ 
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ 
                      maxWidth: '70%',
                      padding: '16px 20px', 
                      borderRadius: '20px',
                      ...(message.isUser ? {
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        borderBottomRightRadius: '6px'
                      } : {
                        background: 'white',
                        color: '#111827',
                        borderBottomLeftRadius: '6px',
                        border: '
