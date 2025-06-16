// pages/index.js - SINDA Lead Generation Chatbot with Intensive Demo Features
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [urgencyTimer, setUrgencyTimer] = useState(300); // 5 minutes
  const messagesEndRef = useRef(null);

  // Enhanced Lead Data Collection
  const [leadData, setLeadData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    preferredLanguage: 'english',
    
    // Family Information
    familySize: '',
    children: '',
    childrenAges: '',
    householdIncome: '',
    
    // Educational Needs
    educationLevel: '',
    studyInterests: [],
    learningGoals: '',
    
    // Service Interests
    primaryNeeds: [],
    urgencyLevel: '',
    availableTime: '',
    budget: '',
    
    // Engagement Tracking
    sessionDuration: 0,
    messagesCount: 0,
    topicsDiscussed: [],
    leadScore: 0,
    source: 'website-chatbot',
    timestamp: new Date().toISOString()
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: '🌟 Welcome to SINDA! Transform your future with Singapore\'s leading Indian community support organization.',
      cta: 'Discover how SINDA can accelerate your family\'s success in Singapore!'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: '🌟 SINDA க்கு வரவேற்கிறோம்! சிங்கப்பூரின் முன்னணி இந்திய சமுதாய ஆதரவு அமைப்புடன் உங்கள் எதிர்காலத்தை மாற்றுங்கள்.',
      cta: 'SINDA எவ்வாறு உங்கள் குடும்பத்தின் வெற்றியை துரிதப்படுத்த முடியும் என்பதைக் கண்டறியுங்கள்!'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: '🌟 SINDA में आपका स्वागत है! सिंगापुर के अग्रणी भारतीय समुदायिक सहायता संगठन के साथ अपना भविष्य बदलें।',
      cta: 'जानें कि SINDA आपके परिवार की सफलता को कैसे तेज़ कर सकता है!'
    },
    telugu: { 
      name: 'తెలుగు', 
      greeting: '🌟 SINDA కి స్వాగతం! సింగపూర్‌లోని అగ్రగామి భారతీయ కమ్యూనిటీ సపోర్ట్ ఆర్గనైజేషన్‌తో మీ భవిష్యత్తును మార్చుకోండి.',
      cta: 'SINDA మీ కుటుంబ విజయాన్ని ఎలా వేగవంతం చేయగలదో తెలుసుకోండి!'
    },
    malayalam: { 
      name: 'മലയാളം', 
      greeting: '🌟 SINDA യിലേക്ക് സ്വാഗതം! സിംഗപ്പൂരിലെ മുൻനിര ഇന്ത്യൻ കമ്മ്യൂണിറ്റി സപ്പോർട്ട് ഓർഗനൈസേഷനുമായി നിങ്ങളുടെ ഭാവി മാറ്റുക.',
      cta: 'SINDA എങ്ങനെ നിങ്ങളുടെ കുടുംബത്തിന്റെ വിജയം ത്വരിതപ്പെടുത്താൻ കഴിയുമെന്ന് കണ്ടെത്തുക!'
    }
  };

  const serviceCategories = [
    { 
      id: 'education', 
      name: 'Educational Excellence', 
      emoji: '🎓', 
      benefits: ['90% exam improvement rate', 'Subsidized tuition', 'University prep'],
      urgency: 'Limited spots for 2025'
    },
    { 
      id: 'professional', 
      name: 'Career Acceleration', 
      emoji: '🚀', 
      benefits: ['85% job placement success', 'Skills certification', 'Network access'],
      urgency: 'Next intake: July 2025'
    },
    { 
      id: 'family', 
      name: 'Family Empowerment', 
      emoji: '👨‍👩‍👧‍👦', 
      benefits: ['Free counseling', 'Parenting support', 'Crisis assistance'],
      urgency: 'Immediate support available'
    },
    { 
      id: 'financial', 
      name: 'Financial Support', 
      emoji: '💰', 
      benefits: ['Emergency grants', 'Education funding', 'Business loans'],
      urgency: 'Application deadline approaching'
    },
    { 
      id: 'youth', 
      name: 'Youth Development', 
      emoji: '🌟', 
      benefits: ['Leadership programs', 'Mentorship', 'Scholarship opportunities'],
      urgency: 'Summer program enrollment open'
    },
    { 
      id: 'senior', 
      name: 'Senior Care', 
      emoji: '👴👵', 
      benefits: ['Health screenings', 'Social activities', 'Support services'],
      urgency: 'Monthly wellness checks available'
    }
  ];

  const quickActions = [
    { text: '🏆 Check Eligibility', action: 'eligibility' },
    { text: '💡 Success Stories', action: 'testimonials' },
    { text: '📞 Schedule Call', action: 'schedule' },
    { text: '🎯 Enroll Now', action: 'enroll' }
  ];

  // Urgency Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setUrgencyTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session Tracking
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setLeadData(prev => ({ ...prev, sessionDuration: duration }));
    };
  }, []);

  // Lead Scoring Algorithm
  const calculateLeadScore = (data) => {
    let score = 0;
    if (data.name) score += 15;
    if (data.email) score += 20;
    if (data.phone) score += 25;
    if (data.primaryNeeds.length > 0) score += 10;
    if (data.urgencyLevel === 'high') score += 15;
    if (data.messagesCount > 5) score += 10;
    if (data.sessionDuration > 180) score += 5; // 3+ minutes
    return score;
  };

  // Enhanced Mistral AI with Lead Generation Focus
  const queryMistralAI = async (userMessage) => {
    try {
      const leadScore = calculateLeadScore(leadData);
      
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are SINDA's lead generation specialist. Your goal is to convert visitors into enrolled members.

              LEAD PROFILE:
              - Name: ${leadData.name || 'Not provided'}
              - Primary Needs: ${leadData.primaryNeeds.join(', ') || 'Unknown'}
              - Lead Score: ${leadScore}/100
              - Session Time: ${Math.floor(leadData.sessionDuration / 60)} minutes
              - Messages: ${leadData.messagesCount}

              CONVERSION STRATEGY:
              1. Create URGENCY (limited spots, deadlines, exclusive offers)
              2. Show SOCIAL PROOF (success rates, testimonials)
              3. Highlight BENEFITS (specific outcomes, transformations)
              4. Address CONCERNS (free consultations, trial programs)
              5. Drive ACTION (enroll, schedule call, apply)

              SINDA SUCCESS METRICS:
              - 90% exam improvement rate in education programs
              - 85% job placement success in career programs
              - 95% family satisfaction in support services
              - $2.5M annual financial assistance distributed
              - 15,000+ families served since 1991

              URGENCY ELEMENTS:
              - Limited enrollment spots for 2025 programs
              - Early bird discounts ending soon
              - Scholarship application deadlines
              - Free consultation slots filling up

              Keep responses enthusiastic, benefit-focused, and conversion-oriented. Always end with a call-to-action. Use emojis and power words like "transform," "accelerate," "exclusive," "limited-time."

              If lead score is high (70+), be more aggressive with enrollment offers.
              If they show interest in specific services, present immediate next steps.`
            },
            ...conversationContext.slice(-3),
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
      const aiResponse = data.choices[0]?.message?.content || "Let's discuss how SINDA can transform your family's future! 🌟 Book a free consultation: 6298 8775";
      
      // Update conversation context
      setConversationContext(prev => [
        ...prev.slice(-4),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);

      // Update lead data
      setLeadData(prev => {
        const newData = {
          ...prev,
          messagesCount: prev.messagesCount + 1,
          leadScore: calculateLeadScore(prev)
        };
        
        // Auto-trigger enrollment if high engagement
        if (newData.leadScore > 70 && !showEnrollmentForm) {
          setTimeout(() => triggerEnrollment(), 2000);
        }
        
        return newData;
      });

      return aiResponse;
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return "🌟 Ready to transform your future with SINDA? Our community specialists are standing by! Call 6298 8775 for immediate assistance and exclusive enrollment benefits!";
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

  const handleWelcomeStart = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setLeadData(prev => ({ ...prev, preferredLanguage: langKey }));
    addMessage(languages[langKey].greeting, false, true);
    addMessage("🎯 Let me help you discover the perfect SINDA program for your family! What's your primary goal for 2025?", false, true);
    setCurrentStep('chat');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    // Track topics discussed
    setLeadData(prev => {
      const topics = new Set(prev.topicsDiscussed);
      if (userMessage.toLowerCase().includes('education')) topics.add('education');
      if (userMessage.toLowerCase().includes('career') || userMessage.toLowerCase().includes('job')) topics.add('career');
      if (userMessage.toLowerCase().includes('family')) topics.add('family');
      if (userMessage.toLowerCase().includes('financial')) topics.add('financial');
      
      return { ...prev, topicsDiscussed: Array.from(topics) };
    });

    try {
      const aiResponse = await queryMistralAI(userMessage);
      setTimeout(() => {
        addMessage(aiResponse, false);
        setIsLoading(false);
        
        // Random conversion triggers
        if (Math.random() > 0.7) {
          setTimeout(() => showConversionPopup(), 3000);
        }
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        addMessage("🌟 Our SINDA specialists are ready to help you succeed! Call 6298 8775 now for exclusive program access and immediate enrollment benefits!", false);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'eligibility':
        setInputMessage("Check my eligibility for SINDA programs");
        break;
      case 'testimonials':
        setInputMessage("Show me success stories from SINDA members");
        break;
      case 'schedule':
        setInputMessage("I want to schedule a consultation call");
        break;
      case 'enroll':
        triggerEnrollment();
        return;
    }
    setTimeout(() => handleSendMessage(), 100);
  };

  const triggerEnrollment = () => {
    setShowEnrollmentForm(true);
    addMessage("🎉 Excellent! Let's get you enrolled in SINDA's transformative programs. This will only take 2 minutes and could change your family's future!", false, true);
  };

  const showConversionPopup = () => {
    addMessage("⚡ EXCLUSIVE OFFER: Enroll in the next 5 minutes and receive FREE priority consultation + bonus welcome package! Limited spots available.", false, true);
  };

  const handleEnrollmentSubmit = () => {
    const finalLeadScore = calculateLeadScore(leadData);
    console.log('LEAD CAPTURED:', { ...leadData, finalScore: finalLeadScore });
    
    setShowEnrollmentForm(false);
    setShowSuccessModal(true);
    addMessage("🎉 Welcome to the SINDA family! Your enrollment is confirmed. Our program specialist will contact you within 24 hours to fast-track your success journey!", false, true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>SINDA - Transform Your Future | Singapore Indian Development Association</title>
        <meta name="description" content="Join 15,000+ families who transformed their lives with SINDA. Education, Career, Family Support. Enroll now!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>

        {/* Urgency Timer Bar */}
        {currentStep === 'chat' && urgencyTimer > 0 && (
          <div style={{
            background: 'linear-gradient(90deg, #dc2626, #ea580c)',
            color: 'white',
            padding: '10px 20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite'
          }}>
            ⏰ EXCLUSIVE OFFER EXPIRES IN: {formatTimer(urgencyTimer)} | LIMITED ENROLLMENT SPOTS AVAILABLE!
          </div>
        )}
        
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderBottom: '3px solid #ea580c',
          padding: '20px 0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #ea580c, #dc2626)', 
                color: 'white', 
                width: '60px', 
                height: '60px', 
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
              }}>
                🌟
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  SINDA SUCCESS ACCELERATOR
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#6b7280', 
                  margin: '5px 0 0 0'
                }}>
                  🚀 15,000+ Families Transformed | 90% Success Rate | Join Now!
                </p>
              </div>
            </div>
            <div style={{ 
              background: '#ea580c',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🔥 ENROLL TODAY: 6298 8775
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Welcome Landing */}
          {currentStep === 'welcome' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '25px', 
              padding: '60px 40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '3px solid #ea580c',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 70%)',
                animation: 'spin 20s linear infinite'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #ea580c, #dc2626)', 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px auto',
                  fontSize: '48px',
                  boxShadow: '0 10px 30px rgba(234, 88, 12, 0.4)'
                }}>
                  🎯
                </div>
                
                <h2 style={{ 
                  fontSize: '48px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0 0 20px 0',
                  background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Transform Your Future
                </h2>
                
                <p style={{ 
                  fontSize: '24px', 
                  color: '#4b5563', 
                  margin: '0 0 30px 0',
                  lineHeight: '1.4'
                }}>
                  Join Singapore's most successful Indian families with SINDA's proven programs
                </p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '20px',
                  margin: '40px 0'
                }}>
                  <div style={{ 
                    background: '#fff7ed', 
                    padding: '25px', 
                    borderRadius: '15px',
                    border: '2px solid #fed7aa'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎓</div>
                    <h4 style={{ color: '#ea580c', fontWeight: 'bold', margin: '0 0 5px 0' }}>90% Success Rate</h4>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Education Excellence</p>
                  </div>
                  <div style={{ 
                    background: '#fff7ed', 
                    padding: '25px', 
                    borderRadius: '15px',
                    border: '2px solid #fed7aa'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
                    <h4 style={{ color: '#ea580c', fontWeight: 'bold', margin: '0 0 5px 0' }}>85% Job Placement</h4>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Career Acceleration</p>
                  </div>
                  <div style={{ 
                    background: '#fff7ed', 
                    padding: '25px', 
                    borderRadius: '15px',
                    border: '2px solid #fed7aa'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>👨‍👩‍👧‍👦</div>
                    <h4 style={{ color: '#ea580c', fontWeight: 'bold', margin: '0 0 5px 0' }}>15,000+ Families</h4>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Served Since 1991</p>
                  </div>
                </div>
                
                <button
                  onClick={handleWelcomeStart}
                  style={{ 
                    background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '20px 50px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(234, 88, 12, 0.4)',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(234, 88, 12, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(234, 88, 12, 0.4)';
                  }}
                >
                  🎯 START MY SUCCESS JOURNEY
                </button>
                
                <p style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  margin: '20px 0 0 0'
                }}>
                  ⚡ Free consultation • Instant eligibility check • No obligation
                </p>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '25px', 
              padding: '50px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
              border: '3px solid #ea580c'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #ea580c, #dc2626)', 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px auto',
                  fontSize: '40px',
                  boxShadow: '0 8px 25px rgba(234, 88, 12, 0.3)'
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
                  margin: '0 0 10px 0'
                }}>
                  Get personalized guidance in your preferred language
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#ea580c',
                  fontWeight: 'bold',
                  margin: '0'
                }}>
                  🔥 Limited Time: Free Enrollment Assessment
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
                      border: '3px solid #fed7aa',
                      background: 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '16px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = '#fff7ed';
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(234, 88, 12, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#fed7aa';
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateY(0)';
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
                      {key === 'english' && 'Start Your Journey'}
                      {key === 'tamil' && 'உங்கள் பயணத்தைத் தொடங்குங்கள்'}
                      {key === 'hindi' && 'अपनी यात्रा शुरू करें'}
                      {key === 'telugu' && 'మీ ప్రయాణాన్ని ప్రారంభించండి'}
                      {key === 'malayalam' && 'നിങ്ങളുടെ യാത്ര ആരംभിക്കുക'}
                    </div>
                    <div style={{
                      background: '#ea580c',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginTop: '10px'
                    }}>
                      🎯 INSTANT ACCESS
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
              boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
              border: '3px solid #ea580c'
            }}>
              
              {/* Enhanced Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                color: 'white',
                padding: '25px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '10px', 
                      borderRadius: '15px',
                      fontSize: '24px'
                    }}>
                      🎯
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        margin: '0'
                      }}>
                        SINDA Success Accelerator
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        opacity: '0.9',
                        margin: '5px 0 0 0'
                      }}>
                        🟢 Your Personal Success Coach • Lead Score: {calculateLeadScore(leadData)}/100
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🔥 {leadData.messagesCount} Messages
                  </div>
                </div>
              </div>

              {/* Service Showcase */}
              <div style={{ 
                background: 'linear-gradient(135deg, #fff7ed 0%, #fef3e7 100%)', 
                padding: '25px',
                borderBottom: '2px solid #fed7aa'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    color: '#ea580c', 
                    fontWeight: 'bold',
                    margin: '0'
                  }}>
                    🚀 Transform Your Life Today:
                  </h4>
                  <div style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }}>
                    LIMITED SPOTS
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {serviceCategories.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setInputMessage(`Tell me about ${service.name}`);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      style={{ 
                        background: 'white',
                        border: '2px solid #fed7aa',
                        borderRadius: '15px',
                        padding: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = '#ea580c';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#fed7aa';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{service.emoji}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '5px'
                      }}>
                        {service.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#dc2626',
                        fontWeight: 'bold'
                      }}>
                        {service.urgency}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      style={{ 
                        background: action.action === 'enroll' ? 'linear-gradient(135deg, #dc2626, #ea580c)' : 'white',
                        color: action.action === 'enroll' ? 'white' : '#ea580c',
                        border: action.action === 'enroll' ? 'none' : '2px solid #ea580c',
                        borderRadius: '25px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        if (action.action === 'enroll') {
                          e.target.style.boxShadow = '0 5px 15px rgba(220, 38, 38, 0.4)';
                          e.target.style.transform = 'translateY(-2px)';
                        } else {
                          e.target.style.background = '#ea580c';
                          e.target.style.color = 'white';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (action.action === 'enroll') {
                          e.target.style.boxShadow = 'none';
                          e.target.style.transform = 'translateY(0)';
                        } else {
                          e.target.style.background = 'white';
                          e.target.style.color = '#ea580c';
                        }
                      }}
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ 
                height: '450px', 
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
                      marginBottom: '20px'
                    }}
                  >
                    <div
                      style={{ 
                        maxWidth: '75%',
                        padding: '15px 20px',
                        borderRadius: '20px',
                        position: 'relative',
                        ...(message.isUser ? {
                          background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                          color: 'white',
                          borderBottomRightRadius: '5px',
                          boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
                        } : message.isSystem ? {
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          borderBottomLeftRadius: '5px',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                        } : {
                          background: 'white',
                          color: '#1f2937',
                          borderBottomLeftRadius: '5px',
                          border: '2px solid #e5e7eb',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                        })
                      }}
                    >
                      <p style={{ 
                        fontSize: '14px', 
                        margin: '0 0 8px 0',
                        lineHeight: '1.5',
                        fontWeight: message.isSystem ? 'bold' : 'normal'
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
                
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ 
                      background: 'white',
                      borderRadius: '20px',
                      borderBottomLeftRadius: '5px',
                      padding: '15px 20px',
                      border: '2px solid #e5e7eb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '6px',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both'
                        }}></div>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.16s'
                        }}></div>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          background: '#ea580c', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.32s'
                        }}></div>
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '12px', 
                          color: '#6b7280',
                          fontWeight: 'bold'
                        }}>
                          Success Coach is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Chat Input */}
              <div style={{ 
                borderTop: '2px solid #e5e7eb',
                background: 'white',
                padding: '25px'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about programs, eligibility, enrollment..."
                    style={{ 
                      flex: '1',
                      border: '2px solid #e5e7eb',
                      borderRadius: '25px',
                      padding: '15px 25px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    style={{ 
                      background: isLoading || !inputMessage.trim() ? '#d1d5db' : 'linear-gradient(135deg, #ea580c, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      transition: 'all 0.3s ease',
                      boxShadow: !isLoading && inputMessage.trim() ? '0 4px 15px rgba(234, 88, 12, 0.3)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading && inputMessage.trim()) {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading && inputMessage.trim()) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(234, 88, 12, 0.3)';
                      }
                    }}
                  >
                    🚀
                  </button>
                </div>
                
                <div style={{ 
                  marginTop: '15px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  💡 Ask about: Enrollment process • Program benefits • Eligibility • Success stories
                </div>
              </div>
            </div>
          )}

          {/* Enrollment Form Modal */}
          {showEnrollmentForm && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1000'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '25px',
                padding: '40px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80%',
                overflowY: 'auto',
                border: '3px solid #ea580c',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    fontSize: '36px'
                  }}>
                    🎉
                  </div>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 10px 0'
                  }}>
                    Join SINDA Today!
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    🚀 Fast-track your success with priority enrollment
                  </p>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={leadData.name}
                    onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Primary Interest
                  </label>
                  <select
                    value={leadData.primaryNeeds[0] || ''}
                    onChange={(e) => setLeadData(prev => ({ ...prev, primaryNeeds: [e.target.value] }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Select your primary interest</option>
                    <option value="education">Educational Support</option>
                    <option value="career">Career Development</option>
                    <option value="family">Family Services</option>
                    <option value="financial">Financial Assistance</option>
                    <option value="youth">Youth Programs</option>
                    <option value="senior">Senior Care</option>
                  </select>
                </div>

                <div style={{ 
                  display: 'flex',
                  gap: '15px',
                  marginTop: '30px'
                }}>
                  <button
                    onClick={() => setShowEnrollmentForm(false)}
                    style={{
                      flex: '1',
                      padding: '15px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleEnrollmentSubmit}
                    disabled={!leadData.name || !leadData.email || !leadData.phone}
                    style={{
                      flex: '2',
                      padding: '15px',
                      border: 'none',
                      borderRadius: '10px',
                      background: leadData.name && leadData.email && leadData.phone 
                        ? 'linear-gradient(135deg, #ea580c, #dc2626)' 
                        : '#d1d5db',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: leadData.name && leadData.email && leadData.phone ? 'pointer' : 'not-allowed',
                      boxShadow: leadData.name && leadData.email && leadData.phone 
                        ? '0 4px 15px rgba(234, 88, 12, 0.3)' 
                        : 'none'
                    }}
                  >
                    🚀 Enroll Now
                  </button>
                </div>

                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  marginTop: '20px',
                  lineHeight: '1.4'
                }}>
                  ✅ Free consultation included • No obligation • Instant program access • 30-day satisfaction guarantee
                </p>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1000'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '25px',
                padding: '50px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
                border: '3px solid #10b981',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px auto',
                  fontSize: '48px'
                }}>
                  ✅
                </div>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  Welcome to SINDA!
                </h3>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  margin: '0 0 30px 0',
                  lineHeight: '1.5'
                }}>
                  🎉 Your enrollment is confirmed! Our program specialist will contact you within 24 hours to begin your success journey.
                </p>
                <div style={{
                  background: '#f0fdf4',
                  border: '2px solid #10b981',
                  borderRadius: '15px',
                  padding: '20px',
                  marginBottom: '30px'
                }}>
                  <h4 style={{ color: '#059669', margin: '0 0 10px 0' }}>What happens next:</h4>
                  <ul style={{ 
                    textAlign: 'left', 
                    color: '#374151',
                    fontSize: '14px',
                    margin: '0',
                    paddingLeft: '20px'
                  }}>
                    <li>Personal consultation call within 24 hours</li>
                    <li>Customized program recommendations</li>
                    <li>Immediate access to member resources</li>
                    <li>Welcome package with exclusive benefits</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Contact Section */}
          <div style={{ 
            marginTop: '40px',
            background: 'white',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
            border: '3px solid #ea580c',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              background: 'linear-gradient(135deg, #ea580c, #dc2626)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              transform: 'rotate(15deg)',
              boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
            }}>
              🔥 CALL NOW!
            </div>
            
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 25px 0',
              textAlign: 'center'
            }}>
              🚀 Ready to Transform Your Future?
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '25px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #fff7ed, #fef3e7)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #fed7aa',
                textAlign: 'center'
              }}>
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    margin: '0 0 8px 0',
                    color: '#ea580c'
                  }}>
                    🔥 Priority Hotline
                  </h4>
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 5px 0'
                  }}>
                    6298 8775
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    Instant enrollment assistance
                  </p>
                </div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #fff7ed, #fef3e7)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #fed7aa',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>✉️</span>
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    margin: '0 0 8px 0',
                    color: '#ea580c'
                  }}>
                    Fast Response Email
                  </h4>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 5px 0'
                  }}>
                    success@sinda.org.sg
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    24-hour response guarantee
                  </p>
                </div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #fff7ed, #fef3e7)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #fed7aa',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>📍</span>
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    margin: '0 0 8px 0',
                    color: '#ea580c'
                  }}>
                    Visit Our Success Center
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 5px 0'
                  }}>
                    1 Beatty Road, Singapore 209943
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    Walk-ins welcome • Free consultation
                  </p>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #ea580c)',
              color: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
            }}>
              <h4 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 10px 0'
              }}>
                🎯 Don't Wait - Your Success Starts Today!
              </h4>
              <p style={{
                fontSize: '14px',
                margin: '0 0 15px 0',
                opacity: '0.9'
              }}>
                Join thousands of successful families. Limited enrollment spots available.
              </p>
              <button
                onClick={() => triggerEnrollment()}
                style={{
                  background: 'white',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                🚀 ENROLL NOW - FREE CONSULTATION
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}
