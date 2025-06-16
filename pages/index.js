// pages/index.js - Enhanced SINDA Community Support Chatbot
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

  // Enhanced send message function
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    // Simulate realistic typing delay
    const typingDelay = Math.random() * 1000 + 1500; // 1.5-2.5 seconds

    setTimeout(() => {
      const response = getConversationResponse(userMessage);
      addMessage(response, false, true);
      setIsTyping(false);
      
      // Add crisis support message if needed
      const message = userMessage.toLowerCase();
      if (message.includes('urgent') || message.includes('crisis') || message.includes('emergency')) {
        setTimeout(() => {
          addMessage("If this is an urgent situation, please don't hesitate to call our 24/7 helpline at 6298 8775 immediately. Our crisis counselors are trained to provide immediate support.", false, true);
        }, 2000);
      }
    }, typingDelay);
  }, [inputMessage, isTyping, addMessage, getConversationResponse]);

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

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.05)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />

        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', 
          color: 'white',
          padding: '20px 0',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
        `}</style>
      </div>
    </>
  );
}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                backdropFilter: 'blur(10px)',
                animation: 'pulse 3s infinite'
              }}>
                🤝
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  SINDA Community Support
                </h1>
                <p style={{ 
                  fontSize: '14px', 
                  margin: '5px 0 0 0',
                  opacity: '0.9'
                }}>
                  💙 Here to help you through life's challenges
                </p>
              </div>
            </div>
            <a 
              href="tel:62988775"
              style={{ 
                background: '#dc2626',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                animation: 'glow 2s infinite'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🚨 Crisis Helpline: 6298 8775
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 5 }}>
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '25px', 
              padding: '60px 40px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              border: '3px solid #0ea5e9',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Animated background pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
                animation: 'rotate 30s infinite linear'
              }} />
              
              <div style={{ 
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px auto',
                fontSize: '48px',
                boxShadow: '0 15px 35px rgba(14, 165, 233, 0.3)',
                animation: 'bounce 2s infinite',
                position: 'relative',
                zIndex: 1
              }}>
                💙
              </div>
              
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                margin: '0 0 20px 0',
                position: 'relative',
                zIndex: 1
              }}>
                We're Here to Help
              </h2>
              
              <p style={{ 
                fontSize: '22px', 
                color: '#4b5563', 
                margin: '0 0 40px 0',
                lineHeight: '1.5',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                zIndex: 1
              }}>
                Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '25px',
                margin: '40px 0',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                zIndex: 1
              }}>
                {[
                  { icon: '🤗', title: 'Caring Support', desc: 'Empathetic assistance from trained counselors' },
                  { icon: '🏠', title: 'Community Focus', desc: 'Understanding your culture and values' },
                  { icon: '🌟', title: 'Real Solutions', desc: 'Practical help and resources available' }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                      padding: '30px 20px', 
                      borderRadius: '20px',
                      border: '2px solid #bae6fd',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                      e.target.style.borderColor = '#0ea5e9';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#bae6fd';
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{feature.icon}</div>
                    <h4 style={{ color: '#0284c7', fontWeight: 'bold', margin: '0 0 5px 0' }}>{feature.title}</h4>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleWelcomeStart}
                style={{ 
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '20px 50px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)';
                }}
              >
                💙 Get Support Now
              </button>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#9ca3af',
                margin: '20px 0 0 0',
                position: 'relative',
                zIndex: 1
              }}>
                ✓ Confidential • Free support • Available in multiple languages
              </p>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '25px', 
              padding: '50px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              border: '3px solid #0ea5e9'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px auto',
                  fontSize: '40px',
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  🌏
                </div>
                <h2 style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0 0 15px 0'
                }}>
                  Choose Your Language
                </h2>
                <p style={{ 
                  fontSize: '18px', 
                  color: '#6b7280', 
                  margin: '0'
                }}>
                  We want you to feel comfortable expressing yourself
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '25px'
              }}>
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    style={{ 
                      padding: '25px',
                      borderRadius: '20px',
                      border: '3px solid #bae6fd',
                      background: 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '16px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.background = '#f0f9ff';
                      e.target.style.transform = 'translateY(-3px) scale(1.02)';
                      e.target.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#bae6fd';
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      marginBottom: '10px'
                    }}>
                      {lang.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      marginBottom: '10px'
                    }}>
                      {key === 'english' && 'I need help'}
                      {key === 'tamil' && 'எனக்கு உதவி வேண்டும்'}
                      {key === 'hindi' && 'मुझे मदद चाहिए'}
                      {key === 'telugu' && 'నాకు సహాయం కావాలి'}
                      {key === 'malayalam' && 'എനിക്ക് സഹായം വേണം'}
                    </div>
                    <div style={{
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginTop: '10px'
                    }}>
                      💙 CARING SUPPORT
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
              borderRadius: '25px', 
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              border: '3px solid #0ea5e9'
            }}>
              
              {/* Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: 'white',
                padding: '25px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '10px', 
                      borderRadius: '15px',
                      fontSize: '24px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      💙
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        margin: '0'
                      }}>
                        SINDA Support Helper
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        opacity: '0.9',
                        margin: '5px 0 0 0'
                      }}>
                        🟢 Here to listen and help • Confidential support
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    📞 Request Call Back
                  </button>
                </div>
              </div>

              {/* Support Areas */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                padding: '25px',
                borderBottom: '2px solid #e0f2fe'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  color: '#0284c7', 
                  fontWeight: 'bold',
                  margin: '0 0 20px 0',
                  textAlign: 'center'
                }}>
                  💙 What kind of support do you need today?
                </h4>
                
                {/* Quick Help Options */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: '15px',
                  marginBottom: '25px'
                }}>
                  {quickHelp.map((help, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickHelp(help)}
                      style={{ 
                        background: help.priority === 'high' ? '#fef2f2' : 'white',
                        border: `2px solid ${help.priority === 'high' ? '#f87171' : '#bae6fd'}`,
                        borderRadius: '15px',
                        padding: '15px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: help.priority === 'high' ? '#dc2626' : '#0284c7',
                        position: 'relative',
                        overflow: 'hidden',
                        ...(help.priority === 'high' && {
                          animation: 'urgentPulse 2s infinite'
                        })
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px) scale(1.02)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {help.priority === 'high' && '🚨 '}
                      {help.text}
                    </button>
                  ))}
                </div>

                {/* Support Areas Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                  gap: '15px'
                }}>
                  {supportAreas.slice(0, 4).map((area) => (
                    <div
                      key={area.id}
                      onClick={() => handleSupportAreaClick(area)}
                      style={{ 
                        background: 'white',
                        border: '2px solid #e0f2fe',
                        borderRadius: '15px',
                        padding: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#e0f2fe';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{area.emoji}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '5px'
                      }}>
                        {area.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#6b7280',
                        lineHeight: '1.3'
                      }}>
                        {area.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ 
                height: '400px', 
                overflowY: 'auto', 
                padding: '25px',
                background: '#fafafa'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{ 
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                      marginBottom: '20px',
                      opacity: 0,
                      animation: 'fadeInUp 0.5s ease forwards'
                    }}
                  >
                    <div
                      style={{ 
                        maxWidth: '75%',
                        padding: '15px 20px',
                        borderRadius: '20px',
                        position: 'relative',
                        ...(message.isUser ? {
                          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                          color: 'white',
                          borderBottomRightRadius: '5px'
                        } : {
                          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                          color: 'white',
                          borderBottomLeftRadius: '5px'
                        })
                      }}
                    >
                      <p style={{ 
                        fontSize: '14px', 
                        margin: '0 0 8px 0',
                        lineHeight: '1.5'
                      }}>
                        {message.content}
                      </p>
                      <p style={{ 
                        fontSize: '11px',
                        margin: '0',
                        opacity: '0.7'
                      }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ 
                      background: 'white',
                      borderRadius: '20px',
                      borderBottomLeftRadius: '5px',
                      padding: '15px 20px',
                      border: '2px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              background: '#0ea5e9', 
                              borderRadius: '50%',
                              animation: `typing 1.4s infinite ease-in-out`,
                              animationDelay: `${i * 0.16}s`
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#6b7280'
                      }}>
                        Support helper is listening...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ 
                borderTop: '2px solid #e5e7eb',
                background: 'white',
                padding: '25px'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind... we're here to listen"
                    disabled={isTyping}
                    style={{ 
                      flex: '1',
                      border: '2px solid #e5e7eb',
                      borderRadius: '25px',
                      padding: '15px 25px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      ...(isTyping && { opacity: '0.7' })
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    style={{ 
                      background: (isTyping || !inputMessage.trim()) ? '#d1d5db' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      cursor: (isTyping || !inputMessage.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isTyping && inputMessage.trim()) {
                        e.target.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isTyping && inputMessage.trim()) {
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    💙
                  </button>
                </div>
                
                <div style={{ 
                  marginTop: '15px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  💡 Need urgent help? Call our 24/7 crisis line: <strong style={{ color: '#dc2626' }}>6298 8775</strong>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div style={{ 
            marginTop: '30px',
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '2px solid #bae6fd'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              💙 SINDA is Here When You Need Us
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px'
            }}>
              <div style={{ 
                background: '#fef2f2',
                border: '2px solid #fca5a5',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>🚨</span>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0 0 5px 0',
                  color: '#dc2626'
                }}>
                  Crisis Helpline (24/7)
                </h4>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#dc2626',
                  margin: '0 0 5px 0'
                }}>
                  6298 8775
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#7f1d1d',
                  margin: '0'
                }}>
                  Immediate support available
                </p>
              </div>
              
              <div style={{ 
                background: '#f0f9ff',
                border: '2px solid #bae6fd',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>📧</span>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0 0 5px 0',
                  color: '#0284c7'
                }}>
                  Email Support
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#0284c7',
                  margin: '0 0 5px 0'
                }}>
                  info@sinda.org.sg
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#0369a1',
                  margin: '0'
                }}>
                  Response within 24 hours
                </p>
              </div>
              
              <div style={{ 
                background: '#f0f9ff',
                border: '2px solid #bae6fd',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>🏢</span>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0 0 5px 0',
                  color: '#0284c7'
                }}>
                  Visit Our Center
                </h4>
                <p style={{ 
                  fontSize: '13px', 
                  fontWeight: 'bold',
                  color: '#0284c7',
                  margin: '0 0 5px 0'
                }}>
                  1 Beatty Road, Singapore 209943
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#0369a1',
                  margin: '0'
                }}>
                  Walk-ins welcome • Mon-Fri 9AM-6PM
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '20px',
              borderRadius: '15px',
              marginTop: '20px',
              textAlign: 'center',
              border: '2px solid #bae6fd'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#0369a1',
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                💙 Remember: You're not alone in this journey
              </p>
              <p style={{
                fontSize: '12px',
                color: '#075985',
                margin: '0 0 10px 0',
                lineHeight: '1.4'
              }}>
                SINDA has been supporting families like yours since 1991. Whatever challenges you're facing, our caring team is here to help you find solutions and move forward with confidence.
              </p>
              <a 
                href="https://sinda.org.sg/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#0284c7', 
                  textDecoration: 'none', 
                  fontWeight: 'bold', 
                  fontSize: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#0ea5e9';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#0284c7';
                  e.target.style.textDecoration = 'none';
                }}
              >
                🌐 Learn more about SINDA
              </a>
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
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '25px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80%',
              overflowY: 'auto',
              border: '3px solid #0ea5e9',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              animation: 'scaleIn 0.3s ease'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  fontSize: '36px',
                  animation: 'pulse 2s infinite'
                }}>
                  📞
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 10px 0'
                }}>
                  Request Support Call
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>
                  Our counselors will reach out to provide personalized assistance
                </p>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
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
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Select preferred time</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Brief description of how we can help (optional)
                  </label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Feel free to share what kind of support you're looking for..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ 
                  display: 'flex',
                  gap: '15px',
                  marginTop: '25px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: '1',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#9ca3af';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
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
                      padding: '12px',
                      border: 'none',
                      borderRadius: '10px',
                      background: (contactData.name && contactData.phone) 
                        ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                        : '#d1d5db',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: (contactData.name && contactData.phone) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (contactData.name && contactData.phone) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (contactData.name && contactData.phone) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    💙 Request Call Back
                  </button>
                </div>

                <p style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  marginTop: '15px',
                  lineHeight: '1.4'
                }}>
                  ✓ Confidential support • Response within 24 hours • No cost for consultation
                </p>
              </form>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px rgba(220, 38, 38, 0.5); }
            50% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.8); }
          }

          @keyframes urgentPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          }

          @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
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

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              text-align: center;
            }
            
            .quick-help-grid {
              grid-template-columns: 1fr 1fr;
            }
            
            .support-grid {
              grid-template-columns: 1fr 1fr;
            }

            .feature-grid {
              grid-template-columns: 1fr;
            }

            .language-grid {
              grid-template-columns: 1fr;
            }

            .contact-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 480px) {
            .quick-help-grid {
              grid-template-columns: 1fr;
            }
            
            .support-grid {
              grid-template-columns: 1fr;
            }
          }
