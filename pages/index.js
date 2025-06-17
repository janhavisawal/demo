// pages/index.js
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
