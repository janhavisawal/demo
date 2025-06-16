// pages/index.js - Complete SINDA Chatbot with Full Functionality
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
        <header style={{ 
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
        }}>
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
            <div style={{ 
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '4px solid #3b82f6',
              overflow: 'hidden'
            }}>
              
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
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
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
                    style={{ 
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      padding: '16px 48px',
                      borderRadius: '50px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#dc2626';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 24px rgba(234, 88, 12, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#ea580c';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.3)';
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
            <div style={{ 
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '4px solid #3b82f6',
              padding: '60px 40px'
            }}>
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
                    style={{ 
                      background: 'white',
                      border: '2px solid #fed7aa',
                      borderRadius: '12px',
                      padding: '32px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      margin: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = '#fff7ed';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#fed7aa';
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateY(0)';
                    }}
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
                    <div style={{ 
                      background: '#ea580c',
                      color: 'white',
                      padding: '8px 16px', 
                      borderRadius: '50px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
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
            <div style={{ 
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '4px solid #3b82f6',
              overflow: 'hidden'
            }}>
              
              {/* Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
                padding: '24px', 
                color: 'white' 
              }}>
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
                        style={{ 
                          background: help.type === 'crisis' ? '#dc2626' : '#ea580c',
                          color: 'white',
                          border: 'none',
                          padding: '16px', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = help.type === 'crisis' ? '#b91c1c' : '#dc2626';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = help.type === 'crisis' ? '#dc2626' : '#ea580c';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
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
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      })
                    }}>
                      <p style={{ margin: '0 0 8px 0', lineHeight: '1.5', fontSize: '14px' }}>
                        {message.content}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        margin: '0',
                        opacity: message.isUser ? '0.8' : '0.6'
                      }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ 
                      background: 'white',
                      borderRadius: '20px',
                      borderBottomLeftRadius: '6px',
                      padding: '16px 20px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              style={{ 
                                width: '8px', 
                                height: '8px', 
                                background: '#ea580c', 
                                borderRadius: '50%',
                                animation: `bounce 1.4s infinite ease-in-out`,
                                animationDelay: `${i * 0.16}s`
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          SINDA helper is listening...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '24px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isTyping}
                    style={{ 
                      flex: '1',
                      border: '2px solid #d1d5db',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      opacity: isTyping ? '0.5' : '1'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    style={{ 
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: (isTyping || !inputMessage.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (isTyping || !inputMessage.trim()) ? '0.5' : '1',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isTyping && inputMessage.trim()) {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isTyping && inputMessage.trim()) {
                        e.target.style.background = '#ea580c';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span style={{ 
                    background: '#fef2f2', 
                    color: '#dc2626', 
                    padding: '8px 16px', 
                    borderRadius: '50px', 
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid #fecaca'
                  }}>
                    🚨 Emergency? Call 6298 8775 immediately
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SINDA Contact Information */}
          <div style={{ 
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '4px solid #f59e0b',
            marginTop: '48px', 
            padding: '40px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                SINDA is Always Here for You
              </h3>
              <p style={{ fontSize: '18px', color: '#6b7280' }}>
                Multiple ways to get the support you need
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '32px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', 
                border: '4px solid #fca5a5',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#dc2626', 
                  borderRadius: '50%', 
                  margin: '0 auto 24px auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)'
                }}>
                  🚨
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b', marginBottom: '12px' }}>
                  24/7 Crisis Support
                </h4>
                <a 
                  href="tel:62988775" 
                  style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#dc2626', 
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '12px'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#991b1b'}
                  onMouseOut={(e) => e.target.style.color = '#dc2626'}
                >
                  6298 8775
                </a>
                <p style={{ color: '#dc2626', fontWeight: '600' }}>
                  Always available • Immediate help
                </p>
              </div>
              
              <div style={{ 
                textAlign: 'center', 
                padding: '32px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', 
                border: '4px solid #93c5fd',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#2563eb', 
                  borderRadius: '50%', 
                  margin: '0 auto 24px auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                }}>
                  ✉️
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '12px' }}>
                  Email Support
                </h4>
                <a 
                  href="mailto:info@sinda.org.sg" 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: '#2563eb', 
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '12px'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.color = '#2563eb'}
                >
                  info@sinda.org.sg
                </a>
                <p style={{ color: '#2563eb', fontWeight: '600' }}>
                  Response within 24 hours
                </p>
              </div>
              
              <div style={{ 
                textAlign: 'center', 
                padding: '32px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                border: '4px solid #86efac',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#16a34a', 
                  borderRadius: '50%', 
                  margin: '0 auto 24px auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)'
                }}>
                  🏢
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d', marginBottom: '12px' }}>
                  Visit Our Center
                </h4>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a', marginBottom: '12px' }}>
                  1 Beatty Road
                </p>
                <p style={{ color: '#16a34a', fontWeight: '600' }}>
                  Singapore 209943 • Mon-Fri 9AM-6PM
                </p>
              </div>
            </div>
            
            {/* SINDA Heritage & Values */}
            <div style={{ 
              marginTop: '48px', 
              padding: '32px', 
              background: 'linear-gradient(135deg, #fff7ed, #fed7aa)', 
              borderRadius: '24px', 
              border: '4px solid #fdba74' 
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#fbbf24', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <span style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '24px' }}>S</span>
                  </div>
                  <h4 style={{ fontSize: '28px', fontWeight: 'bold', color: '#c2410c', margin: '0' }}>
                    Since 1991: Serving Our Community
                  </h4>
                </div>
                <p style={{ color: '#ea580c', fontSize: '16px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
                  SINDA has been the cornerstone of support for Indian families in Singapore for over three decades. 
                  We understand your culture, values, and the unique challenges you face. Our experienced counselors 
                  and social workers are here to provide compassionate, culturally-sensitive support when you need it most.
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '24px' 
              }}>
                {[
                  { icon: '🤝', title: 'Trusted Support', desc: '30+ years serving families' },
                  { icon: '🏠', title: 'Cultural Understanding', desc: 'Respects your values & traditions' },
                  { icon: '🔒', title: 'Completely Confidential', desc: 'Your privacy is protected' },
                  { icon: '💝', title: 'Free Services', desc: 'No cost for support & counseling' }
                ].map((item, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      background: '#ea580c', 
                      borderRadius: '50%', 
                      margin: '0 auto 12px auto', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'white'
                    }}>
                      {item.icon}
                    </div>
                    <h5 style={{ fontWeight: 'bold', color: '#c2410c', marginBottom: '4px' }}>
                      {item.title}
                    </h5>
                    <p style={{ fontSize: '14px', color: '#ea580c' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <a 
                  href="https://sinda.org.sg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    background: '#ea580c',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#dc2626';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#ea580c';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🌐 Learn More About SINDA
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            backdropFilter: 'blur(4px)',
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '4px solid #f59e0b',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                  borderRadius: '50%',
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)'
                }}>
                  📞
                </div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  Request Support Call
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  Our caring counselors will reach out to you personally
                </p>
              </div>

              <form onSubmit={handleContactSubmit}>
                {[
                  { label: 'Your Name', type: 'text', value: contactData.name, key: 'name', placeholder: 'What should we call you?' },
                  { label: 'Phone Number', type: 'tel', value: contactData.phone, key: 'phone', placeholder: '+65 XXXX XXXX' }
                ].map((field, index) => (
                  <div key={index} style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setContactData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      required
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Best time to call
                  </label>
                  <select
                    value={contactData.preferredTime}
                    onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">When would you prefer we call?</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    How can we help? (optional)
                  </label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    placeholder="Share anything you'd like us to know beforehand..."
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: '1',
                      padding: '16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#9ca3af';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!contactData.name || !contactData.phone}
                    style={{
                      flex: '2',
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: (!contactData.name || !contactData.phone) ? 'not-allowed' : 'pointer',
                      opacity: (!contactData.name || !contactData.phone) ? '0.5' : '1',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (contactData.name && contactData.phone) {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (contactData.name && contactData.phone) {
                        e.target.style.background = '#ea580c';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    💙 Request Call Back
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <div style={{ 
                    background: '#f9fafb', 
                    padding: '20px', 
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      margin: '0'
                    }}>
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
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0.8); 
              opacity: 0.5; 
            }
            40% { 
              transform: scale(1.2); 
              opacity: 1; 
            }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .sinda-card {
              margin: 10px !important;
              padding: 20px !important;
            }
            
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
            
            h1 {
              font-size: 20px !important;
            }
            
            h2 {
              font-size: 32px !important;
            }
            
            .language-card {
              padding: 20px !important;
            }
          }

          @media (max-width: 480px) {
            .sinda-card {
              border-radius: 16px !important;
              padding: 16px !important;
            }
            
            h2 {
              font-size: 28px !important;
            }
            
            .hero-section {
              padding: 40px 20px !important;
            }
          }

          /* Smooth scrolling for chat */
          .chat-messages {
            scrollbar-width: thin;
            scrollbar-color: #ea580c #f3f4f6;
          }
          
          .chat-messages::-webkit-scrollbar {
            width: 8px;
          }
          
          .chat-messages::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 4px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb {
            background: #ea580c;
            border-radius: 4px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #dc2626;
          }

          /* Animation classes */
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .scale-in {
            animation: scaleIn 0.4s ease-out;
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0; 
              transform: scale(0.9); 
            }
            to { 
              opacity: 1; 
              transform: scale(1); 
            }
          }

          /* Focus states for accessibility */
          input:focus,
          textarea:focus,
          select:focus,
          button:focus {
            outline: 2px solid #ea580c;
            outline-offset: 2px;
          }

          /* Print styles */
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
