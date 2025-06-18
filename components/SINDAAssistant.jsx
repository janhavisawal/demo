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

// SINDA Assistant with Chill Blue Theme
const SINDAAssistant = () => {
  const [currentView, setCurrentView] = useState('chat');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef(null);

  // Analytics State with comprehensive dummy data
  const [analyticsData, setAnalyticsData] = useState({
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
    },
    demographicData: [
      { ageGroup: '0-12', count: 2340, percentage: 19 },
      { ageGroup: '13-18', count: 3120, percentage: 25 },
      { ageGroup: '19-35', count: 3890, percentage: 32 },
      { ageGroup: '36-55', count: 2150, percentage: 17 },
      { ageGroup: '55+', count: 890, percentage: 7 }
    ],
    satisfactionTrend: [
      { week: 'W1', satisfaction: 94.2, resolved: 89 },
      { week: 'W2', satisfaction: 95.8, resolved: 92 },
      { week: 'W3', satisfaction: 96.1, resolved: 88 },
      { week: 'W4', satisfaction: 97.5, resolved: 96 },
      { week: 'W5', satisfaction: 96.8, resolved: 94 },
      { week: 'W6', satisfaction: 98.2, resolved: 97 }
    ]
  });

  // Enhanced language support
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

  // SINDA Program Categories with new color scheme
  const programCategories = [
    {
      id: 'education',
      title: 'Education Programs',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Academic support from pre-school to tertiary education',
      programs: ['STEP Tuition', 'A-Level Support', 'ITE Programs', 'Bursaries'],
      count: '8 Programs'
    },
    {
      id: 'family',
      title: 'Family Services',
      icon: Heart,
      color: 'from-cyan-500 to-teal-600',
      description: 'Counselling, financial aid, and family support',
      programs: ['Family Service Centre', 'Financial Assistance', 'Crisis Support'],
      count: '5 Services'
    },
    {
      id: 'youth',
      title: 'Youth Development',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Leadership and skills development for ages 18-35',
      programs: ['Youth Club', 'Leadership Seminars', 'Mentoring'],
      count: '4 Programs'
    },
    {
      id: 'community',
      title: 'Community Outreach',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Bringing SINDA services to your neighborhood',
      programs: ['Door Knocking', 'SINDA Bus', 'Community Events'],
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
  const [extractedEntities, setExtractedEntities] = useState([]);

  const recognizeIntent = useCallback((message) => {
    const intents = {
      'apply_program': { keywords: ['apply', 'application', 'register', 'sign up', 'join'], confidence: 0.95 },
      'check_eligibility': { keywords: ['eligible', 'qualify', 'requirements', 'criteria'], confidence: 0.92 },
      'program_info': { keywords: ['tell me about', 'what is', 'information', 'details'], confidence: 0.89 },
      'financial_help': { keywords: ['money', 'financial', 'assistance', 'help', 'emergency'], confidence: 0.96 },
      'urgent_crisis': { keywords: ['emergency', 'urgent', 'crisis', 'immediate', 'desperate'], confidence: 0.98 }
    };

    const detected = [];
    const entities = [];

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

    // Extract entities
    const phoneRegex = /(\+65\s?)?[689]\d{7}/g;
    const emailRegex = /\S+@\S+\.\S+/g;
    const amountRegex = /\$\d+/g;

    const phones = message.match(phoneRegex);
    const emails = message.match(emailRegex);
    const amounts = message.match(amountRegex);

    if (phones) entities.push({ type: 'phone', values: phones });
    if (emails) entities.push({ type: 'email', values: emails });
    if (amounts) entities.push({ type: 'amount', values: amounts });

    setDetectedIntents(detected);
    setExtractedEntities(entities);

    return { intents: detected, entities };
  }, []);

  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
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
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    const analysis = recognizeIntent(userMessage);
    
    addMessage(userMessage, true, { 
      intents: analysis.intents,
      entities: analysis.entities 
    });
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
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

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-cyan-200/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-teal-200/20 rounded-full animate-float-slow"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl animate-glow">
            <BookOpen className="text-white animate-pulse" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient">SINDA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Your AI-powered guide to Singapore Indian Development Association programs and services. 
            Building stronger communities together since 1991.
          </p>
          
          {/* Key Stats with enhanced animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 animate-slide-up hover:scale-105 transition-all duration-500 hover:shadow-xl">
              <div className="text-3xl font-bold text-blue-600 animate-counter">30+</div>
              <div className="text-sm text-gray-600 mt-1">Years Serving</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-100 animate-slide-up hover:scale-105 transition-all duration-500 hover:shadow-xl" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-cyan-600 animate-counter">12K+</div>
              <div className="text-sm text-gray-600 mt-1">Families Helped</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100 animate-slide-up hover:scale-105 transition-all duration-500 hover:shadow-xl" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-indigo-600 animate-counter">25+</div>
              <div className="text-sm text-gray-600 mt-1">Programs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100 animate-slide-up hover:scale-105 transition-all duration-500 hover:shadow-xl" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-teal-600 animate-counter">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Support</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep('language')}
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto animate-bounce-gentle group"
          >
            Start Your Journey
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
        {/* Real-time Activity Feed */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Live Activity Feed</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {[
              { time: '2 min ago', action: 'New scholarship application', user: 'Priya S.', type: 'education', color: 'blue' },
              { time: '5 min ago', action: 'Emergency assistance approved', user: 'Raj M.', type: 'crisis', color: 'red' },
              { time: '8 min ago', action: 'Youth program enrollment', user: 'Aisha K.', type: 'youth', color: 'green' },
              { time: '12 min ago', action: 'Family counseling session completed', user: 'Kumar F.', type: 'family', color: 'purple' },
              { time: '15 min ago', action: 'Job placement successful', user: 'Deepa R.', type: 'career', color: 'cyan' },
              { time: '18 min ago', action: 'Financial aid disbursed', user: 'Suresh L.', type: 'financial', color: 'indigo' },
              { time: '22 min ago', action: 'STEP tuition registration', user: 'Meera P.', type: 'education', color: 'blue' },
              { time: '25 min ago', action: 'Community event participation', user: 'Vinod T.', type: 'community', color: 'teal' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-blue-50/80 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`w-3 h-3 rounded-full bg-${activity.color}-500 animate-pulse`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs bg-${activity.color}-100 text-${activity.color}-700`}>
                  {activity.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-bounce-gentle">
                <TrendingUp className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-green-600">94.7%</p>
              <p className="text-sm text-gray-600 mt-1">Success Rate</p>
              <p className="text-xs text-green-600 mt-2">↑ 5.2% vs last month</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-bounce-gentle">
                <Clock className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-blue-600">2.3 days</p>
              <p className="text-sm text-gray-600 mt-1">Avg Response</p>
              <p className="text-xs text-blue-600 mt-2">↓ 0.8 days faster</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-bounce-gentle">
                <Star className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-purple-600">4.8/5</p>
              <p className="text-sm text-gray-600 mt-1">User Rating</p>
              <p className="text-xs text-purple-600 mt-2">↑ 0.3 improvement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goals & Achievements */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-yellow-200 shadow-lg animate-slide-up">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Weekly Goals & Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-blue-200 rounded-full"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full" style={{clipPath: 'polygon(0 0, 85% 0, 85% 100%, 0 100%)'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">85%</span>
              </div>
            </div>
            <p className="font-semibold text-gray-800">Scholarship Goal</p>
            <p className="text-sm text-gray-600">156 / 184 applications</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-200 rounded-full"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full" style={{clipPath: 'polygon(0 0, 92% 0, 92% 100%, 0 100%)'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">92%</span>
              </div>
            </div>
            <p className="font-semibold text-gray-800">Emergency Response</p>
            <p className="text-sm text-gray-600">23 / 25 cases resolved</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-purple-200 rounded-full"></div>
              <div className="absolute inset-0 bg-purple-500 rounded-full" style={{clipPath: 'polygon(0 0, 78% 0, 78% 100%, 0 100%)'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">78%</span>
              </div>
            </div>
            <p className="font-semibold text-gray-800">Youth Engagement</p>
            <p className="text-sm text-gray-600">89 / 115 participants</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-cyan-200 rounded-full"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full" style={{clipPath: 'polygon(0 0, 95% 0, 95% 100%, 0 100%)'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">95%</span>
              </div>
            </div>
            <p className="font-semibold text-gray-800">Job Placement</p>
            <p className="text-sm text-gray-600">38 / 40 placements</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Language Selection with enhanced animations
  const LanguageSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300/10 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-cyan-300/10 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-300/10 rounded-full animate-float-fast"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-up">Choose Your Language</h2>
          <p className="text-lg text-gray-600 mb-12 animate-fade-in">Select your preferred language to continue</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(languages).map(([key, lang], index) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentStep('chat');
                  setTimeout(() => addMessage(lang.greeting, false), 500);
                }}
                className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:transform hover:scale-110 group animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-4 animate-pulse">{lang.flag}</div>
                <div className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {lang.native}
                </div>
                <div className="text-sm text-gray-500">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main Chat Interface with chill blue theme
  const ChatInterface = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl animate-slide-up">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-wave"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-glow">
                <BookOpen className="text-white animate-pulse" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  Intent Accuracy: {analyticsData.intentAccuracy}% | Active Users: {analyticsData.realTimeMetrics.activeUsers}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <BarChart3 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Program Categories Quick Access */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Explore Our Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => addMessage(`Tell me about ${category.title}`, true)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-500 hover:shadow-lg text-left group hover:scale-105 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 p-4 animate-slide-down">
            <div className="flex items-center gap-3 text-sm">
              <Target className="text-blue-600 animate-pulse" size={16} />
              <span className="font-medium text-gray-800">Detected Intent:</span>
              {detectedIntents.map((intent, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200 animate-fade-in">
                  {intent.intent.replace('_', ' ')} ({Math.round(intent.confidence * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50 backdrop-blur-sm">
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="text-blue-400 mb-4 animate-bounce-gentle">
                <MessageCircle size={48} className="mx-auto" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or application processes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {quickHelp.map((help, index) => (
                  <button
                    key={index}
                    onClick={() => addMessage(help.text, true)}
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105 animate-slide-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {help.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{animationDelay: `${index * 0.05}s`}}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
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
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs animate-pulse">
                      {Math.round(msg.metadata.intentConfidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-slide-up">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg">
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
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm transition-all duration-300"
                rows="2"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:transform-none animate-glow"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Dashboard with comprehensive charts
  const AnalyticsDashboard = () => (
    <div className="space-y-8 p-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2 animate-counter">{analyticsData.realTimeMetrics.activeUsers}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600 text-xs">+15% from last week</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl animate-bounce-gentle">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Families Helped</p>
              <p className="text-3xl font-bold text-cyan-600 mt-2 animate-counter">{analyticsData.helpMetrics.totalFamiliesHelped.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600 text-xs">+234 this month</span>
              </div>
            </div>
            <div className="bg-cyan-100 p-3 rounded-xl animate-bounce-gentle">
              <Heart className="text-cyan-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Financial Aid</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2 animate-counter">${(analyticsData.helpMetrics.financialAidDistributed / 1000000).toFixed(1)}M</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600 text-xs">Distributed this year</span>
              </div>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl animate-bounce-gentle">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Job Placements</p>
              <p className="text-3xl font-bold text-teal-600 mt-2 animate-counter">{analyticsData.helpMetrics.jobPlacements}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600 text-xs">+89 this quarter</span>
              </div>
            </div>
            <div className="bg-teal-100 p-3 rounded-xl animate-bounce-gentle">
              <Award className="text-teal-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Engagement Trend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Monthly Engagement</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" size={20} />
              <span className="text-green-600 text-sm font-medium">+24% growth</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.monthlyEngagement}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #3B82F6',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorUsers)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Program Distribution */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Program Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={analyticsData.programDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.programDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #06B6D4',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analyticsData.programDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{backgroundColor: item.color}}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Assistance Trend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200 shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Financial Assistance Distributed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={analyticsData.monthlyEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #6366F1',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
                formatter={(value) => [`${value.toLocaleString()}`, 'Amount']}
              />
              <Bar 
                dataKey="assistance" 
                fill="url(#assistanceGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="assistanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* User Satisfaction Trend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200 shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6">User Satisfaction & Resolution Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={analyticsData.satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[85, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #14B8A6',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#14B8A6" 
                strokeWidth={3}
                dot={{ fill: '#14B8A6', strokeWidth: 2, r: 6 }}
                name="Satisfaction %"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                name="Resolution Rate %"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg animate-slide-up">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Community Impact Dashboard</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <GraduationCap className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-blue-600 animate-counter">{analyticsData.helpMetrics.scholarshipsAwarded}</p>
            <p className="text-sm text-gray-600">Scholarships Awarded</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <AlertTriangle className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-cyan-600 animate-counter">{analyticsData.helpMetrics.emergencySupport}</p>
            <p className="text-sm text-gray-600">Emergency Cases</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <Heart className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-indigo-600 animate-counter">{analyticsData.helpMetrics.counselingSessions}</p>
            <p className="text-sm text-gray-600">Counseling Sessions</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <Award className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-teal-600 animate-counter">{analyticsData.helpMetrics.jobPlacements}</p>
            <p className="text-sm text-gray-600">Job Placements</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <Users className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-purple-600 animate-counter">{analyticsData.helpMetrics.totalFamiliesHelped}</p>
            <p className="text-sm text-gray-600">Total Families</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-glow">
              <Target className="text-white" size={28} />
            </div>
            <p className="text-2xl font-bold text-pink-600 animate-counter">{analyticsData.intentAccuracy}%</p>
            <p className="text-sm text-gray-600">AI Accuracy</p>
          </div>
        </div>
      </div>

      {/* Demographics Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg animate-slide-up">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Age Demographics Served</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={analyticsData.demographicData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis dataKey="ageGroup" type="category" stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #8B5CF6',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }} 
            />
            <Bar 
              dataKey="count" 
              fill="url(#demographicGradient)" 
              radius={[0, 8, 8, 0]}
            />
            <defs>
              <linearGradient id="demographicGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Header */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200 animate-slide-down">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg animate-glow">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SINDA Assistant</h1>
                <p className="text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  AI-Powered Community Support • Since 1991
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  currentView === 'chat' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-glow' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <MessageCircle size={18} />
                Chat
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  currentView === 'analytics' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-glow' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <BarChart3 size={18} />
                Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        {currentStep === 'welcome' && <WelcomeScreen />}
        {currentStep === 'language' && <LanguageSelection />}
        {currentStep === 'chat' && currentView === 'chat' && <ChatInterface />}
        {currentStep === 'chat' && currentView === 'analytics' && <AnalyticsDashboard />}
      </div>

      {/* Analytics Overlay */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Real-time Analytics</h2>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <AnalyticsDashboard />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12 animate-slide-up">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-6 px-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">System Status: Operational</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-500" />
                <span className="text-gray-600">Hotline: 1800 295 3333</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-gray-600">1 Beatty Road, Singapore 209943</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-500" />
                <span className="text-gray-600">queries@sinda.org.sg</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-500">
              <Lock size={16} className="text-green-500" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Styling with Chill Blue Theme and Animations */}
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

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }

        @keyframes float-medium {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(90deg); 
          }
        }

        @keyframes float-fast {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-25px) rotate(270deg); 
          }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.6); 
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
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

        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes wave {
          0%, 100% { 
            transform: translateX(0) scaleX(1); 
          }
          50% { 
            transform: translateX(10px) scaleX(1.05); 
          }
        }

        @keyframes counter {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 4s ease-in-out infinite;
        }

        .animate-counter {
          animation: counter 0.8s ease-out forwards;
        }
        
        /* Custom scrollbar with blue theme */
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

        /* Smooth transitions */
        * {
          transition: all 0.3s ease;
        }

        /* Focus states with blue theme */
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

        /* Glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};

export default SINDAAssistant;
