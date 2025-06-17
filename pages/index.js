import { useState, useRef, useEffect, useCallback } from 'react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // User conversation state
  const [conversationStage, setConversationStage] = useState('name');
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    location: '',
    situation: ''
  });

  // Contact form data - keeping for compatibility
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    description: ''
  });

  // Application form data
  const [applicationData, setApplicationData] = useState({
    // Personal Information
    fullName: '',
    nric: '',
    dateOfBirth: '',
    gender: '',
    ethnicity: 'Indian',
    maritalStatus: '',
    
    // Contact Information
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    
    // Household Information
    householdSize: '',
    monthlyHouseholdIncome: '',
    perCapitaIncome: '',
    employmentStatus: '',
    occupation: '',
    
    // Program Specific
    programInterested: '',
    reasonForApplication: '',
    previousSindaPrograms: '',
    
    // For Education Programs
    studentName: '',
    studentLevel: '',
    school: '',
    subjectsNeeded: '',
    currentGrades: '',
    
    // For Family Services
    familyComposition: '',
    typeOfAssistanceNeeded: '',
    urgencyLevel: '',
    
    // Supporting Documents
    documentsAvailable: [],
    additionalInfo: ''
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: 'Welcome to SINDA! 👋 I can help you find the right programs and guide you through the application process. Feel free to browse the programs above or ask me any questions!'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'SINDA வில் உங்களை வரவேற்கிறோம்! 👋 சரியான திட்டங்களைக் கண்டறியவும் விண்ணப்ப செயல்முறையில் உங்களுக்கு வழிகாட்டவும் என்னால் உதவ முடியும். மேலே உள்ள திட்டங்களைப் பார்க்கவும் அல்லது எனக்கு ஏதேனும் கேள்விகள் கேட்கவும்!'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'SINDA में आपका स्वागत है! 👋 मैं आपको सही कार्यक्रम खोजने और आवेदन प्रक्रिया में मार्गदर्शन करने में मदद कर सकता हूँ। ऊपर दिए गए कार्यक्रमों को देखें या मुझसे कोई भी प्रश्न पूछें!'
    }
  };

  const quickHelp = [
    { text: '📚 Education Programs', type: 'education', description: 'Tuition schemes, bursaries, pre-school subsidies' },
    { text: '👨‍👩‍👧‍👦 Family Services', type: 'family', description: 'Counselling, financial assistance, family support' },
    { text: '💼 Employment Support', type: 'employment', description: 'Skills training, job placement services' },
    { text: '👴 Eldercare Services', type: 'eldercare', description: 'Senior centres, social activities' },
    { text: '💰 Financial Assistance', type: 'financial', description: 'Emergency aid, bill payment help' },
    { text: '🚨 Urgent Help', type: 'crisis', description: 'Immediate crisis support' }
  ];

  // Basic conversation flow for initial questions (simplified)
  const getBasicResponse = useCallback((userMessage) => {
    // For this chatbot, we'll primarily rely on OpenAI for responses
    // Only handle very basic greetings locally
    const message = userMessage.toLowerCase().trim();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with SINDA programs. You can browse the programs above or ask me about eligibility, application process, or any specific program you're interested in. What would you like to know?";
    }
    
    // For everything else, let OpenAI handle it
    return null;
  }, []);

  // OpenAI Integration
  const queryOpenAI = useCallback(async (userMessage) => {
    try {
      console.log('Sending message to OpenAI:', userMessage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userInfo: userInfo,
          conversationStage: conversationStage
        })
      });

      console.log('OpenAI API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI API Response data:', data);
      
      return data.message || "I understand. Can you tell me more about how you're feeling?";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm here to support you. Please tell me more about what's troubling you.";
    }
  }, [userInfo, conversationStage]);

  // Message handling
  const addMessage = useCallback((content, isUser = false) => {
    const newMessage = {
      id: messageId,
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Helper function to render markdown-like formatting
  const renderMessageContent = (content) => {
    // Simple markdown rendering for chat messages
    let rendered = content;
    
    // Bold text: **text** -> <strong>text</strong>
    rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points: - text -> proper list items
    rendered = rendered.replace(/^- (.+)$/gm, '• $1');
    
    // Convert numbered lists: 1. text -> proper numbered items
    rendered = rendered.replace(/^(\d+)\. (.+)$/gm, '$1. $2');
    
    // Convert blockquotes: > text -> styled blockquotes
    rendered = rendered.replace(/^> (.+)$/gm, '<div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 8px 12px; margin: 8px 0; border-radius: 4px; font-style: italic;">$1</div>');
    
    // Convert line breaks
    rendered = rendered.replace(/\n/g, '<br>');
    
    return rendered;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Detect application intent and show form
  const detectApplicationIntent = useCallback((message) => {
    const applyKeywords = [
      'apply', 'application', 'want to apply', 'how to apply', 'interested in applying',
      'sign up', 'register', 'enroll', 'join', 'start application', 'apply for sinda'
    ];
    
    const lowerMessage = message.toLowerCase();
    return applyKeywords.some(keyword => lowerMessage.includes(keyword));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    // Check if user wants to apply
    if (detectApplicationIntent(userMessage)) {
      setTimeout(() => {
        addMessage("I'd be happy to help you with your application! Let me open the application form for you.", false);
        setIsTyping(false);
        setTimeout(() => {
          setShowApplicationForm(true);
        }, 500);
      }, 1000);
      return;
    }

    try {
      // For most messages, use OpenAI for intelligent responses
      const basicResponse = getBasicResponse(userMessage);
      
      const response = basicResponse || await queryOpenAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false);
        setIsTyping(false);
        
        // Crisis detection with updated number
        if (userMessage.toLowerCase().includes('urgent') || 
            userMessage.toLowerCase().includes('crisis') ||
            userMessage.toLowerCase().includes('emergency')) {
          setTimeout(() => {
            addMessage("🚨 If this is an emergency, please call SINDA at 1800 295 3333 immediately for assistance.", false);
          }, 1500);
        }
      }, Math.random() * 800 + 1200);
      
    } catch (error) {
      setTimeout(() => {
        const fallbackResponse = "I'm experiencing some technical difficulties, but I'm still here to listen. Can you tell me more about what's on your mind?";
        addMessage(fallbackResponse, false);
        setIsTyping(false);
      }, 1200);
    }
  }, [inputMessage, isTyping, addMessage, queryOpenAI, getBasicResponse, detectApplicationIntent]);

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
      addMessage(languages[langKey].greeting, false);
    }, 500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactData);
    setShowContactForm(false);
    addMessage(`Thank you, ${contactData.name}! We've received your application interest. A SINDA program officer will contact you within 24 hours to discuss your eligibility and next steps. You can also visit www.sinda.org.sg to start your online application immediately.`, false);
    setContactData({ name: '', phone: '', preferredTime: '', description: '' });
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', applicationData);
    setShowApplicationForm(false);
    addMessage(`Thank you for your application, ${applicationData.fullName}! We've received your application for ${applicationData.programInterested}. A SINDA program officer will review your application and contact you within 3-5 working days. You can also call 1800 295 3333 to check on your application status.`, false);
    
    // Reset form
    setApplicationData({
      fullName: '', nric: '', dateOfBirth: '', gender: '', ethnicity: 'Indian', maritalStatus: '',
      phone: '', email: '', address: '', postalCode: '', householdSize: '', monthlyHouseholdIncome: '',
      perCapitaIncome: '', employmentStatus: '', occupation: '', programInterested: '',
      reasonForApplication: '', previousSindaPrograms: '', studentName: '', studentLevel: '',
      school: '', subjectsNeeded: '', currentGrades: '', familyComposition: '',
      typeOfAssistanceNeeded: '', urgencyLevel: '', documentsAvailable: [], additionalInfo: ''
    });
    setApplicationStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0' }}>
                SINDA Community Support
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: '4px 0 0 0' }}>
                💜 Here to help you through life's challenges
              </p>
            </div>
            
            <a 
              href="tel:1800295333"
              style={{ 
                background: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              📞 SINDA: 1800 295 3333
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <div style={{ 
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: '#3b82f6', 
              borderRadius: '50%', 
              margin: '0 auto 30px auto', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              💙
            </div>
            
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
              We're Here for You
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
            </p>
            
            <button
              onClick={handleWelcomeStart}
              style={{ 
                background: '#ea580c',
                color: 'white',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
              }}
            >
              💬 Start Conversation
            </button>
          </div>
        )}

        {/* Language Selection */}
        {currentStep === 'language' && (
          <div style={{ 
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                Choose Your Language
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                We want you to feel comfortable expressing yourself
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => handleLanguageSelect(key)}
                  style={{ 
                    background: 'white',
                    border: '2px solid #fed7aa',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#ea580c';
                    e.target.style.background = '#fff7ed';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#fed7aa';
                    e.target.style.background = 'white';
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {lang.name}
                  </div>
                  <div style={{ 
                    background: '#ea580c',
                    color: 'white',
                    padding: '6px 12px', 
                    borderRadius: '15px', 
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

        {/* SINDA Programs Display - Above Chat */}
        {currentStep === 'chat' && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                color: '#111827', 
                fontSize: '28px', 
                fontWeight: 'bold', 
                marginBottom: '8px' 
              }}>
                SINDA Programs & Services
              </h2>
              <p style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                fontSize: '16px', 
                marginBottom: '30px' 
              }}>
                Click on any program below to learn more and get personalized guidance
              </p>

              {/* Education Programs */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: '#ea580c', 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📚 Education Programs
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '15px' 
                }}>
                  {[
                    { name: 'STEP Tuition', desc: 'Nation-wide tuition for Primary & Secondary students', icon: '📝' },
                    { name: 'A-Level Tuition', desc: 'Specialized support for JC students', icon: '🎓' },
                    { name: 'GUIDE Programme', desc: 'Mentoring and academic guidance', icon: '🧭' },
                    { name: 'SINDA Bursary', desc: 'Financial aid for tertiary education', icon: '💰' },
                    { name: 'ITE Programs', desc: 'Support for ITE students (Aspire & Leadership)', icon: '🔧' },
                    { name: 'Excellence Awards', desc: 'Recognition for outstanding achievements', icon: '🏆' }
                  ].map((program, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setInputMessage(`Tell me about ${program.name}`);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        border: '2px solid #fed7aa',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#ea580c';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#fed7aa';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{program.icon}</div>
                      <h4 style={{ 
                        color: '#ea580c', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        margin: '0 0 6px 0' 
                      }}>
                        {program.name}
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '13px', 
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {program.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family & Social Services */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: '#dc2626', 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👨‍👩‍👧‍👦 Family & Social Services
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '15px' 
                }}>
                  {[
                    { name: 'Family Service Centre', desc: 'Counselling and family support services', icon: '💙' },
                    { name: 'Financial Assistance', desc: 'Emergency aid for bills, rent and basic needs', icon: '🆘' },
                    { name: 'Project Athena', desc: 'Empowerment program for single mothers', icon: '👩‍👧‍👦' },
                    { name: 'Crisis Support', desc: 'Immediate help for families in emergency', icon: '🚨' }
                  ].map((program, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setInputMessage(`Tell me about ${program.name}`);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                        border: '2px solid #fca5a5',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#fca5a5';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{program.icon}</div>
                      <h4 style={{ 
                        color: '#dc2626', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        margin: '0 0 6px 0' 
                      }}>
                        {program.name}
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '13px', 
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {program.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Youth & Community */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: '#7c3aed', 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🎯 Youth & Community Programs
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '15px' 
                }}>
                  {[
                    { name: 'SINDA Youth Club', desc: 'Leadership development for ages 18-35', icon: '👥' },
                    { name: 'Corporate Mentoring', desc: 'Professional mentorship and career guidance', icon: '💼' },
                    { name: 'Community Outreach', desc: 'Door-to-door support and SINDA Bus services', icon: '🤝' },
                    { name: 'Back to School Festival', desc: 'Annual school supplies and support', icon: '🎒' }
                  ].map((program, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setInputMessage(`Tell me about ${program.name}`);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{program.icon}</div>
                      <h4 style={{ 
                        color: '#7c3aed', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        margin: '0 0 6px 0' 
                      }}>
                        {program.name}
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '13px', 
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {program.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#374151', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0 0 12px 0' 
                }}>
                  💡 Not sure which program is right for you?
                </h4>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  margin: '0 0 15px 0' 
                }}>
                  Chat with our program guide below to get personalized recommendations!
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    'Check my eligibility',
                    'Compare programs', 
                    'Application process',
                    'Apply for SINDA program',
                    'Contact SINDA'
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(action);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      style={{
                        background: '#ea580c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#ea580c';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {currentStep === 'chat' && (
          <div style={{ 
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            
            {/* Chat Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
              padding: '20px', 
              color: 'white' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🏛️
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                      SINDA Program Guide
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0' }}>
                      Online • Ready to help you find programs & apply
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href="https://www.sinda.org.sg"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    🌐 SINDA.org.sg
                  </a>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Program Guide Buttons - Simplified since programs are above */}
            {messages.length === 0 && (
              <div style={{ padding: '20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ textAlign: 'center', color: '#374151', fontWeight: '600', marginBottom: '16px' }}>
                  👆 Browse programs above or ask me anything below!
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '12px' 
                }}>
                  {[
                    { text: '🤔 Which program is best for me?', type: 'recommendation' },
                    { text: '💰 Check eligibility requirements', type: 'eligibility' },
                    { text: '📝 How to apply for programs?', type: 'application' },
                    { text: '📞 Contact information', type: 'contact' }
                  ].map((help, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickHelp(help)}
                      style={{ 
                        background: '#ea580c',
                        color: 'white',
                        border: 'none',
                        padding: '12px', 
                        borderRadius: '8px', 
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textAlign: 'center'
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
              padding: '20px', 
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
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
                    maxWidth: '75%',
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    ...(message.isUser ? {
                      background: '#3b82f6',
                      color: 'white'
                    } : {
                      background: 'white',
                      color: '#111827',
                      border: '1px solid #e5e7eb'
                    })
                  }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                      {message.content}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
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
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ 
                          width: '6px', 
                          height: '6px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite'
                        }}></div>
                        <div style={{ 
                          width: '6px', 
                          height: '6px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite 0.16s'
                        }}></div>
                        <div style={{ 
                          width: '6px', 
                          height: '6px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite 0.32s'
                        }}></div>
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
            <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  style={{ 
                    background: '#ea580c',
                    color: 'white',
                    border: 'none',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    cursor: (isTyping || !inputMessage.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (isTyping || !inputMessage.trim()) ? '0.5' : '1'
                  }}
                >
                  ➤
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    fontWeight: '600',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '8px'
                  }}
                >
                  🚀 Open Application Form
                </button>
                <span style={{ 
                  background: '#fef2f2', 
                  color: '#dc2626', 
                  padding: '6px 12px', 
                  borderRadius: '15px', 
                  fontWeight: '600',
                  fontSize: '12px',
                  border: '1px solid #fecaca'
                }}>
                  📞 Need Help? Call SINDA: 1800 295 3333
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                SINDA Program Application
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                {[1, 2, 3].map((step) => (
                  <div key={step} style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: applicationStep >= step ? '#ea580c' : '#e5e7eb',
                    color: applicationStep >= step ? 'white' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {step}
                  </div>
                ))}
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Step {applicationStep} of 3: {
                  applicationStep === 1 ? 'Personal Information' :
                  applicationStep === 2 ? 'Program & Household Details' :
                  'Review & Submit'
                }
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              {/* Step 1: Personal Information */}
              {applicationStep === 1 && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={applicationData.fullName}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        placeholder="As per NRIC"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        NRIC/FIN *
                      </label>
                      <input
                        type="text"
                        value={applicationData.nric}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, nric: e.target.value }))}
                        required
                        placeholder="S1234567A"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={applicationData.dateOfBirth}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Gender *
                      </label>
                      <select
                        value={applicationData.gender}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, gender: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Marital Status
                      </label>
                      <select
                        value={applicationData.maritalStatus}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, maritalStatus: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={applicationData.phone}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        placeholder="+65 XXXX XXXX"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={applicationData.email}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="your.email@example.com"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                      Residential Address *
                    </label>
                    <textarea
                      value={applicationData.address}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, address: e.target.value }))}
                      required
                      rows="3"
                      placeholder="Block, Street, Unit Number"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Program & Household Details */}
              {applicationStep === 2 && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                      Program of Interest *
                    </label>
                    <select
                      value={applicationData.programInterested}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, programInterested: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select a program</option>
                      <optgroup label="📚 Education Programs">
                        <option value="STEP Tuition">STEP Tuition (Primary/Secondary)</option>
                        <option value="A-Level Tuition">A-Level Tuition</option>
                        <option value="GUIDE Programme">GUIDE Programme (Mentoring)</option>
                        <option value="SINDA Bursary">SINDA Bursary (Tertiary Education)</option>
                        <option value="ITE Programs">ITE Programs (Aspire/Leadership)</option>
                      </optgroup>
                      <optgroup label="👨‍👩‍👧‍👦 Family & Social Services">
                        <option value="Family Service Centre">Family Service Centre</option>
                        <option value="Financial Assistance">Financial Assistance</option>
                        <option value="Project Athena">Project Athena (Single Mothers)</option>
                      </optgroup>
                      <optgroup label="🎯 Youth Development">
                        <option value="SINDA Youth Club">SINDA Youth Club</option>
                        <option value="Corporate Mentoring">Corporate Mentoring</option>
                      </optgroup>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Household Size *
                      </label>
                      <select
                        value={applicationData.householdSize}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, householdSize: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6+">6 or more</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Monthly Household Income *
                      </label>
                      <select
                        value={applicationData.monthlyHouseholdIncome}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, monthlyHouseholdIncome: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select range</option>
                        <option value="Below $2,000">Below $2,000</option>
                        <option value="$2,000 - $3,200">$2,000 - $3,200</option>
                        <option value="$3,201 - $4,800">$3,201 - $4,800</option>
                        <option value="$4,801 - $6,400">$4,801 - $6,400</option>
                        <option value="Above $6,400">Above $6,400</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                        Employment Status
                      </label>
                      <select
                        value={applicationData.employmentStatus}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Student">Student</option>
                        <option value="Retired">Retired</option>
                        <option value="Homemaker">Homemaker</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                      Reason for Application *
                    </label>
                    <textarea
                      value={applicationData.reasonForApplication}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, reasonForApplication: e.target.value }))}
                      required
                      rows="4"
                      placeholder="Please explain why you are applying for this program and how it will help you..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {applicationData.programInterested?.includes('STEP') && (
                    <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#0ea5e9', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                        📚 Education Program Details
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                            Student Name
                          </label>
                          <input
                            type="text"
                            value={applicationData.studentName}
                            onChange={(e) => setApplicationData(prev => ({ ...prev, studentName: e.target.value }))}
                            placeholder="If different from applicant"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '13px'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                            Current Level
                          </label>
                          <select
                            value={applicationData.studentLevel}
                            onChange={(e) => setApplicationData(prev => ({ ...prev, studentLevel: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '13px'
                            }}
                          >
                            <option value="">Select level</option>
                            <option value="Primary 1">Primary 1</option>
                            <option value="Primary 2">Primary 2</option>
                            <option value="Primary 3">Primary 3</option>
                            <option value="Primary 4">Primary 4</option>
                            <option value="Primary 5">Primary 5</option>
                            <option value="Primary 6">Primary 6</option>
                            <option value="Secondary 1">Secondary 1</option>
                            <option value="Secondary 2">Secondary 2</option>
                            <option value="Secondary 3">Secondary 3</option>
                            <option value="Secondary 4">Secondary 4</option>
                            <option value="Secondary 5">Secondary 5</option>
                            <option value="JC 1">JC 1</option>
                            <option value="JC 2">JC 2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {applicationStep === 3 && (
                <div>
                  <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#374151', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                      📋 Application Summary
                    </h4>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                      <div><strong>Name:</strong> {applicationData.fullName}</div>
                      <div><strong>NRIC:</strong> {applicationData.nric}</div>
                      <div><strong>Phone:</strong> {applicationData.phone}</div>
                      <div><strong>Email:</strong> {applicationData.email}</div>
                      <div><strong>Program:</strong> {applicationData.programInterested}</div>
                      <div><strong>Household Size:</strong> {applicationData.householdSize}</div>
                      <div><strong>Monthly Income:</strong> {applicationData.monthlyHouseholdIncome}</div>
                    </div>
                  </div>

                  <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fbbf24' }}>
                    <h4 style={{ color: '#92400e', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      📄 Required Documents (Please prepare these)
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#92400e' }}>
                      <li>Copy of NRIC/Birth Certificate</li>
                      <li>Latest 3 months' payslips or income proof</li>
                      <li>Latest utility bill (for address verification)</li>
                      {applicationData.programInterested?.includes('STEP') && (
                        <li>Student's latest school report card</li>
                      )}
                      {applicationData.programInterested?.includes('Bursary') && (
                        <li>Academic transcripts and acceptance letter</li>
                      )}
                    </ul>
                  </div>

                  <div style={{ background: '#ecfdf5', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #10b981' }}>
                    <h4 style={{ color: '#065f46', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      ✅ What happens next?
                    </h4>
                    <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#065f46' }}>
                      <li>We'll review your application within 3-5 working days</li>
                      <li>A SINDA officer will contact you for document verification</li>
                      <li>If eligible, we'll schedule an assessment meeting</li>
                      <li>Successful applicants will be enrolled in the program</li>
                    </ol>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <input type="checkbox" required />
                      I confirm that all information provided is accurate and I understand that providing false information may result in disqualification.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <div>
                  {applicationStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setApplicationStep(prev => prev - 1)}
                      style={{
                        padding: '12px 20px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ← Back
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    style={{
                      padding: '12px 20px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  
                  {applicationStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setApplicationStep(prev => prev + 1)}
                      disabled={
                        (applicationStep === 1 && (!applicationData.fullName || !applicationData.nric || !applicationData.phone || !applicationData.email)) ||
                        (applicationStep === 2 && (!applicationData.programInterested || !applicationData.householdSize || !applicationData.monthlyHouseholdIncome || !applicationData.reasonForApplication))
                      }
                      style={{
                        padding: '12px 20px',
                        background: '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        opacity: (
                          (applicationStep === 1 && (!applicationData.fullName || !applicationData.nric || !applicationData.phone || !applicationData.email)) ||
                          (applicationStep === 2 && (!applicationData.programInterested || !applicationData.householdSize || !applicationData.monthlyHouseholdIncome || !applicationData.reasonForApplication))
                        ) ? '0.5' : '1'
                      }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🚀 Submit Application
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Form Modal - Keep original for backwards compatibility */}
      {showContactForm && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                Apply for SINDA Program
              </h3>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Start your application process - we'll guide you through the requirements
              </p>
            </div>

            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactData.name}
                  onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="What should we call you?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="+65 XXXX XXXX"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Which program interests you?
                </label>
                <select
                  value={contactData.preferredTime}
                  onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select a program</option>
                  <option value="education">📚 Education Support (Tuition, Bursaries)</option>
                  <option value="family">👨‍👩‍👧‍👦 Family Services (Counselling, Financial Aid)</option>
                  <option value="employment">💼 Employment Support (Skills Training, Jobs)</option>
                  <option value="eldercare">👴 Eldercare Services (Senior Centres)</option>
                  <option value="multiple">🔄 Multiple Programs</option>
                  <option value="unsure">❓ Not Sure - Need Guidance</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Monthly Household Income (for eligibility assessment)
                </label>
                <select
                  value={contactData.description}
                  onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select income range</option>
                  <option value="below-3000">Below $3,000</option>
                  <option value="3000-4500">$3,000 - $4,500</option>
                  <option value="4500-6000">$4,500 - $6,000</option>
                  <option value="above-6000">Above $6,000</option>
                  <option value="prefer-not-say">Prefer not to say</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Best time to call
                </label>
                <select
                  value={contactData.preferredTime}
                  onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="">When would you prefer we call?</option>
                  <option value="urgent">As soon as possible (urgent)</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                  <option value="evening">Evening (6 PM - 8 PM)</option>
                </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Tell us about your situation (optional)
                </label>
                <textarea
                  value={contactData.description}
                  onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  placeholder="e.g., Need help with school fees, looking for job training, family in crisis..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  style={{
                    flex: '1',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#6b7280',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
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
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: (!contactData.name || !contactData.phone) ? 'not-allowed' : 'pointer',
                    opacity: (!contactData.name || !contactData.phone) ? '0.5' : '1'
                  }}
                >
                  💬 Start Application Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
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
          h1 {
            font-size: 20px !important;
          }
          
          h2 {
            font-size: 28px !important;
          }
          
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .chat-container {
            margin: 10px;
            border-radius: 12px;
          }
          
          .welcome-container {
            padding: 30px 20px !important;
          }
          
          h2 {
            font-size: 24px !important;
          }
        }

        /* Smooth scrolling for chat */
        .chat-messages {
          scrollbar-width: thin;
          scrollbar-color: #ea580c #f3f4f6;
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #ea580c;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }

        /* Focus states for accessibility */
        input:focus,
        textarea:focus,
        select:focus,
        button:focus {
          outline: 2px solid #ea580c;
          outline-offset: 2px;
        }

        /* Hover effects */
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        button:active {
          transform: translateY(0);
        }

        /* Input focus effects */
        input:focus,
        textarea:focus,
        select:focus {
          border-color: #ea580c !important;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
      `}</style>
    </div>
  );
}
