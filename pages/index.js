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

  // Contact form data
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    description: ''
  });

  // Application form data
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    nric: '',
    dateOfBirth: '',
    gender: '',
    ethnicity: 'Indian',
    maritalStatus: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    householdSize: '',
    monthlyHouseholdIncome: '',
    perCapitaIncome: '',
    employmentStatus: '',
    occupation: '',
    programInterested: '',
    reasonForApplication: '',
    previousSindaPrograms: '',
    studentName: '',
    studentLevel: '',
    school: '',
    subjectsNeeded: '',
    currentGrades: '',
    familyComposition: '',
    typeOfAssistanceNeeded: '',
    urgencyLevel: '',
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

  // Basic conversation flow
  const getBasicResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with SINDA programs. You can browse the programs above or ask me about eligibility, application process, or any specific program you're interested in. What would you like to know?";
    }
    
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Detect application intent
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
      const basicResponse = getBasicResponse(userMessage);
      const response = basicResponse || await queryOpenAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false);
        setIsTyping(false);
        
        // Crisis detection
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
      `}</style>
    </div>
  );
}
