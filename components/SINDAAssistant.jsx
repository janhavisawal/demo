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
  FileText, Database, Headphones, Mic
} from "lucide-react";
import { LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

// Enhanced SINDA Assistant with Fixed Scroll Issues
const SINDAAssistant = () => {
  // Core State Management
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  // COMPLETELY STABLE input handling to prevent focus loss
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const stableInputRef = useRef('');
  
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
  
  // State for analytics modal
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  
  // FIXED: Production-ready scroll refs and state
  const messagesEndRef = useRef(null);
  const messageScrollRef = useRef(null);
  const previousMessageCountRef = useRef(0);
  const isTypingRef = useRef(false);
  const speechRecognition = useRef(null);
  const speechSynthesis = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  // Scroll control state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  
  // Performance and Analytics State
  const [userSession] = useState({
    startTime: Date.now(),
    messageCount: 0,
    programsExplored: new Set(),
    satisfaction: null,
    completedActions: []
  });

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
  
  // FIXED: Stable handlers that NEVER change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    stableInputRef.current = value;
    setInputMessage(value);
  }, []); // NO dependencies at all
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Use the ref value to avoid dependency issues
      const message = stableInputRef.current?.trim();
      if (message && message.length > 0) {
        handleSendMessage();
      }
    }
  }, []); // NO dependencies

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

  // FIXED: Simple notification system without popups
  const addNotification = useCallback((message, type = 'info', category = 'general', persistent = false, action = null) => {
    // Just log to console instead of popup notifications
    console.log(`${type.toUpperCase()}: ${message}`);
  }, []);

  // FIXED: Robust scroll handler with safer margin and user intent tracking
  const handleScroll = useCallback((e) => {
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce scroll detection to prevent excessive state updates
    scrollTimeoutRef.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // Use safer 5px margin instead of 50px for bottom detection
      const isAtBottom = scrollHeight - scrollTop - clientHeight <= 5;
      
      // Track if user manually scrolled (not at bottom)
      const hasUserScrolled = !isAtBottom;
      
      // Only update state if values actually changed
      setAutoScroll(prev => prev !== isAtBottom ? isAtBottom : prev);
      setShowScrollButton(prev => prev !== !isAtBottom ? !isAtBottom : prev);
      setUserScrolled(prev => prev !== hasUserScrolled ? hasUserScrolled : prev);
    }, 150);
  }, []);

  // FIXED: Robust scroll to bottom using scrollTo instead of scrollIntoView
  const scrollToBottom = useCallback(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTo({
        top: messageScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShowScrollButton(false);
      setAutoScroll(true);
      setUserScrolled(false);
    }
  }, []);

  // FIXED: Enhanced message handling with minimal dependencies
  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    if (!content?.trim()) return;

    setMessages(prev => {
      const newMessage = {
        id: prev.length + Date.now(), // Simple unique ID
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
      
      const updated = [...prev, newMessage];
      previousMessageCountRef.current = updated.length;
      return updated;
    });
  }, [selectedLanguage, userSession.startTime]); // Only essential dependencies

  // ENHANCED: Completely stable send message function
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = stableInputRef.current?.trim();
    if (!trimmedMessage || isTyping) return;

    if (trimmedMessage.length > 2000) {
      console.log('Message too long. Please keep under 2000 characters.');
      return;
    }
    
    // Add user message using direct state update
    setMessages(prev => {
      const newMessage = {
        id: prev.length + Date.now(),
        content: trimmedMessage,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: { inputMethod: 'manual' }
      };
      return [...prev, newMessage];
    });
    
    setInputMessage('');
    stableInputRef.current = '';
    setIsTyping(true);

    // Generate response
    setTimeout(() => {
      const lowerMessage = trimmedMessage.toLowerCase();
      let response = '';

      // Educational queries
      if (lowerMessage.includes('step') || lowerMessage.includes('tuition') || lowerMessage.includes('education') || lowerMessage.includes('school')) {
        response = `🎓 **STEP Tuition Program - Let's Get You Started!**\n\n✅ **Immediate Actions You Can Take:**\n1. **Call now:** 1800 295 3333 (Mon-Fri 9AM-6PM)\n2. **Walk-in:** 1 Beatty Road, Level 2 Registration Counter\n3. **Required documents:** IC, latest report card, household income proof\n\n💰 **Cost:** Only $10-15/hour (90% subsidy!)\n📊 **Success rate:** 94.7% pass rate\n🎯 **Available for:** Primary 1 to JC2, all subjects\n\n⚡ **Fast-track application:** Mention "URGENT" for priority processing\n\n❓ **Questions?** Ask me about eligibility, subjects, or scheduling!`;
      }
      // Financial assistance
      else if (lowerMessage.includes('financial') || lowerMessage.includes('assistance') || lowerMessage.includes('money') || lowerMessage.includes('aid') || lowerMessage.includes('emergency')) {
        response = `💰 **Financial Help Available NOW**\n\n🚨 **IMMEDIATE SUPPORT:**\n• **Crisis hotline:** 1800 295 3333 (24/7)\n• **Emergency aid:** Decision within 24-48 hours\n• **Walk-in:** 1 Beatty Road (bring IC + income docs)\n\n💡 **What You Can Get:**\n✅ Emergency cash assistance ($200-$2000)\n✅ Monthly household support\n✅ Medical bill coverage\n✅ Utility bill help\n✅ School fee assistance\n\n📋 **Bring These Documents:**\n• IC/passport\n• Bank statements (3 months)\n• Income proof\n• Bills/receipts needing help\n\n⏰ **Best time to visit:** 9AM-12PM for faster service`;
      }
      // Youth programs
      else if (lowerMessage.includes('youth') || lowerMessage.includes('young') || lowerMessage.includes('leadership') || lowerMessage.includes('club') || lowerMessage.includes('job')) {
        response = `🎯 **Youth Programs - Join Today!**\n\n🚀 **Immediate Registration:**\n1. **WhatsApp:** 9123 4567 with "YOUTH SIGNUP"\n2. **Email:** youth@sinda.org.sg\n3. **Visit:** 1 Beatty Road Level 3 Youth Centre\n\n🎪 **This Month's Activities:**\n• **Leadership Workshop:** Every Sat 2-5PM\n• **Career Mentoring:** 1-on-1 sessions available\n• **Networking Night:** Last Fri of month\n• **Skills Training:** IT, Communication, Public Speaking\n\n💼 **Job Placement Support:**\n• Resume writing help\n• Interview preparation\n• Industry connections\n• 67% job placement rate!\n\n🎁 **Membership perks:** Free workshops, priority job referrals, networking access`;
      }
      // Family services
      else if (lowerMessage.includes('family') || lowerMessage.includes('counselling') || lowerMessage.includes('counseling') || lowerMessage.includes('support') || lowerMessage.includes('marriage') || lowerMessage.includes('relationship')) {
        response = `👨‍👩‍👧‍👦 **Family Support - We're Here for You**\n\n💙 **Get Help Today:**\n• **24/7 Crisis Line:** 1800 295 3333\n• **Walk-in Counseling:** 1 Beatty Road Level 4 (9AM-8PM)\n• **Online booking:** sinda.org.sg/book-counseling\n\n🤝 **Professional Services:**\n✅ Individual counseling (free)\n✅ Family therapy sessions\n✅ Marriage counseling\n✅ Child behavioral support\n✅ Crisis intervention\n\n👥 **Our Counselors Speak:**\n• English, Tamil, Hindi, Malayalam\n• All sessions 100% confidential\n• Average 3-5 sessions show improvement\n\n⚡ **Urgent situations:** Call immediately - we prioritize crisis cases`;
      }
      // Application/eligibility questions
      else if (lowerMessage.includes('eligible') || lowerMessage.includes('apply') || lowerMessage.includes('qualify') || lowerMessage.includes('requirement')) {
        response = `📋 **Eligibility Check - Quick Assessment**\n\n✅ **You likely qualify if:**\n• Singapore citizen/PR\n• Household income <$4,500/month\n• Indian ethnicity (or spouse/child of Indian)\n\n🚀 **Fast Eligibility Check:**\n1. **Call:** 1800 295 3333 (2-minute phone check)\n2. **Online:** sinda.org.sg/eligibility-checker\n3. **WhatsApp:** 9123 4567 with "CHECK ELIGIBILITY"\n\n📄 **Bring for instant approval:**\n• IC/passport\n• Latest payslips (2 months)\n• Bank statements (3 months)\n\n⏰ **Processing time:** Same-day approval for most programs!\n\n💡 **Pro tip:** Higher income families may still qualify for specific programs - always check!`;
      }
      // General queries
      else {
        response = `🌟 **Welcome! Let me help you find exactly what you need**\n\n🔍 **Tell me more about:**\n• "I need help with school fees" → Education support\n• "I'm facing financial difficulties" → Emergency aid\n• "I want to join activities" → Youth programs\n• "I need counseling support" → Family services\n\n⚡ **Quick Actions:**\n📞 **Urgent help:** 1800 295 3333 (24/7)\n📧 **General info:** queries@sinda.org.sg\n📍 **Visit:** 1 Beatty Road (9AM-6PM)\n💬 **WhatsApp:** 9123 4567\n\n🎯 **Most Popular Right Now:**\n• STEP tuition registration (closes soon!)\n• Emergency financial aid\n• Youth job placement program\n\n❓ **What specific help do you need today?**`;
      }
      
      // Add AI response
      setMessages(prev => {
        const aiMessage = {
          id: prev.length + Date.now(),
          content: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            aiGenerated: true,
            confidence: 0.98,
            sentiment: 'helpful',
            responseType: 'actionable'
          }
        };
        return [...prev, aiMessage];
      });
      
      setIsTyping(false);
    }, 1200);
  }, []); // NO dependencies that could cause re-renders

  // FIXED: Direct message sending function - completely stable
  const sendDirectMessage = useCallback((message) => {
    if (!message?.trim() || isTyping) return;
    
    // Add user message immediately
    setMessages(prev => {
      const newMessage = {
        id: prev.length + Date.now(),
        content: message.trim(),
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: { triggerType: 'programButton' }
      };
      return [...prev, newMessage];
    });
    
    setIsTyping(true);

    // Generate response based on message content
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let response = '';

      // Educational queries
      if (lowerMessage.includes('education')) {
        response = `🎓 **Education Programs - Let's Get You Started!**\n\n✅ **Immediate Actions You Can Take:**\n1. **Call now:** 1800 295 3333 (Mon-Fri 9AM-6PM)\n2. **Walk-in:** 1 Beatty Road, Level 2 Registration Counter\n3. **Required documents:** IC, latest report card, household income proof\n\n💰 **STEP Program:** Only $10-15/hour (90% subsidy!)\n📊 **Success rate:** 94.7% pass rate\n🎯 **Available for:** Primary 1 to JC2, all subjects\n\n⚡ **Fast-track application:** Mention "URGENT" for priority processing`;
      }
      // Family services
      else if (lowerMessage.includes('family')) {
        response = `👨‍👩‍👧‍👦 **Family Services - We're Here for You**\n\n💙 **Get Help Today:**\n• **24/7 Crisis Line:** 1800 295 3333\n• **Walk-in Counseling:** 1 Beatty Road Level 4 (9AM-8PM)\n• **Online booking:** sinda.org.sg/book-counseling\n\n🤝 **Professional Services:**\n✅ Individual counseling (free)\n✅ Family therapy sessions\n✅ Emergency financial assistance\n✅ Crisis intervention\n\n👥 **Our Counselors Speak:**\n• English, Tamil, Hindi, Malayalam\n• All sessions 100% confidential`;
      }
      // Youth programs
      else if (lowerMessage.includes('youth')) {
        response = `🎯 **Youth Development - Join Today!**\n\n🚀 **Immediate Registration:**\n1. **WhatsApp:** 9123 4567 with "YOUTH SIGNUP"\n2. **Email:** youth@sinda.org.sg\n3. **Visit:** 1 Beatty Road Level 3 Youth Centre\n\n🎪 **This Month's Activities:**\n• **Leadership Workshop:** Every Sat 2-5PM\n• **Career Mentoring:** 1-on-1 sessions available\n• **Networking Night:** Last Fri of month\n\n💼 **Job Placement Support:**\n• Resume writing help\n• Interview preparation\n• 67% job placement rate!`;
      }
      // Community outreach
      else if (lowerMessage.includes('community')) {
        response = `🌍 **Community Outreach - Get Involved!**\n\n🚀 **Join Our Programs:**\n1. **Call:** 1800 295 3333\n2. **Visit:** 1 Beatty Road Community Centre\n3. **Email:** community@sinda.org.sg\n\n🎪 **Current Initiatives:**\n• **Door Knocking:** Community visits\n• **SINDA Bus:** Mobile services\n• **Community Events:** Regular gatherings\n• **Volunteer Programs:** Give back opportunities\n\n🎁 **Benefits:** Connect with neighbors, make a difference, build community!`;
      }
      // Default response
      else {
        response = `🌟 **Welcome! Let me help you find exactly what you need**\n\n⚡ **Quick Actions:**\n📞 **Urgent help:** 1800 295 3333 (24/7)\n📧 **General info:** queries@sinda.org.sg\n📍 **Visit:** 1 Beatty Road (9AM-6PM)\n💬 **WhatsApp:** 9123 4567\n\n🎯 **Most Popular Programs:**\n• STEP tuition registration\n• Emergency financial aid\n• Youth leadership programs\n• Family counseling support`;
      }
      
      // Add AI response
      setMessages(prev => {
        const aiMessage = {
          id: prev.length + Date.now(),
          content: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            aiGenerated: true,
            confidence: 0.98,
            sentiment: 'helpful',
            responseType: 'programInfo'
          }
        };
        return [...prev, aiMessage];
      });
      
      setIsTyping(false);
    }, 1200);
  }, []); // NO dependencies to cause re-renders

  // Analytics Modal Component - FIXED VERSION
  const AnalyticsModal = React.memo(() => {
    if (!selectedAnalytic) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm border border-blue-200 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAnalytic.title}</h2>
              <button 
                onClick={() => setSelectedAnalytic(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedAnalytic.type === 'metric' && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAnalytic.data.details.map((detail, index) => (
                        <div key={index} className="bg-white/80 rounded-lg p-4">
                          <div className="text-sm text-gray-600">{detail.period}</div>
                          <div className="text-xl font-bold text-blue-600">{detail.value}</div>
                          <div className="text-xs text-green-600">{detail.change}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      {selectedAnalytic.data.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-sm text-gray-700">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {selectedAnalytic.type === 'chart' && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <p className="text-gray-700 mb-4">{selectedAnalytic.data.summary}</p>
                    
                    {selectedAnalytic.data.breakdown && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {selectedAnalytic.data.breakdown.map((item, index) => (
                          <div key={index} className="bg-white/80 rounded-lg p-4">
                            <div className="text-sm text-gray-600">{item.metric}</div>
                            <div className="text-xl font-bold text-blue-600">{item.value}</div>
                            <div className="text-xs text-green-600">{item.change}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {selectedAnalytic.data.topPrograms && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Top Performing Programs</h4>
                        <div className="space-y-2">
                          {selectedAnalytic.data.topPrograms.map((program, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/80 rounded-lg p-3">
                              <span className="text-sm font-medium text-gray-700">{program.name}</span>
                              <div className="text-right">
                                <div className="text-sm font-bold text-blue-600">{program.users.toLocaleString()}</div>
                                <div className="text-xs text-green-600">{program.growth}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedAnalytic.data.programDetails && (
                      <div className="space-y-4">
                        {selectedAnalytic.data.programDetails.map((program, index) => (
                          <div key={index} className="bg-white/80 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-800">{program.name}</h4>
                              <span className="text-lg font-bold text-blue-600">{program.percentage}%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Beneficiaries: </span>
                                <span className="font-medium">{program.beneficiaries.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Budget: </span>
                                <span className="font-medium">{program.budget}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Growth: </span>
                                <span className="font-medium text-green-600">{program.growth}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Satisfaction: </span>
                                <span className="font-medium">{program.satisfaction}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Waiting List: </span>
                                <span className="font-medium">{program.waitingList}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // FIXED: Robust auto-scroll - only when new messages AND user hasn't manually scrolled
  useEffect(() => {
    // Check if we actually have NEW messages (count increased)
    const hasNewMessages = messages.length > previousMessageCountRef.current;
    
    // Only scroll if:
    // 1. We have new messages (not just state updates)
    // 2. Auto-scroll is enabled
    // 3. User hasn't manually scrolled away
    // 4. The scroll container exists
    if (hasNewMessages && autoScroll && !userScrolled && messageScrollRef.current) {
      // Use scrollTo instead of scrollIntoView for more reliable behavior
      messageScrollRef.current.scrollTo({
        top: messageScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    
    // Update previous count only if it hasn't been updated by addMessage
    if (messages.length !== previousMessageCountRef.current) {
      previousMessageCountRef.current = messages.length;
    }
  }, [messages.length, autoScroll, userScrolled]); // Depend on length and user scroll state

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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

  // Programs Page Component
  const ProgramsPage = React.memo(() => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Programs Header */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">SINDA Programs & Services</h2>
        <p className="text-blue-100 mb-4">Comprehensive support for the Indian community in Singapore</p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{programCategories.reduce((sum, cat) => sum + cat.beneficiaries, 0).toLocaleString()} total beneficiaries served</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} />
            <span>${(programCategories.reduce((sum, cat) => sum + cat.budget, 0) / 1000000).toFixed(1)}M total budget</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>96.2% average success rate</span>
          </div>
        </div>
      </div>

      {/* Program Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {programCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Priority badges */}
              {category.priority === 'critical' && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  🚨 Critical Priority
                </div>
              )}
              {category.featured && (
                <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full font-medium">
                  ⭐ Featured Program
                </div>
              )}
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-white" size={32} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{category.beneficiaries.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">beneficiaries</div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-lg font-bold text-blue-600">{category.successRate}%</div>
                    <div className="text-xs text-blue-500">Success Rate</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-lg font-bold text-green-600">${(category.budget / 1000).toLocaleString()}K</div>
                    <div className="text-xs text-green-500">Annual Budget</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-lg font-bold text-purple-600">{category.count}</div>
                    <div className="text-xs text-purple-500">Available</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-lg font-bold text-orange-600">{category.averageWaitTime}</div>
                    <div className="text-xs text-orange-500">Wait Time</div>
                  </div>
                </div>

                {/* Programs list */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Available Programs:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.programs.map((program, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('chat');
                      sendDirectMessage(`I want to apply for ${category.title}`);
                    }}
                    className={`flex-1 bg-gradient-to-r ${category.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <Send size={16} />
                    Apply Now
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('chat');
                      sendDirectMessage(`Tell me more about ${category.title}`);
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Info size={16} />
                    Learn More
                  </button>
                </div>

                {/* Waiting list indicator */}
                {category.waitingList > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 text-sm">
                      <Clock size={16} />
                      <span>{category.waitingList} people currently on waiting list</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Help Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Need Quick Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickHelp.slice(0, 8).map((help, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentView('chat');
                sendDirectMessage(help.text);
              }}
              className={`border rounded-xl p-4 text-sm text-left transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                help.priority === 'urgent' ? 'border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100' :
                help.priority === 'high' ? 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100' :
                help.priority === 'medium' ? 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100' :
                'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-gray-800 mb-2">{help.text}</div>
              <div className="text-xs text-gray-500 mb-2">
                {help.priority === 'urgent' ? '⚡ Immediate response' :
                 help.priority === 'high' ? '🚀 Fast-track available' :
                 help.priority === 'medium' ? '📅 Same-day service' :
                 '💬 General information'}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>~{help.estimatedTime}</span>
                <span>{help.successRate}% success</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Get Started Today</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Call Us</h4>
            <p className="text-gray-600 text-sm mb-3">24/7 Hotline for urgent support</p>
            <p className="text-blue-600 font-medium">1800 295 3333</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Visit Us</h4>
            <p className="text-gray-600 text-sm mb-3">Walk-in services available</p>
            <p className="text-green-600 font-medium">1 Beatty Road<br />Singapore 209943</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Chat Online</h4>
            <p className="text-gray-600 text-sm mb-3">AI-powered instant support</p>
            <button
              onClick={() => setCurrentView('chat')}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200"
            >
              Start Chat →
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  // Chat Interface Component
  const ChatInterface = React.memo(() => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Main Chat Box */}
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

          {/* Messages Area */}
          <div 
            ref={messageScrollRef}
            className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50 backdrop-blur-sm relative" 
            style={{ 
              minHeight: '384px', 
              maxHeight: '384px'
            }}
            onScroll={handleScroll}
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-blue-400 mb-4">
                  <MessageCircle size={48} className="mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
                <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or application processes</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                  {[
                    { text: 'Apply for STEP tuition now', priority: 'high', icon: '🎓', action: 'education' },
                    { text: 'I need emergency financial help', priority: 'urgent', icon: '🚨', action: 'emergency' },
                    { text: 'Join youth programs', priority: 'medium', icon: '🎯', action: 'youth' },
                    { text: 'Family counseling services', priority: 'high', icon: '👨‍👩‍👧‍👦', action: 'family' },
                    { text: 'Check my eligibility', priority: 'medium', icon: '📋', action: 'eligibility' },
                    { text: 'What services do you offer?', priority: 'low', icon: '❓', action: 'general' }
                  ].map((help, index) => (
                    <button
                      key={index}
                      onClick={() => sendDirectMessage(help.text)}
                      className={`border rounded-xl p-4 text-sm text-left transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        help.priority === 'urgent' ? 'border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100' :
                        help.priority === 'high' ? 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100' :
                        help.priority === 'medium' ? 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100' :
                        'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                      }`}
                      disabled={isLoading}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{help.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{help.text}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {help.priority === 'urgent' ? '⚡ Immediate response' :
                             help.priority === 'high' ? '🚀 Fast-track available' :
                             help.priority === 'medium' ? '📅 Same-day service' :
                             '💬 General information'}
                          </div>
                        </div>
                        {help.priority === 'urgent' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
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
            <div ref={messagesEndRef} style={{ height: '1px', flexShrink: 0 }} />
            
            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={scrollToBottom}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center gap-2"
                  title="Scroll to bottom"
                >
                  <ArrowRight size={16} className="rotate-90" />
                  <span className="text-xs hidden sm:inline">
                    {messages.length > previousMessageCountRef.current ? 
                      `${messages.length - previousMessageCountRef.current} new` : 
                      'New messages'
                    }
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
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
                    className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                    rows="2"
                    disabled={isTyping}
                    maxLength={2000}
                    autoComplete="off"
                    spellCheck="true"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {inputMessage.length}/2000
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setInputMessage("I need emergency financial help right now");
                      stableInputRef.current = "I need emergency financial help right now";
                    }}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors duration-200 flex items-center gap-1"
                    disabled={isTyping}
                  >
                    🚨 Emergency Help
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("I want to apply for STEP tuition");
                      stableInputRef.current = "I want to apply for STEP tuition";
                    }}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200 flex items-center gap-1"
                    disabled={isTyping}
                  >
                    🎓 Apply Now
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("How do I join youth programs?");
                      stableInputRef.current = "How do I join youth programs?";
                    }}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors duration-200 flex items-center gap-1"
                    disabled={isTyping}
                  >
                    🎯 Join Youth
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("I need family counseling support");
                      stableInputRef.current = "I need family counseling support";
                    }}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors duration-200 flex items-center gap-1"
                    disabled={isTyping}
                  >
                    👨‍👩‍👧‍👦 Counseling
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
                    setAutoScroll(true);
                    setUserScrolled(false);
                    previousMessageCountRef.current = 0;
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
    );
  });

  // Dashboard Component
  const MainDashboard = React.memo(() => (
    <div className="space-y-8 p-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to SINDA Dashboard</h2>
        <p className="text-blue-100 mb-4">Your comprehensive overview of community support and engagement</p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Interactions', value: '247', icon: MessageCircle, color: 'blue' },
          { label: 'Emergency Cases', value: '12', icon: AlertTriangle, color: 'red' },
          { label: 'New Applications', value: '34', icon: FileText, color: 'green' },
          { label: 'System Health', value: '99.97%', icon: Shield, color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity and trending programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.trendingTopics.slice(0, 5).map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                <div>
                  <div className="text-sm font-medium text-gray-800">{topic.topic}</div>
                  <div className="text-xs text-gray-500">{topic.category} • {topic.timeToResolve}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">{topic.count}</div>
                  <div className="text-xs text-green-600">{topic.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${performanceMetrics.cpuUsage}%`}}
                  ></div>
                </div>
                <span className="text-sm font-medium">{performanceMetrics.cpuUsage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${performanceMetrics.memoryUsage}%`}}
                  ></div>
                </div>
                <span className="text-sm font-medium">{performanceMetrics.memoryUsage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cache Hit Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${performanceMetrics.cacheHitRate}%`}}
                  ></div>
                </div>
                <span className="text-sm font-medium">{performanceMetrics.cacheHitRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Analytics Dashboard Component
  const AnalyticsDashboard = React.memo(() => (
    <div className="space-y-8 p-6">
      {/* Real-time metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Active Users', 
            value: analyticsData.realTimeMetrics.activeUsers, 
            change: '+15%', 
            color: 'blue', 
            icon: Users,
            trend: 'up'
          },
          { 
            label: 'Families Helped', 
            value: analyticsData.helpMetrics.totalFamiliesHelped.toLocaleString(), 
            change: '+234', 
            color: 'cyan', 
            icon: Heart,
            trend: 'up'
          },
          { 
            label: 'Response Time', 
            value: `${analyticsData.realTimeMetrics.responseTime}s`, 
            change: '-0.3s', 
            color: 'green', 
            icon: Clock,
            trend: 'down'
          },
          { 
            label: 'Satisfaction', 
            value: `${analyticsData.realTimeMetrics.averageSatisfaction}/5`, 
            change: '+0.2', 
            color: 'purple', 
            icon: Star,
            trend: 'up'
          }
        ].map((metric, index) => (
          <div 
            key={index} 
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:scale-105 transition-all duration-500 cursor-pointer"
            onClick={() => setSelectedAnalytic({
              type: 'metric',
              title: metric.label,
              data: {
                current: metric.value,
                change: metric.change,
                trend: metric.trend,
                details: [
                  { period: 'Today', value: metric.value, change: '+5%' },
                  { period: 'This Week', value: metric.trend === 'up' ? '1,847' : '2.1s', change: metric.change },
                  { period: 'This Month', value: metric.trend === 'up' ? '7,293' : '1.8s', change: '+12%' },
                  { period: 'This Year', value: metric.trend === 'up' ? '89,456' : '1.4s', change: '+28%' }
                ],
                insights: [
                  `${metric.label} has been ${metric.trend === 'up' ? 'increasing' : 'improving'} consistently`,
                  `Peak performance observed during business hours (9 AM - 5 PM)`,
                  `Mobile users contribute 65% of the activity`,
                  `Weekend performance shows 15% variance from weekday averages`
                ]
              }
            })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <p className={`text-3xl font-bold text-${metric.color}-600 mt-2`}>{metric.value}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 ${metric.trend === 'up' ? 'bg-green-400' : 'bg-blue-400'} rounded-full animate-pulse mr-2`}></div>
                  <span className={`${metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'} text-xs`}>
                    {metric.change} from last week
                  </span>
                </div>
              </div>
              <div className={`bg-${metric.color}-100 p-3 rounded-xl`}>
                <metric.icon className={`text-${metric.color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly engagement trend */}
        <div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => setSelectedAnalytic({
            type: 'chart',
            title: 'Monthly Engagement Details',
            data: {
              summary: 'User engagement has grown 24% over the past 6 months',
              breakdown: [
                { metric: 'New Users', value: '2,847', change: '+18%' },
                { metric: 'Returning Users', value: '5,629', change: '+31%' },
                { metric: 'Session Duration', value: '8.4 min', change: '+12%' },
                { metric: 'Pages per Session', value: '4.2', change: '+8%' }
              ],
              topPrograms: [
                { name: 'STEP Tuition', users: 3420, growth: '+25%' },
                { name: 'Financial Aid', users: 2180, growth: '+45%' },
                { name: 'Youth Development', users: 1650, growth: '+15%' },
                { name: 'Family Services', users: 1340, growth: '+38%' }
              ]
            }
          })}
        >
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

        {/* Program distribution */}
        <div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => setSelectedAnalytic({
            type: 'chart',
            title: 'Program Distribution Analysis',
            data: {
              summary: 'Education Support leads with 42% of total beneficiaries',
              programDetails: [
                { 
                  name: 'Education Support', 
                  percentage: 42, 
                  beneficiaries: 5234,
                  budget: '$850,000',
                  growth: '+15%',
                  satisfaction: '96.2%',
                  waitingList: 234
                },
                { 
                  name: 'Family Services', 
                  percentage: 28, 
                  beneficiaries: 3489,
                  budget: '$640,000', 
                  growth: '+22%',
                  satisfaction: '97.8%',
                  waitingList: 45
                },
                { 
                  name: 'Youth Development', 
                  percentage: 18, 
                  beneficiaries: 2245,
                  budget: '$320,000',
                  growth: '+8%',
                  satisfaction: '94.5%',
                  waitingList: 89
                },
                { 
                  name: 'Community Outreach', 
                  percentage: 12, 
                  beneficiaries: 1496,
                  budget: '$280,000',
                  growth: '+35%',
                  satisfaction: '92.1%',
                  waitingList: 12
                }
              ]
            }
          })}
        >
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
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800">{item.count.toLocaleString()}</span>
                  <div className="text-xs text-green-600">{item.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));

  // WhatsApp Interface Component
  const WhatsAppInterface = React.memo(() => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200 overflow-hidden shadow-2xl">
        {/* WhatsApp Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">SINDA WhatsApp</h3>
                <p className="text-green-100 text-sm">24/7 Community Support</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div>Active Chats: {whatsappStats.activeChats}</div>
              <div>Response Rate: {whatsappStats.responseRate}%</div>
            </div>
          </div>
        </div>

        {/* WhatsApp Stats */}
        <div className="bg-green-50 p-4 border-b border-green-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Messages', value: whatsappStats.totalMessages.toLocaleString() },
              { label: 'Avg Response', value: `${whatsappStats.avgResponseTime}min` },
              { label: 'Satisfaction', value: `${whatsappStats.satisfactionScore}/5` },
              { label: 'Resolution Rate', value: `${whatsappStats.resolutionRate}%` }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-green-700">{stat.value}</div>
                <div className="text-xs text-green-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Chat Simulation */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50">
          {whatsappMessages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Phone size={48} className="mx-auto mb-4 text-green-400" />
              <p>WhatsApp conversation will appear here</p>
              <p className="text-sm mt-2">Start by sending a test message below</p>
            </div>
          )}
          
          {whatsappMessages.map((msg, index) => (
            <div key={msg.id} className={`flex mb-3 ${msg.isIncoming ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.isIncoming 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-green-500 text-white'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <div className={`text-xs mt-1 ${msg.isIncoming ? 'text-gray-500' : 'text-green-100'}`}>
                  {msg.timestamp}
                  {!msg.isIncoming && (
                    <span className="ml-2">
                      {msg.delivered && '✓'}
                      {msg.read && '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a WhatsApp message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const message = e.target.value.trim();
                  const newMsg = {
                    id: Date.now(),
                    content: message,
                    isIncoming: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    platform: 'whatsapp'
                  };
                  setWhatsappMessages(prev => [...prev, newMsg]);
                  
                  // Simulate AI response
                  setTimeout(() => {
                    const responseMsg = {
                      id: Date.now() + 1,
                      content: "Thank you for contacting SINDA! 🙏 I'll help you find the right support. What assistance do you need today?",
                      isIncoming: false,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      platform: 'whatsapp',
                      delivered: true,
                      read: false
                    };
                    setWhatsappMessages(prev => [...prev, responseMsg]);
                  }, 1000);
                  
                  e.target.value = '';
                }
              }}
            />
            <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

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
                { key: 'programs', label: 'Programs', icon: BookOpen },
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
          {currentStep === 'chat' && currentView === 'dashboard' && <MainDashboard />}
          {currentStep === 'chat' && currentView === 'programs' && <ProgramsPage />}
          {currentStep === 'chat' && currentView === 'chat' && <ChatInterface />}
          {currentStep === 'chat' && currentView === 'whatsapp' && <WhatsAppInterface />}
          {currentStep === 'chat' && currentView === 'analytics' && <AnalyticsDashboard />}
        </Suspense>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal />

      {/* Settings Modal */}
      <SettingsModal />

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
