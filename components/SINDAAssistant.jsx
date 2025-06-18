import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, MessageCircle, Users, Globe, AlertTriangle, 
  BarChart3, Shield, Settings, Download, TrendingUp,
  Clock, MapPin, DollarSign, Calendar, Activity,
  Eye, Target, Zap, Lock, CheckCircle, XCircle, 
  BookOpen, Heart, Home, Phone, Mail, Star,
  GraduationCap, HandHeart, Award, UserCheck,
  ChevronRight, Info, HelpCircle, ArrowRight, Waves,
  PieChart, LineChart, BarChart, TrendingDown
} from 'lucide-react';
import { LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, Line } from 'recharts';

const SINDAAssistant = () => {
  const [currentView, setCurrentView] = useState('chat');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [userIsScrolling, setUserIsScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Analytics Data
  const [analyticsData] = useState({
    realTimeMetrics: {
      activeUsers: 247,
      messagesPerMinute: 18,
      responseTime: 0.8,
      resolutionRate: 96.7
    },
    intentAccuracy: 98.2,
    userSatisfaction: 97.5,
    totalServed: 12847,
    monthlyEngagement: [
      { month: 'Jan', users: 820, programs: 245, assistance: 89000 },
      { month: 'Feb', users: 950, programs: 287, assistance: 102000 },
      { month: 'Mar', users: 1100, programs: 324, assistance: 125000 },
      { month: 'Apr', users: 890, programs: 298, assistance: 98000 },
      { month: 'May', users: 1250, programs: 356, assistance: 145000 },
      { month: 'Jun', users: 1380, programs: 398, assistance: 167000 }
    ],
    programDistribution: [
      { name: 'Education Support', value: 42, count: 5234, color: '#3B82F6' },
      { name: 'Family Services', value: 28, count: 3489, color: '#06B6D4' },
      { name: 'Youth Development', value: 18, count: 2245, color: '#6366F1' },
      { name: 'Community Outreach', value: 12, count: 1496, color: '#14B8A6' }
    ],
    helpMetrics: {
      totalFamiliesHelped: 8456,
      emergencySupport: 234,
      scholarshipsAwarded: 1834,
      jobPlacements: 567,
      counselingSessions: 3421,
      financialAidDistributed: 2100000
    }
  });

  // Language support
  const languages = {
    english: { 
      name: 'English', 
      native: 'English',
      greeting: 'Welcome to SINDA! 🙏 I\'m here to help you discover our programs and guide you through your journey with us.',
      flag: '🇬🇧'
    },
    tamil: { 
      name: 'Tamil', 
      native: 'தமிழ்',
      greeting: 'SINDA வில் உங்களை வரவேற்கிறோம்! 🙏 நான் உங்கள் பயணத்தில் உதவ இங்கே இருக்கிறேன்.',
      flag: '🇮🇳'
    },
    hindi: { 
      name: 'Hindi', 
      native: 'हिंदी',
      greeting: 'SINDA में आपका स्वागत है! 🙏 मैं आपकी यात्रा में सहायता के लिए यहाँ हूँ।',
      flag: '🇮🇳'
    },
    malayalam: {
      name: 'Malayalam',
      native: 'മലയാളം',
      greeting: 'SINDA യിലേക്ക് സ്വാഗതം! 🙏 നിങ്ങളുടെ യാത്രയിൽ സഹായിക്കാൻ ഞാനിവിടെയുണ്ട്.',
      flag: '🇮🇳'
    }
  };

  // Program Categories
  const programCategories = [
    {
      id: 'education',
      title: 'Education Programs',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Academic support from pre-school to tertiary education',
      count: '8 Programs'
    },
    {
      id: 'family',
      title: 'Family Services',
      icon: Heart,
      color: 'from-cyan-500 to-teal-600',
      description: 'Counselling, financial aid, and family support',
      count: '5 Services'
    },
    {
      id: 'youth',
      title: 'Youth Development',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Leadership and skills development for ages 18-35',
      count: '4 Programs'
    },
    {
      id: 'community',
      title: 'Community Outreach',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Bringing SINDA services to your neighborhood',
      count: '6 Initiatives'
    }
  ];

  // Quick Help Options
  const quickHelp = [
    { text: 'Apply for STEP tuition', category: 'education' },
    { text: 'Financial assistance eligibility', category: 'family' },
    { text: 'Join Youth Club', category: 'youth' },
    { text: 'Emergency support', category: 'family' }
  ];

  // Intent Recognition
  const [detectedIntents, setDetectedIntents] = useState([]);

  // Handle scroll detection to prevent auto-scroll during user interaction
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      // If user scrolls up, set userIsScrolling to true
      if (!isNearBottom) {
        setUserIsScrolling(true);
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Reset userIsScrolling after 3 seconds of no scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          setUserIsScrolling(false);
        }, 3000);
      } else {
        setUserIsScrolling(false);
      }
    }
  }, []);

  // Auto-scroll only when new messages are added and user is not scrolling
  useEffect(() => {
    if (messages.length > 0 && !userIsScrolling && messagesEndRef.current) {
      // Use a longer delay to ensure DOM has updated
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "end" 
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, userIsScrolling]); // Only depend on messages.length, not the full messages array

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Input handling with debounce to prevent flickering
  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Program responses
  const getProgramResponse = (programId) => {
    const responses = {
      education: `📚 **Education Programs at SINDA**

**STEP Tuition Programme:**
- Subsidized tuition for students from Pre-Primary to Pre-University
- Small class sizes (1:4 ratio for Primary, 1:6 for Secondary)
- Monthly fees from $30-50 (heavily subsidized)

**A-Level Support:**
- Specialized coaching for A-Level subjects
- University application guidance

**Eligibility:** Singapore Citizens/PRs of Indian descent with monthly per capita income ≤ $1,600

**How to Apply:** Visit our centers or call 1800 295 3333`,

      family: `❤️ **Family Services at SINDA**

**Family Service Centre (FSC):**
- Professional counseling services
- Family therapy and mediation
- Crisis intervention support

**Financial Assistance:**
- Emergency financial aid
- Monthly financial support
- Utility bill assistance

**Crisis Support:**
- 24/7 emergency hotline: 1800 295 3333
- Immediate intervention services

**Eligibility:** Open to all, with priority for Singapore Citizens/PRs of Indian descent`,

      youth: `🌟 **Youth Development Programs**

**SINDA Youth Club:**
- Ages 18-35 leadership development
- Life skills workshops
- Community service projects

**Mentoring Programs:**
- One-on-one career mentoring
- Interview skills training

**Employment Support:**
- Job placement assistance
- Career counseling

Ready to join our youth community? Contact us for upcoming events!`,

      community: `🌍 **Community Outreach Initiatives**

**Door Knocking Programme:**
- Proactive community engagement
- Home visits to identify needs

**SINDA Mobile Bus:**
- Bringing services to your neighborhood
- Information sessions in void decks

**Community Events:**
- Cultural celebrations and festivals
- Educational workshops

**Getting Involved:**
- Volunteer registration: volunteers@sinda.org.sg
- Follow our social media for announcements`
    };
    return responses[programId] || "I'd be happy to help you learn more about our programs. Please contact us directly for the most current information.";
  };

  // Program click handler
  const handleProgramClick = useCallback(async (programCategory) => {
    addMessage(`Tell me about ${programCategory.title}`, true);
    setIsTyping(true);

    setTimeout(() => {
      const response = getProgramResponse(programCategory.id);
      addMessage(response, false, { 
        source: 'sinda.org.sg',
        programCategory: programCategory.id,
        intentConfidence: 0.95 
      });
      setIsTyping(false);
    }, 1500);
  }, []);

  // Intent recognition
  const recognizeIntent = useCallback((message) => {
    const intents = {
      'apply_program': { keywords: ['apply', 'application', 'register', 'sign up', 'join'], confidence: 0.95 },
      'check_eligibility': { keywords: ['eligible', 'qualify', 'requirements', 'criteria'], confidence: 0.92 },
      'program_info': { keywords: ['tell me about', 'what is', 'information', 'details'], confidence: 0.89 },
      'financial_help': { keywords: ['money', 'financial', 'assistance', 'help', 'emergency'], confidence: 0.96 },
      'urgent_crisis': { keywords: ['emergency', 'urgent', 'crisis', 'immediate', 'desperate'], confidence: 0.98 }
    };

    const detected = [];
    Object.entries(intents).forEach(([intent, data]) => {
      const matches = data.keywords.filter(keyword => 
        message.toLowerCase().includes(keyword)
      );
      if (matches.length > 0) {
        detected.push({
          intent,
          confidence: data.confidence,
          matchedKeywords: matches
        });
      }
    });

    setDetectedIntents(detected);
    return { intents: detected };
  }, []);

  // Add message - optimized to prevent unnecessary re-renders
  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    setMessages(prev => {
      const newMessage = {
        id: messageId,
        content,
        isUser,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          ...metadata,
          responseTime: isUser ? null : Math.random() * 2 + 0.5,
          intentConfidence: metadata.intentConfidence || null
        }
      };
      return [...prev, newMessage];
    });
    setMessageId(prev => prev + 1);
  }, [messageId]);

  // Send message - optimized to prevent input flickering
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    const analysis = recognizeIntent(userMessage);
    
    // Clear input immediately to prevent flickering
    setInputMessage('');
    
    // Focus back on input to maintain cursor position
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    addMessage(userMessage, true, { 
      intents: analysis.intents
    });
    setIsTyping(true);

    setTimeout(() => {
      let response = "Thank you for reaching out to SINDA! I'm here to help you find the right support for your needs.";
      
      if (analysis.intents.length > 0) {
        const primaryIntent = analysis.intents[0];
        
        switch (primaryIntent.intent) {
          case 'apply_program':
            response = "I'd be happy to guide you through our application process! To get started, could you tell me which program interests you most? We have education support (STEP tuition), family services, youth programs, or community initiatives.";
            break;
          case 'check_eligibility':
            response = "Great question! Most SINDA programs are for Singapore citizens/PRs of Indian descent with a per capita income ≤ $1,600. Could you tell me about your household situation so I can provide more specific guidance?";
            break;
          case 'financial_help':
            response = "SINDA offers various financial assistance including emergency aid, monthly support, and bill payment help. Our Family Service Centre can assess your needs. Would you like me to connect you with our financial assistance team?";
            break;
          case 'urgent_crisis':
            response = "🚨 For immediate crisis support, please call SINDA right away at 1800 295 3333. Our team is available to provide emergency assistance. You can also visit us at 1 Beatty Road.";
            break;
          default:
            response = "I can help you explore SINDA's programs in education, family support, youth development, and community services. What specific area interests you today?";
        }
      }

      addMessage(response, false, { 
        intentConfidence: analysis.intents[0]?.confidence || 0.8,
        responseGenerated: true 
      });
      setIsTyping(false);
    }, Math.random() * 1000 + 1200);
  }, [inputMessage, isTyping, addMessage, recognizeIntent]);

  // Key press handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl">
          <BookOpen className="text-white" size={40} />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SINDA</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your AI-powered guide to Singapore Indian Development Association programs and services. 
          Building stronger communities together since 1991.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600">30+</div>
            <div className="text-sm text-gray-600 mt-1">Years Serving</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-100">
            <div className="text-3xl font-bold text-cyan-600">12K+</div>
            <div className="text-sm text-gray-600 mt-1">Families Helped</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="text-3xl font-bold text-indigo-600">25+</div>
            <div className="text-sm text-gray-600 mt-1">Programs</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
            <div className="text-3xl font-bold text-teal-600">24/7</div>
            <div className="text-sm text-gray-600 mt-1">Support</div>
          </div>
        </div>

        <button
          onClick={() => setCurrentStep('language')}
          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          Start Your Journey
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  // Language Selection
  const LanguageSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Language</h2>
        <p className="text-lg text-gray-600 mb-12">Select your preferred language to continue</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(languages).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLanguage(key);
                setCurrentStep('chat');
                setTimeout(() => addMessage(lang.greeting, false), 500);
              }}
              className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:transform hover:scale-110"
            >
              <div className="text-4xl mb-4">{lang.flag}</div>
              <div className="text-xl font-bold text-gray-800 mb-2">
                {lang.native}
              </div>
              <div className="text-sm text-gray-500">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Chat Interface
  const ChatInterface = () => (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200 overflow-hidden shadow-2xl flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">SINDA Assistant</h3>
                <p className="text-blue-100 text-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  Intent Accuracy: {analyticsData.intentAccuracy}% | Active Users: {analyticsData.realTimeMetrics.activeUsers}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                <BarChart3 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Program Categories */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-4 border-b border-blue-100 flex-shrink-0">
          <h4 className="text-base font-semibold text-gray-800 mb-3">Explore Our Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {programCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-lg p-3 transition-all duration-300 hover:shadow-md text-left group"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={16} />
                  </div>
                  <div className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intent Recognition Display */}
        {detectedIntents.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 p-3 flex-shrink-0">
            <div className="flex items-center gap-3 text-sm">
              <Target className="text-blue-600 animate-pulse" size={14} />
              <span className="font-medium text-gray-800">Detected Intent:</span>
              {detectedIntents.map((intent, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-200">
                  {intent.intent.replace('_', ' ')} ({Math.round(intent.confidence * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50/30 to-white/50 min-h-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="text-blue-400 mb-3">
                <MessageCircle size={40} className="mx-auto" />
              </div>
              <h4 className="text-base font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-4 text-sm">Ask me about SINDA programs, eligibility, or application processes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-sm mx-auto">
                {quickHelp.map((help, index) => (
                  <button
                    key={index}
                    onClick={() => addMessage(help.text, true)}
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-2 text-xs text-left transition-all duration-300 hover:shadow-md"
                  >
                    {help.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-xl shadow-md transition-all duration-300 ${
                msg.isUser 
                  ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-blue-200'
              } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!msg.isUser && msg.metadata?.intentConfidence && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      {Math.round(msg.metadata.intentConfidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-xl rounded-bl-md px-4 py-3 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">SINDA Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-blue-200 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm transition-all duration-300"
                rows="2"
                disabled={isTyping}
                style={{ minHeight: '50px', maxHeight: '100px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex flex-col">
      {/* Header */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">SINDA Assistant</h1>
                <p className="text-gray-600 flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  AI-Powered Community Support • Since 1991
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm ${
                  currentView === 'chat' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <MessageCircle size={16} />
                Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {currentStep === 'welcome' && <WelcomeScreen />}
        {currentStep === 'language' && <LanguageSelection />}
        {currentStep === 'chat' && <ChatInterface />}
      </div>

      {/* Footer */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs py-3 px-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">System Status: Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-blue-500" />
                <span className="text-gray-600">Hotline: 1800 295 3333</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-gray-600">1 Beatty Road, Singapore 209943</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-blue-500" />
                <span className="text-gray-600">queries@sinda.org.sg</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Lock size={14} className="text-green-500" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0.8); 
            opacity: 0.6; 
          }
          40% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.6); 
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #dbeafe;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #1e40af);
        }

        /* Smooth transitions with reduced motion support */
        * {
          transition: all 0.3s ease;
        }

        /* Prevent layout shift and flickering */
        .chat-container {
          contain: layout style;
          will-change: scroll-position;
        }

        /* Optimize textarea performance */
        textarea {
          will-change: contents;
          contain: layout;
        }

        /* Focus states */
        button:focus,
        textarea:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Backdrop blur effects */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }

        /* Gradient text effect */
        .bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
        }

        /* Enhanced hover effects */
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .hover\\:scale-110:hover {
          transform: scale(1.1);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .animate-bounce,
          .animate-pulse,
          .animate-slide-up,
          .animate-fade-in,
          .animate-glow {
            animation: none !important;
          }
          
          .hover\\:scale-105:hover,
          .hover\\:scale-110:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SINDAAssistant;
