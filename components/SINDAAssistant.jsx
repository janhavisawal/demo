import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { 
  Send, MessageCircle, Users, Globe, AlertTriangle, 
  BarChart3, Shield, Settings, Download, TrendingUp,
  Clock, MapPin, DollarSign, Calendar, Activity,
  Eye, Target, Zap, Lock, CheckCircle, XCircle, 
  BookOpen, Heart, Home, Phone, Mail, Star,
  GraduationCap, HandHeart, Award, UserCheck,
  ChevronRight, Info, HelpCircle, ArrowRight, Waves,
  PieChart, LineChart, BarChart, TrendingDown, RefreshCw,
  Filter, Search, Bell, Menu, X, Plus, Minus,
  Copy, Share, Edit, Trash2, Save, Upload, Loader,
  Volume2, VolumeX, Maximize2, Minimize2, RotateCcw,
  FileText, Database, Headphones, MicIcon, Mic
} from "lucide-react";
import { LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

// Enhanced SINDA Assistant with Fixed Issues
const SINDAAssistant = () => {
  // Core State Management
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(0);
  
  // Advanced Features State
  const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Performance and Analytics State
  const [userSession] = useState({
    startTime: Date.now(),
    messageCount: 0,
    programsExplored: new Set(),
    satisfaction: null,
    completedActions: []
  });
  
  const messagesEndRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const speechRecognition = useRef(null);
  const speechSynthesis = useRef(null);

  // Enhanced WhatsApp stats with real-time updates
  const [whatsappStats, setWhatsappStats] = useState({
    totalMessages: 1547,
    activeChats: 89,
    responseRate: 97.3,
    avgResponseTime: 1.2,
    satisfactionScore: 4.7,
    resolutionRate: 94.8
  });

  // Comprehensive Performance Metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageLoadTime: 0.8,
    errorRate: 0.02,
    uptime: 99.97,
    memoryUsage: 67.8,
    cpuUsage: 34.1,
    cacheHitRate: 94.3,
    lastUpdated: new Date().toISOString(),
    peakUsers: 1247,
    dailyActiveUsers: 8456
  });

  // FIXED: Static data moved outside render with useMemo
  const analyticsData = useMemo(() => ({
    realTimeMetrics: {
      activeUsers: 247,
      messagesPerMinute: 18,
      responseTime: 0.8,
      resolutionRate: 96.7,
      whatsappUsers: 156,
      webUsers: 91,
      totalInteractions: 15432,
      successfulResolutions: 14912,
      averageSatisfaction: 4.7,
      peakHours: [9, 14, 18],
      systemLoad: 45.2,
      emergencyRequests: 12,
      languageDistribution: {
        english: 67,
        tamil: 18,
        hindi: 10,
        malayalam: 5
      }
    },
    intentAccuracy: 98.2,
    userSatisfaction: 97.5,
    totalServed: 12847,
    
    trendingTopics: [
      { 
        topic: 'STEP Tuition Registration',
        count: 245,
        growth: '+12%',
        sentiment: 'positive',
        category: 'education',
        urgency: 'medium',
        timeToResolve: '2.3 days'
      },
      { 
        topic: 'Financial Aid Applications',
        count: 189,
        growth: '+24%',
        sentiment: 'positive',
        category: 'financial',
        urgency: 'high',
        timeToResolve: '1.2 days'
      },
      { 
        topic: 'Youth Leadership Program',
        count: 156,
        growth: '+8%',
        sentiment: 'positive',
        category: 'youth',
        urgency: 'low',
        timeToResolve: '3.1 days'
      },
      { 
        topic: 'Emergency Crisis Support',
        count: 134,
        growth: '+45%',
        sentiment: 'urgent',
        category: 'crisis',
        urgency: 'critical',
        timeToResolve: '4 hours'
      }
    ],
    
    monthlyEngagement: [
      { month: 'Jan', users: 820, programs: 245, assistance: 89000, satisfaction: 94.2, issues: 45, responseTime: 2.1 },
      { month: 'Feb', users: 950, programs: 287, assistance: 102000, satisfaction: 95.1, issues: 38, responseTime: 1.9 },
      { month: 'Mar', users: 1100, programs: 324, assistance: 125000, satisfaction: 96.3, issues: 42, responseTime: 1.7 },
      { month: 'Apr', users: 890, programs: 298, assistance: 98000, satisfaction: 95.7, issues: 51, responseTime: 1.8 },
      { month: 'May', users: 1250, programs: 356, assistance: 145000, satisfaction: 97.1, issues: 29, responseTime: 1.4 },
      { month: 'Jun', users: 1380, programs: 398, assistance: 167000, satisfaction: 97.8, issues: 23, responseTime: 1.2 }
    ],
    
    programDistribution: [
      { name: 'Education Support', value: 42, count: 5234, color: '#3B82F6', growth: '+15%', budget: 850000, waitingList: 234 },
      { name: 'Family Services', value: 28, count: 3489, color: '#06B6D4', growth: '+22%', budget: 640000, waitingList: 45 },
      { name: 'Youth Development', value: 18, count: 2245, color: '#6366F1', growth: '+8%', budget: 320000, waitingList: 89 },
      { name: 'Community Outreach', value: 12, count: 1496, color: '#14B8A6', growth: '+35%', budget: 280000, waitingList: 12 }
    ],
    
    helpMetrics: {
      totalFamiliesHelped: 8456,
      emergencySupport: 234,
      scholarshipsAwarded: 1834,
      jobPlacements: 567,
      counselingSessions: 3421,
      financialAidDistributed: 2100000,
      communityEvents: 89,
      volunteerHours: 12450,
      averageCaseResolutionTime: 4.2,
      repeatCustomers: 1247,
      crisisInterventions: 156,
      successStories: 2341
    },
    
    geographicData: [
      { region: 'Central', count: 3420, percentage: 28, avgIncome: 3200, programs: 12 },
      { region: 'East', count: 2890, percentage: 24, avgIncome: 2800, programs: 8 },
      { region: 'North', count: 2340, percentage: 19, avgIncome: 2900, programs: 7 },
      { region: 'West', count: 2156, percentage: 18, avgIncome: 3100, programs: 9 },
      { region: 'North-East', count: 1340, percentage: 11, avgIncome: 2700, programs: 5 }
    ],
    
    satisfactionTrend: [
      { week: 'W1', satisfaction: 94.2, resolved: 89, issues: 12, responseTime: 2.1, follow_ups: 23 },
      { week: 'W2', satisfaction: 95.8, resolved: 92, issues: 8, responseTime: 1.8, follow_ups: 19 },
      { week: 'W3', satisfaction: 96.1, resolved: 88, issues: 15, responseTime: 2.3, follow_ups: 31 },
      { week: 'W4', satisfaction: 97.5, resolved: 96, issues: 6, responseTime: 1.4, follow_ups: 12 },
      { week: 'W5', satisfaction: 96.8, resolved: 94, issues: 9, responseTime: 1.7, follow_ups: 18 },
      { week: 'W6', satisfaction: 98.2, resolved: 97, issues: 4, responseTime: 1.1, follow_ups: 8 }
    ]
  }), []);

  // FIXED: Language data moved to useMemo
  const languages = useMemo(() => ({
    english: { 
      name: 'English', 
      native: 'English',
      greeting: 'Welcome to SINDA! 🙏 I\'m here to help you discover our programs and guide you through your journey with us. How can I assist you today?',
      flag: '🇬🇧',
      code: 'en',
      rtl: false,
      culturalGreeting: 'Hello'
    },
    tamil: { 
      name: 'Tamil', 
      native: 'தமிழ்',
      greeting: 'SINDA வில் உங்களை வரவேற்கிறோம்! 🙏 நான் உங்கள் பயணத்தில் உதவ இங்கே இருக்கிறேன். இன்று நான் எப்படி உதவ முடியும்?',
      flag: '🇮🇳',
      code: 'ta',
      rtl: false,
      culturalGreeting: 'வணக்கம்'
    },
    hindi: { 
      name: 'Hindi', 
      native: 'हिंदी',
      greeting: 'SINDA में आपका स्वागत है! 🙏 मैं आपकी यात्रा में सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
      flag: '🇮🇳',
      code: 'hi',
      rtl: false,
      culturalGreeting: 'नमस्ते'
    },
    malayalam: {
      name: 'Malayalam',
      native: 'മലയാളം',
      greeting: 'SINDA യിലേക്ക് സ്വാഗതം! 🙏 നിങ്ങളുടെ യാത്രയിൽ സഹായിക്കാൻ ഞാനിവിടെയുണ്ട്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
      flag: '🇮🇳',
      code: 'ml',
      rtl: false,
      culturalGreeting: 'നമസ്കാരം'
    }
  }), []);

  // FIXED: Program categories moved to useMemo
  const programCategories = useMemo(() => [
    {
      id: 'education',
      title: 'Education Programs',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Academic support from pre-school to tertiary education',
      programs: ['STEP Tuition', 'A-Level Support', 'ITE Programs', 'Bursaries', 'GUIDE Programme', 'TEACH Programme'],
      count: '8 Programs',
      beneficiaries: 5234,
      successRate: 94.7,
      budget: 850000,
      waitingList: 234,
      averageWaitTime: '2-3 weeks',
      priority: 'high',
      featured: true
    },
    {
      id: 'family',
      title: 'Family Services',
      icon: Heart,
      color: 'from-cyan-500 to-teal-600',
      description: 'Counselling, financial aid, and family support',
      programs: ['Family Service Centre', 'Financial Assistance', 'Crisis Support', 'Project Athena', 'Prisons Outreach'],
      count: '5 Services',
      beneficiaries: 3489,
      successRate: 96.2,
      budget: 640000,
      waitingList: 45,
      averageWaitTime: '24-48 hours',
      priority: 'critical',
      featured: true
    },
    {
      id: 'youth',
      title: 'Youth Development',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Leadership and skills development for ages 18-35',
      programs: ['Youth Club', 'Leadership Seminars', 'Mentoring', 'Corporate Partnerships', 'Youth Awards'],
      count: '5 Programs',
      beneficiaries: 2245,
      successRate: 91.8,
      budget: 320000,
      waitingList: 89,
      averageWaitTime: '1-2 weeks',
      priority: 'medium',
      featured: false
    },
    {
      id: 'community',
      title: 'Community Outreach',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Bringing SINDA services to your neighborhood',
      programs: ['Door Knocking', 'SINDA Bus', 'Community Events', 'Volunteer Programs', 'Back to School Festival'],
      count: '6 Initiatives',
      beneficiaries: 1496,
      successRate: 88.4,
      budget: 280000,
      waitingList: 12,
      averageWaitTime: 'Immediate',
      priority: 'low',
      featured: false
    }
  ], []);

  // FIXED: Quick help moved to useMemo
  const quickHelp = useMemo(() => [
    { text: 'Apply for STEP tuition', category: 'education', priority: 'high', tags: ['popular', 'urgent'], estimatedTime: '15 min', successRate: 95 },
    { text: 'Financial assistance eligibility', category: 'family', priority: 'high', tags: ['urgent', 'assessment'], estimatedTime: '10 min', successRate: 98 },
    { text: 'Join Youth Club', category: 'youth', priority: 'medium', tags: ['networking', 'skills'], estimatedTime: '5 min', successRate: 92 },
    { text: 'Emergency support', category: 'family', priority: 'urgent', tags: ['crisis', '24/7'], estimatedTime: 'Immediate', successRate: 100 },
    { text: 'Job placement assistance', category: 'career', priority: 'medium', tags: ['career', 'employment'], estimatedTime: '20 min', successRate: 87 },
    { text: 'Community events near me', category: 'community', priority: 'low', tags: ['events', 'local'], estimatedTime: '5 min', successRate: 95 },
    { text: 'Scholarship information', category: 'education', priority: 'medium', tags: ['funding', 'tertiary'], estimatedTime: '10 min', successRate: 89 },
    { text: 'Family counselling services', category: 'family', priority: 'medium', tags: ['mental health', 'support'], estimatedTime: '30 min', successRate: 96 }
  ], []);

  // FIXED: Enhanced notification system with stable implementation
  const addNotification = useCallback((message, type = 'info', category = 'general', persistent = false, action = null) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      message,
      type,
      category,
      persistent,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      action,
      priority: type === 'error' ? 'high' : type === 'warning' ? 'medium' : 'low'
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    // Auto-remove notification after delay unless persistent
    if (!persistent) {
      const delay = type === 'error' ? 8000 : type === 'warning' ? 6000 : 4000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, delay);
    }
  }, []);

  // FIXED: Enhanced message handling with stable dependencies
  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    if (!content?.trim()) return;

    const newMessage = {
      id: messageId,
      content: content.trim(),
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        ...metadata,
        responseTime: isUser ? null : Math.random() * 2 + 0.5,
        language: selectedLanguage,
        wordCount: content.trim().split(' ').length,
        characterCount: content.trim().length,
        sessionId: userSession.startTime
      }
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId, selectedLanguage, userSession.startTime]);

  // Enhanced message sending with proper async handling
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isTyping) return;

    if (trimmedMessage.length > 2000) {
      addNotification('Message too long. Please keep under 2000 characters.', 'warning');
      return;
    }
    
    addMessage(trimmedMessage, true, { inputMethod: 'manual' });
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `🎓 **STEP Tuition Program** - Our flagship education program offers heavily subsidized tuition at just $10-15/hour for eligible families. With 94.7% pass rates and expert MOE-qualified teachers, we're transforming academic journeys across Singapore.\n\n📞 **Ready to apply?** Call 1800 295 3333 or visit 1 Beatty Road!`,
        `💰 **Financial Assistance Available** - We provide emergency aid within 24-48 hours, monthly support, and help with bills, rent, and medical expenses. Our 96% success rate shows families achieve stability within 12 months.\n\n🚨 **Need immediate help?** Call our crisis hotline: 1800 295 3333`,
        `🎯 **Youth Development Programs** - Join our Youth Club (ages 18-35) for leadership training, networking, and career mentoring. 89% of participants report career advancement within 2 years!\n\n💼 **Interested?** Email queries@sinda.org.sg or call 1800 295 3333`,
        `👨‍👩‍👧‍👦 **Family Services** - Our dedicated Family Service Centre offers professional counseling, crisis intervention, and culturally sensitive support. All services are completely confidential.\n\n🤝 **Get support today:** Walk-in at 1 Beatty Road or call 1800 295 3333`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, false, {
        aiGenerated: true,
        confidence: 0.95,
        sentiment: 'positive'
      });
      setIsTyping(false);
    }, 1500);
  }, [inputMessage, isTyping, addMessage, addNotification]);

  // FIXED: Simple event handlers
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Enhanced program click handler
  const handleProgramClick = useCallback((categoryTitle) => {
    if (!categoryTitle) return;
    
    const programMessage = `Tell me about ${categoryTitle}`;
    addNotification(`Exploring ${categoryTitle}`, 'info', 'navigation');
    addMessage(programMessage, true, { triggerType: 'programButton', category: categoryTitle });
    setTimeout(() => handleSendMessage(), 100);
  }, [addMessage, addNotification, handleSendMessage]);

  // FIXED: Better auto-scroll - track last message count to only scroll on new messages
  const lastMessageCountRef = useRef(0);
  
  useEffect(() => {
    if (messagesEndRef.current && messages.length > lastMessageCountRef.current) {
      // Only scroll when new messages are actually added
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  // Welcome Screen Component
  const WelcomeScreen = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-cyan-200/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full animate-float-fast"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 space-y-8">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl animate-glow">
            <BookOpen className="text-white animate-pulse" size={40} />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SINDA</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered guide to Singapore Indian Development Association programs and services. 
            Building stronger communities together since 1991.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">AI System Online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
              <Users size={16} />
              <span className="text-sm font-medium">{analyticsData.realTimeMetrics.activeUsers} users online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
              <Activity size={16} />
              <span className="text-sm font-medium">99.97% uptime</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '30+', label: 'Years Serving', color: 'blue', icon: Calendar },
              { value: '12K+', label: 'Families Helped', color: 'cyan', icon: Heart },
              { value: '25+', label: 'Programs', color: 'indigo', icon: BookOpen },
              { value: '24/7', label: 'Support', color: 'teal', icon: Phone }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:scale-105 transition-all duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-blue-600" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep('language')}
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto group"
          >
            Start Your Journey
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  ));

  // Language Selection Component
  const LanguageSelection = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="mb-6 bg-white/80 hover:bg-white/90 p-3 rounded-xl border border-blue-200 transition-all duration-300 hover:scale-110"
          >
            <ArrowRight size={20} className="rotate-180 text-blue-600" />
          </button>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Language</h2>
          <p className="text-lg text-gray-600 mb-12">Select your preferred language to continue with personalized support</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(languages).map(([key, lang], index) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentStep('chat');
                  setTimeout(() => addMessage(lang.greeting, false), 500);
                  addNotification(`Language set to ${lang.name}`, 'success', 'language');
                }}
                className={`bg-white/80 backdrop-blur-sm border-2 hover:border-blue-500 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:transform hover:scale-110 group ${
                  selectedLanguage === key ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
              >
                <div className="text-4xl mb-4">{lang.flag}</div>
                <div className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {lang.native}
                </div>
                <div className="text-sm text-gray-500">{lang.name}</div>
                <div className="text-xs text-blue-600 mt-2 font-medium">{lang.culturalGreeting}</div>
                {selectedLanguage === key && (
                  <div className="mt-2">
                    <CheckCircle className="text-blue-500 mx-auto" size={20} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));

  // Chat Interface Component
  const ChatInterface = React.memo(() => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <div className="flex items-center gap-4 text-blue-100 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-green-300"></div>
                    <span>AI Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{analyticsData.realTimeMetrics.activeUsers} users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{analyticsData.realTimeMetrics.responseTime}s avg</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
                title={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Program Categories Quick Access */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Explore Our Programs</h4>
            <div className="text-sm text-gray-600">
              {programCategories.reduce((sum, cat) => sum + cat.beneficiaries, 0).toLocaleString()} total beneficiaries
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category.title)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-500 hover:shadow-lg text-left group hover:scale-105 relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                  <div className="text-xs text-green-600 mt-1 font-medium">{category.successRate}% success rate</div>
                  <div className="text-xs text-blue-600 mt-1">{category.beneficiaries.toLocaleString()} helped</div>
                  
                  {category.priority === 'critical' && (
                    <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      Critical
                    </div>
                  )}
                  {category.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  )}
                  
                  {category.waitingList > 0 && (
                    <div className="absolute bottom-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {category.waitingList} waiting
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50 backdrop-blur-sm">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-blue-400 mb-4">
                <MessageCircle size={48} className="mx-auto" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or application processes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {quickHelp.slice(0, 6).map((help, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addMessage(help.text, true, { quickHelp: true });
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className={`border rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105 ${
                      help.priority === 'urgent' ? 'border-red-300 bg-red-50 hover:border-red-400' :
                      help.priority === 'high' ? 'border-orange-300 bg-orange-50 hover:border-orange-400' :
                      'bg-blue-50 border-blue-200 hover:border-blue-400'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{help.text}</span>
                      <div className="flex items-center gap-1 ml-2">
                        {help.priority === 'urgent' && <AlertTriangle size={14} className="text-red-500" />}
                        {help.tags.includes('popular') && <Star size={12} className="text-yellow-500" />}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-1">
                        {help.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {help.estimatedTime} • {help.successRate}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 relative ${
                msg.isUser 
                  ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-blue-200'
              } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  <div className="flex items-center gap-2">
                    {!msg.isUser && msg.metadata?.aiGenerated && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        AI ({(msg.metadata.confidence * 100).toFixed(0)}%)
                      </span>
                    )}
                    {msg.metadata?.wordCount && (
                      <span className="text-xs opacity-50">
                        {msg.metadata.wordCount}w
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
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

        {/* FIXED: Input Area with proper event handling */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm transition-all duration-300"
                  rows="2"
                  disabled={isTyping}
                  maxLength={2000}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {inputMessage.length}/2000
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setInputMessage("I need help with financial assistance")}
                  className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors duration-200"
                  disabled={isTyping}
                >
                  🚨 Emergency
                </button>
                <button
                  onClick={() => setInputMessage("Tell me about STEP tuition")}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                  disabled={isTyping}
                >
                  🎓 Education
                </button>
                <button
                  onClick={() => setInputMessage("How can I join youth programs?")}
                  className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors duration-200"
                  disabled={isTyping}
                >
                  🎯 Youth
                </button>
                <button
                  onClick={() => setInputMessage("I need family counseling support")}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors duration-200"
                  disabled={isTyping}
                >
                  👨‍👩‍👧‍👦 Family
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:transform-none flex items-center justify-center"
              >
                {isTyping ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  addNotification('Chat history cleared', 'info', 'chat');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-xl transition-all duration-300 hover:scale-110"
                title="Clear Chat"
                disabled={isTyping}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Messages: {messages.length}</span>
              <span>Language: {languages[selectedLanguage].native}</span>
              <span className="text-green-600">API: Connected</span>
              <span>Session: {Math.floor((Date.now() - userSession.startTime) / 60000)}min</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Uptime: 99.97%</span>
              <span>Load: 0.8s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Settings Modal
  const SettingsModal = React.memo(() => {
    if (!showSettings) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Audio</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sound Effects</span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Language</h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key}>{lang.native} ({lang.name})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Data & Privacy</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMessages([]);
                      addNotification('Chat history cleared', 'info');
                    }}
                    className="w-full bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Notification Panel
  const NotificationPanel = React.memo(() => {
    if (notifications.length === 0) return null;
    
    return (
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-500 ${
              notification.type === 'success' ? 'bg-green-100/90 text-green-800 border border-green-200' :
              notification.type === 'warning' ? 'bg-yellow-100/90 text-yellow-800 border border-yellow-200' :
              notification.type === 'error' ? 'bg-red-100/90 text-red-800 border border-red-200' :
              'bg-blue-100/90 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">{notification.timestamp}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity duration-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Header */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SINDA Assistant</h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-green-400"></div>
                    <span>AI-Powered Community Support • Since 1991 • {languages[selectedLanguage].native}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { key: 'chat', label: 'Web Chat', icon: MessageCircle },
                { key: 'whatsapp', label: 'WhatsApp', icon: Phone },
                { key: 'analytics', label: 'Analytics', icon: Activity }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setCurrentView(view.key)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                    currentView === view.key 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <view.icon size={18} />
                  {view.label}
                  {view.key === 'chat' && messages.length > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {messages.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader className="animate-spin mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading SINDA Assistant...</p>
            </div>
          </div>
        }>
          {currentStep === 'welcome' && <WelcomeScreen />}
          {currentStep === 'language' && <LanguageSelection />}
          {currentStep === 'chat' && <ChatInterface />}
        </Suspense>
      </div>

      {/* Settings Modal */}
      <SettingsModal />

      {/* Notification Panel */}
      <NotificationPanel />

      {/* Footer */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-6 px-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full animate-pulse bg-green-400"></div>
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
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Lock size={16} className="text-green-500" />
                <span>Secure & Confidential</span>
              </div>
              <div className="text-xs">
                <div>Session: {Math.floor((Date.now() - userSession.startTime) / 60000)}min</div>
                <div>Messages: {messages.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(270deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        
        .bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #dbeafe; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8); 
          border-radius: 4px; 
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SINDAAssistant;
