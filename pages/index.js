// pages/index.js - SINDA Community Support Chatbot (Help-Focused)
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [userNeeds, setUserNeeds] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const messagesEndRef = useRef(null);

  // Community Member Data
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    familySize: '',
    primaryConcern: '',
    urgencyLevel: '',
    preferredLanguage: 'english',
    helpRequested: [],
    sessionTime: new Date().toISOString(),
    conversationSummary: ''
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: 'Hello! Welcome to SINDA. I\'m here to help you navigate our community support services. Whether you need educational assistance, family support, or guidance on any challenges you\'re facing, I\'m here to listen and help you find the right resources.',
      assistance: 'What kind of support are you looking for today?'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'வணக்கம்! SINDA வில் உங்களை வரவேற்கிறோம். எங்கள் சமூக ஆதரவு சேவைகளை நீங்கள் பயன்படுத்த உதவ நான் இங்கே இருக்கிறேன். உங்களுக்கு கல்வி உதவி, குடும்ப ஆதரவு அல்லது ஏதேனும் சவால்களில் வழிகாட்டுதல் தேவையானால், நான் கேட்டு உங்களுக்கு சரியான வளங்களை கண்டுபிடிக்க உதவுவேன்.',
      assistance: 'இன்று உங்களுக்கு எந்த வகையான ஆதரவு தேவை?'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'नमस्ते! SINDA में आपका स्वागत है। मैं यहाँ आपको हमारी सामुदायिक सहायता सेवाओं में मार्गदर्शन करने के लिए हूँ। चाहे आपको शैक्षिक सहायता, पारिवारिक सहारा, या आपके सामने आने वाली किसी भी चुनौती में मार्गदर्शन चाहिए, मैं सुनने और सही संसाधन खोजने में आपकी मदद करने के लिए यहाँ हूँ।',
      assistance: 'आज आपको किस प्रकार की सहायता चाहिए?'
    },
    telugu: { 
      name: 'తెలుగు', 
      greeting: 'నమస్కారం! SINDA కి స్వాగతం. మా కమ్యూనిటీ సపోర్ట్ సేవలను నావిగేట్ చేయడంలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీకు విద్యా సహాయం, కుటుంబ మద్దతు లేదా మీరు ఎదుర్కొంటున్న ఏవైనా సవాళ్లపై మార్గదర్శనం అవసరమైతే, నేను వినడానికి మరియు సరైన వనరులను కనుగొనడంలో మీకు సహాయపడటానికి ఇక్కడ ఉన్నాను.',
      assistance: 'ఈరోజు మీకు ఎలాంటి మద్దతు అవసరం?'
    },
    malayalam: { 
      name: 'മലയാളം', 
      greeting: 'നമസ്കാരം! SINDA യിലേക്ക് സ്വാഗതം. ഞങ്ങളുടെ കമ്മ്യൂണിറ്റി സപ്പോർട്ട് സേവനങ്ങൾ നാവിഗേറ്റ് ചെയ്യാൻ നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. നിങ്ങൾക്ക് വിദ്യാഭ്യാസ സഹായം, കുടുംബ പിന്തുണ, അല്ലെങ്കിൽ നിങ്ങൾ അഭിമുഖീകരിക്കുന്ന ഏതെങ്കിലും വെല്ലുവിളികളിൽ മാർഗനിർദേശം ആവശ്യമുണ്ടെങ്കിൽ, കേൾക്കാനും ശരിയായ വിഭവങ്ങൾ കണ്ടെത്താൻ സഹായിക്കാനും ഞാൻ ഇവിടെയുണ്ട്.',
      assistance: 'ഇന്ന് നിങ്ങൾക്ക് എന്ത് തരത്തിലുള്ള പിന്തുണയാണ് വേണ്ടത്?'
    }
  };

  const supportAreas = [
    { 
      id: 'education', 
      name: 'Educational Support', 
      emoji: '📚', 
      description: 'Tuition assistance, study materials, academic guidance',
      examples: ['Need help with school fees', 'Looking for tuition classes', 'Academic counseling']
    },
    { 
      id: 'financial', 
      name: 'Financial Assistance', 
      emoji: '💰', 
      description: 'Emergency aid, grants, financial counseling',
      examples: ['Urgent financial help needed', 'Medical expense assistance', 'Utility bill support']
    },
    { 
      id: 'family', 
      name: 'Family Support', 
      emoji: '👨‍👩‍👧‍👦', 
      description: 'Family counseling, parenting support, relationship guidance',
      examples: ['Family counseling needed', 'Parenting challenges', 'Marriage guidance']
    },
    { 
      id: 'employment', 
      name: 'Employment Help', 
      emoji: '💼', 
      description: 'Job search assistance, skills training, career guidance',
      examples: ['Looking for job opportunities', 'Need skills training', 'Career change guidance']
    },
    { 
      id: 'elderly', 
      name: 'Elderly Care', 
      emoji: '👴👵', 
      description: 'Senior citizen support, healthcare, social activities',
      examples: ['Elderly parent care', 'Senior health support', 'Social activities for seniors']
    },
    { 
      id: 'youth', 
      name: 'Youth Programs', 
      emoji: '🌟', 
      description: 'Youth development, mentorship, leadership programs',
      examples: ['Youth mentorship', 'Leadership programs', 'Teen guidance']
    },
    { 
      id: 'crisis', 
      name: 'Crisis Support', 
      emoji: '🚨', 
      description: 'Emergency assistance, crisis counseling, immediate help',
      examples: ['Emergency situation', 'Need immediate help', 'Crisis counseling']
    },
    { 
      id: 'legal', 
      name: 'Legal Guidance', 
      emoji: '⚖️', 
      description: 'Legal advice, documentation help, rights awareness',
      examples: ['Legal advice needed', 'Documentation help', 'Know my rights']
    }
  ];

  const quickHelp = [
    { text: 'I need urgent help', type: 'crisis', priority: 'high' },
    { text: 'Financial difficulties', type: 'financial', priority: 'high' },
    { text: 'Family problems', type: 'family', priority: 'medium' },
    { text: 'Educational support', type: 'education', priority: 'medium' },
    { text: 'Job-related help', type: 'employment', priority: 'medium' },
    { text: 'Just have questions', type: 'general', priority: 'low' }
  ];

  // Track conversation flow and user information
  const [conversationStage, setConversationStage] = useState('greeting'); // greeting, understanding, gathering, helping, connecting
  const [userInfo, setUserInfo] = useState({
    name: '',
    situation: '',
    urgency: '',
    supportType: '',
    details: '',
    familyInfo: '',
    currentStep: 0
  });

  // Step-by-step conversation flow
  const getNextQuestion = (stage, userResponse, currentInfo) => {
    const responses = {
      greeting: [
        "Hi there! I'm here to listen and help. What's your name?",
        "Thank you for reaching out to SINDA. Could you tell me your name so I can assist you better?"
      ],
      getName: [
        `Nice to meet you, ${currentInfo.name}. I'm here to support you. Can you tell me a bit about what's been on your mind lately?`,
        `Hello ${currentInfo.name}, I'm glad you're here. What would you like to talk about today?`
      ],
      understanding: [
        "I can hear that this is important to you. Can you tell me a bit more about your current situation?",
        "Thank you for sharing that with me. How long has this been a concern for you?",
        "I understand. Are you dealing with this alone, or do you have family support?"
      ],
      familyContext: [
        "That helps me understand better. Do you have children or elderly family members who might also be affected?",
        "I see. What's your family situation like - are you the main person handling this?",
        "How is this situation affecting your daily life and your family?"
      ],
      urgency: [
        "I want to make sure I help you in the right way. Is this something you need immediate help with, or can we work on it step by step?",
        "How urgent would you say this situation is for you and your family?",
        "Are you in a safe situation right now? Do you need immediate assistance?"
      ],
      specific_help: [
        "Based on what you've shared, I think I can help connect you with the right support. What kind of help would be most useful for you right now?",
        "Let me see how SINDA can best support you. What would make the biggest difference in your situation?",
        "I'm thinking about how to help you best. Would you like to know about the specific programs we have that might help?"
      ],
      next_steps: [
        "I'd like to connect you with one of our counselors who can provide more detailed help. Would you like me to arrange that?",
        "Based on everything you've shared, I think you could really benefit from speaking with our specialist team. Shall I help you set that up?",
        "You've been very brave to reach out. Would you like me to have someone from our team call you to discuss the next steps?"
      ]
    };
    
    return responses[stage] ? responses[stage][Math.floor(Math.random() * responses[stage].length)] : "How can I help you further?";
  };

  // Enhanced conversation handler
  const handleConversationFlow = (userMessage) => {
    const message = userMessage.toLowerCase();
    let nextStage = conversationStage;
    let response = "";
    let updatedInfo = { ...userInfo };

    switch (conversationStage) {
      case 'greeting':
        if (message.length > 2) {
          updatedInfo.name = userMessage.split(' ')[0]; // Extract first word as name
          nextStage = 'getName';
          response = getNextQuestion('getName', userMessage, updatedInfo);
        } else {
          response = "I'd love to know what to call you. What's your name?";
        }
        break;

      case 'getName':
        updatedInfo.situation = userMessage;
        nextStage = 'understanding';
        
        // Immediate crisis detection
        if (message.includes('urgent') || message.includes('emergency') || message.includes('crisis') || message.includes('help now')) {
          response = `${updatedInfo.name}, I can hear this is urgent. Are you in immediate danger or need emergency help right now?`;
          nextStage = 'crisis';
        } else {
          response = getNextQuestion('understanding', userMessage, updatedInfo);
        }
        break;

      case 'understanding':
        updatedInfo.details = userMessage;
        nextStage = 'familyContext';
        response = getNextQuestion('familyContext', userMessage, updatedInfo);
        break;

      case 'familyContext':
        updatedInfo.familyInfo = userMessage;
        nextStage = 'urgency';
        response = getNextQuestion('urgency', userMessage, updatedInfo);
        break;

      case 'urgency':
        updatedInfo.urgency = userMessage;
        nextStage = 'specific_help';
        
        if (message.includes('urgent') || message.includes('immediate') || message.includes('now')) {
          response = `I understand this is urgent, ${updatedInfo.name}. Let me help you right away. For immediate assistance, you can call our 24/7 helpline at 6298 8775. Would you also like me to have someone call you back today?`;
        } else {
          response = getNextQuestion('specific_help', userMessage, updatedInfo);
        }
        break;

      case 'specific_help':
        updatedInfo.supportType = userMessage;
        nextStage = 'next_steps';
        
        // Provide specific help based on their needs
        if (message.includes('education') || message.includes('school') || message.includes('study')) {
          response = `${updatedInfo.name}, I can definitely help with educational support. We have tuition assistance, study programs, and academic counseling. Would you like me to connect you with our education team?`;
        } else if (message.includes('money') || message.includes('financial') || message.includes('bill')) {
          response = `I understand financial stress can be overwhelming, ${updatedInfo.name}. We have emergency assistance and financial counseling available. Shall I arrange for our financial counselor to speak with you?`;
        } else if (message.includes('family') || message.includes('marriage') || message.includes('relationship')) {
          response = `Family challenges can be really difficult, ${updatedInfo.name}. We offer free family counseling and support. Would you like me to set up a consultation for you?`;
        } else {
          response = getNextQuestion('next_steps', userMessage, updatedInfo);
        }
        break;

      case 'next_steps':
        response = `Thank you for sharing so much with me, ${updatedInfo.name}. Based on everything you've told me, I think our team can really help you. I'll arrange for one of our specialists to call you within 24 hours. In the meantime, remember you can always call 6298 8775 if you need immediate support. Is there anything else you'd like to know right now?`;
        nextStage = 'complete';
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
        response = getNextQuestion('understanding', userMessage, updatedInfo);
    }

    setUserInfo(updatedInfo);
    setConversationStage(nextStage);
    return response;
  };

  // Simplified AI query that focuses on step-by-step conversation
  const queryMistralAI = async (userMessage) => {
    try {
      // Use conversation flow logic first
      const flowResponse = handleConversationFlow(userMessage);
      if (flowResponse) {
        return flowResponse;
      }

      // Fallback to AI for complex responses
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a caring SINDA counselor having a gentle conversation. 

              Current conversation stage: ${conversationStage}
              User's name: ${userInfo.name}
              What they've shared: ${userInfo.situation}

              RESPOND LIKE A HUMAN COUNSELOR:
              1. Be warm and empathetic
              2. Ask ONE simple question at a time
              3. Keep responses short (1-2 sentences max)
              4. Focus on understanding their feelings
              5. Don't give long lists or detailed information yet
              6. Gradually learn about their situation

              CONVERSATION STYLE:
              - "I can hear that's been difficult for you..."
              - "Tell me more about..."
              - "How has this been affecting you?"
              - "That sounds really challenging..."
              - "I'm here to listen..."

              Give ONE short, caring response that moves the conversation forward naturally.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 50,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        return handleConversationFlow(userMessage);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || handleConversationFlow(userMessage);
      
      return aiResponse;
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return handleConversationFlow(userMessage);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, isUser = false, isHelper = false) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      isHelper,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, message]);
  };

  const handleWelcomeStart = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setMemberData(prev => ({ ...prev, preferredLanguage: langKey }));
    
    // Start with a simple, personal greeting
    addMessage("Hello! I'm here to listen and help you with whatever you're going through. What's your name?", false, true);
    setConversationStage('greeting');
    setCurrentStep('chat');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    // Identify user needs from message
    const message = userMessage.toLowerCase();
    const identifiedNeeds = [];
    
    if (message.includes('urgent') || message.includes('emergency') || message.includes('crisis')) {
      identifiedNeeds.push('crisis');
    }
    if (message.includes('money') || message.includes('financial') || message.includes('bill') || message.includes('rent')) {
      identifiedNeeds.push('financial');
    }
    if (message.includes('job') || message.includes('work') || message.includes('employment')) {
      identifiedNeeds.push('employment');
    }
    if (message.includes('family') || message.includes('marriage') || message.includes('children')) {
      identifiedNeeds.push('family');
    }
    if (message.includes('school') || message.includes('education') || message.includes('study')) {
      identifiedNeeds.push('education');
    }

    setUserNeeds(prev => [...new Set([...prev, ...identifiedNeeds])]);

    try {
      const aiResponse = await queryMistralAI(userMessage);
      setTimeout(() => {
        addMessage(aiResponse, false, true);
        setIsLoading(false);
        
        // Offer additional help if they seem to need support
        if (identifiedNeeds.includes('crisis')) {
          setTimeout(() => {
            addMessage("If this is an urgent situation, please don't hesitate to call our 24/7 helpline at 6298 8775 immediately. Our crisis counselors are trained to provide immediate support.", false, true);
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        addMessage("I want to make sure you get the support you need. Please call our helpline at 6298 8775 where our trained counselors can provide immediate assistance.", false, true);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleQuickHelp = (help) => {
    setInputMessage(help.text);
    setMemberData(prev => ({ 
      ...prev, 
      primaryConcern: help.type,
      urgencyLevel: help.priority 
    }));
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSupportAreaClick = (area) => {
    const message = `I need help with ${area.name.toLowerCase()}`;
    setInputMessage(message);
    setMemberData(prev => ({ 
      ...prev, 
      helpRequested: [...new Set([...prev.helpRequested, area.id])]
    }));
    setTimeout(() => handleSendMessage(), 100);
  };

  const showContactDialog = () => {
    setShowContactForm(true);
    addMessage("I'd like to make sure you can reach the right person for your specific situation. Let me gather some basic information to connect you with the most appropriate counselor.", false, true);
  };

  const handleContactSubmit = () => {
    console.log('Support Request Submitted:', memberData);
    setShowContactForm(false);
    addMessage("Thank you! I've noted your information. A SINDA counselor will contact you within 24 hours to provide personalized assistance. In the meantime, if you have any urgent needs, please call 6298 8775.", false, true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | Here to Help You</title>
        <meta name="description" content="SINDA provides caring community support for Indian families in Singapore. Get help with education, family, financial, and personal challenges." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderBottom: '2px solid #0ea5e9',
          padding: '20px 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
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
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                color: 'white', 
                width: '60px', 
                height: '60px', 
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}>
                🤝
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0'
                }}>
                  SINDA Community Support
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#6b7280', 
                  margin: '5px 0 0 0'
                }}>
                  💙 Here to help you through life's challenges
                </p>
              </div>
            </div>
            <div style={{ 
              background: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🚨 Crisis Helpline: 6298 8775
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '25px', 
              padding: '60px 40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '2px solid #0ea5e9',
              textAlign: 'center'
            }}>
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
                boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)'
              }}>
                💙
              </div>
              
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                margin: '0 0 20px 0'
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
                marginRight: 'auto'
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
                marginRight: 'auto'
              }}>
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: '30px 20px', 
                  borderRadius: '15px',
                  border: '2px solid #bae6fd'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤗</div>
                  <h4 style={{ color: '#0284c7', fontWeight: 'bold', margin: '0 0 5px 0' }}>Caring Support</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Empathetic assistance</p>
                </div>
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: '30px 20px', 
                  borderRadius: '15px',
                  border: '2px solid #bae6fd'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
                  <h4 style={{ color: '#0284c7', fontWeight: 'bold', margin: '0 0 5px 0' }}>Community Focus</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Understanding your culture</p>
                </div>
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: '30px 20px', 
                  borderRadius: '15px',
                  border: '2px solid #bae6fd'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌟</div>
                  <h4 style={{ color: '#0284c7', fontWeight: 'bold', margin: '0 0 5px 0' }}>Real Solutions</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Practical help available</p>
                </div>
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
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)';
                }}
              >
                💙 Get Support Now
              </button>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#9ca3af',
                margin: '20px 0 0 0'
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
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '2px solid #0ea5e9'
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
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)'
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
                      border: '2px solid #bae6fd',
                      background: 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '16px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.background = '#f0f9ff';
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#bae6fd';
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
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '2px solid #0ea5e9'
            }}>
              
              {/* Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: 'white',
                padding: '25px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '10px', 
                      borderRadius: '15px',
                      fontSize: '24px'
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
                    onClick={showContactDialog}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
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
                borderBottom: '1px solid #e0f2fe'
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '15px',
                  marginBottom: '25px'
                }}>
                  {quickHelp.map((help, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickHelp(help)}
                      style={{ 
                        background: help.priority === 'high' ? '#fef2f2' : 'white',
                        border: help.priority === 'high' ? '2px solid #f87171' : '2px solid #bae6fd',
                        borderRadius: '15px',
                        padding: '15px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: help.priority === 'high' ? '#dc2626' : '#0284c7'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
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
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2)';
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
                          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                          color: 'white',
                          borderBottomRightRadius: '5px'
                        } : message.isHelper ? {
                          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                          color: 'white',
                          borderBottomLeftRadius: '5px'
                        } : {
                          background: 'white',
                          color: '#1f2937',
                          borderBottomLeftRadius: '5px',
                          border: '2px solid #e5e7eb'
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
                          width: '8px', 
                          height: '8px', 
                          background: '#0ea5e9', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both'
                        }}></div>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#0ea5e9', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.16s'
                        }}></div>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#0ea5e9', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.32s'
                        }}></div>
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '12px', 
                          color: '#6b7280'
                        }}>
                          Support helper is listening...
                        </span>
                      </div>
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
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind... we're here to listen"
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
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
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
                      background: isLoading || !inputMessage.trim() ? '#d1d5db' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading && inputMessage.trim()) {
                        e.target.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading && inputMessage.trim()) {
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
                border: '2px solid #0ea5e9',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
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
                    fontSize: '36px'
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
                    value={memberData.name}
                    onChange={(e) => setMemberData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
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
                    value={memberData.phone}
                    onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
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
                    value={memberData.urgencyLevel}
                    onChange={(e) => setMemberData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
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
                    value={memberData.primaryConcern}
                    onChange={(e) => setMemberData(prev => ({ ...prev, primaryConcern: e.target.value }))}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Feel free to share what kind of support you're looking for..."
                  />
                </div>

                <div style={{ 
                  display: 'flex',
                  gap: '15px',
                  marginTop: '25px'
                }}>
                  <button
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: '1',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContactSubmit}
                    disabled={!memberData.name || !memberData.phone}
                    style={{
                      flex: '2',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '10px',
                      background: memberData.name && memberData.phone 
                        ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                        : '#d1d5db',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: memberData.name && memberData.phone ? 'pointer' : 'not-allowed'
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
                  support@sinda.org.sg
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
                margin: '0',
                lineHeight: '1.4'
              }}>
                SINDA has been supporting families like yours since 1991. Whatever challenges you're facing, our caring team is here to help you find solutions and move forward with confidence.
              </p>
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
        `}</style>
      </div>
    </>
  );
}
