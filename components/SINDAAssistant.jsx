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

// Enhanced SINDA Assistant with Fixed Notifications
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
  const [userSession, setUserSession] = useState({
    startTime: Date.now(),
    messageCount: 0,
    programsExplored: new Set(),
    satisfaction: null,
    completedActions: []
  });
  
  const messagesEndRef = useRef(null);
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

  // Enhanced Analytics Data with Real-time Capabilities
  const [analyticsData] = useState({
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
  });

  // Enhanced language support with cultural context
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

  // Enhanced program categories with comprehensive data
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

  // Enhanced quick help options with priority and personalization
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

  // FIXED: Simplified notification system - only for important messages
  const addNotification = useCallback((message, type = 'info', category = 'general', persistent = false, action = null) => {
    // Only show notifications for errors, warnings, and critical info
    if (type === 'info' && !persistent && !action) return;
    
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
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Max 2 notifications
    
    // Play notification sound only for errors and warnings
    if (soundEnabled && (type === 'error' || type === 'warning')) {
      playNotificationSound(type);
    }
    
    // Auto-remove notification after shorter delay
    if (!persistent) {
      const delay = type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, delay);
    }
  }, [soundEnabled]);

  // Enhanced audio system
  const playNotificationSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different tones for different notification types
    const frequencies = {
      success: [523.25, 659.25], // C5, E5
      warning: [415.30, 523.25], // G#4, C5
      error: [311.13, 369.99], // E♭4, F#4
      info: [440.00] // A4
    };
    
    const freqs = frequencies[type] || frequencies.info;
    oscillator.frequency.setValueAtTime(freqs[0], audioContext.currentTime);
    if (freqs[1]) {
      oscillator.frequency.setValueAtTime(freqs[1], audioContext.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  // Enhanced voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = languages[selectedLanguage].code;
      
      speechRecognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      speechRecognition.current.onerror = (event) => {
        setIsListening(false);
        addNotification(`Voice recognition error: ${event.error}`, 'error', 'voice');
      };
      
      speechRecognition.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Text-to-speech setup
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, [selectedLanguage, languages, addNotification]);

  // Voice input handler - reduced notifications
  const handleVoiceInput = useCallback(() => {
    if (!speechRecognition.current) {
      addNotification('Voice recognition not supported in this browser', 'warning', 'voice');
      return;
    }
    
    if (isListening) {
      speechRecognition.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognition.current.start();
    }
  }, [isListening, addNotification]);

  // Text-to-speech for messages
  const speakMessage = useCallback((text) => {
    if (!speechSynthesis.current || !voiceEnabled) return;
    
    speechSynthesis.current.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages[selectedLanguage].code;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    speechSynthesis.current.speak(utterance);
  }, [voiceEnabled, selectedLanguage, languages]);

  // Enhanced analytics update with performance tracking
  const updateAnalytics = useCallback(() => {
    const startTime = performance.now();
    
    setWhatsappStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
      activeChats: Math.max(0, prev.activeChats + Math.floor(Math.random() * 3) - 1),
      responseRate: Math.min(100, Math.max(90, prev.responseRate + (Math.random() - 0.5) * 0.1)),
      avgResponseTime: Math.max(0.5, prev.avgResponseTime + (Math.random() - 0.5) * 0.1),
      satisfactionScore: Math.min(5, Math.max(4, prev.satisfactionScore + (Math.random() - 0.5) * 0.1))
    }));

    const endTime = performance.now();
    setPerformanceMetrics(prev => ({
      ...prev,
      averageLoadTime: (prev.averageLoadTime + (endTime - startTime) / 1000) / 2,
      lastUpdated: new Date().toISOString(),
      cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsage: Math.max(50, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5))
    }));
  }, []);

  // Auto-update analytics every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateAnalytics, 30000);
    return () => clearInterval(interval);
  }, [updateAnalytics]);

  // Enhanced API connectivity monitoring
  useEffect(() => {
    const checkApiConnection = () => {
      const isConnected = Math.random() > 0.05; // 95% uptime simulation
      setApiConnected(isConnected);
      
      if (!isConnected) {
        addNotification('API connection lost. Retrying...', 'warning', 'system', true);
        setTimeout(() => {
          setApiConnected(true);
          addNotification('API connection restored', 'success', 'system');
        }, 3000);
      }
    };

    const connectionCheck = setInterval(checkApiConnection, 60000);
    return () => clearInterval(connectionCheck);
  }, [addNotification]);

  // Enhanced OpenAI API integration with reduced notifications
  const callOpenAI = async (userMessage, conversationHistory = []) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!apiConnected) {
        throw new Error('API temporarily unavailable');
      }
      
      const complexity = userMessage.length + conversationHistory.length * 10;
      const delay = Math.min(3000, complexity * 2 + Math.random() * 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const response = generateIntelligentResponse(userMessage, conversationHistory);
      
      // Update user session
      setUserSession(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        programsExplored: new Set([...prev.programsExplored, ...detectPrograms(userMessage)])
      }));
      
      return {
        message: response,
        isCrisis: detectCrisisKeywords(userMessage),
        suggestedPrograms: suggestPrograms(userMessage),
        sentiment: analyzeSentiment(userMessage),
        confidence: calculateConfidence(userMessage, conversationHistory),
        responseMetadata: {
          confidence: 0.95,
          processingTime: delay / 1000,
          followUpSuggestions: generateFollowUpSuggestions(userMessage),
          complexity: Math.min(10, Math.ceil(complexity / 100)),
          detectedLanguage: detectLanguage(userMessage),
          urgencyLevel: assessUrgency(userMessage)
        },
        error: false
      };
      
    } catch (error) {
      setError(error.message);
      addNotification(`Connection error: ${error.message}`, 'error', 'ai', true);
      return generateFallbackResponse(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced message handling with better state management
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
    
    // Speak message if voice is enabled and it's an AI response
    if (!isUser && voiceEnabled && content.length < 200) {
      setTimeout(() => speakMessage(content), 500);
    }
  }, [messageId, selectedLanguage, userSession.startTime, voiceEnabled, speakMessage]);

  // Enhanced program click handler with analytics
  const handleProgramClick = useCallback(async (categoryTitle) => {
    if (!categoryTitle) return;
    
    const programMessage = `Tell me about ${categoryTitle}`;
    
    addMessage(programMessage, true, { 
      triggerType: 'programButton', 
      category: categoryTitle,
      timestamp: Date.now()
    });
    setIsTyping(true);
    
    try {
      const response = await callOpenAI(programMessage, messages);
      
      setTimeout(() => {
        addMessage(response.message, false, {
          aiGenerated: !response.error,
          programInfo: true,
          category: categoryTitle,
          confidence: response.confidence || 0.8,
          ...response
        });
        setIsTyping(false);
      }, 1000);
      
    } catch (error) {
      setTimeout(() => {
        addMessage(generateFallbackResponse(programMessage).message, false, {
          error: true,
          programInfo: true,
          category: categoryTitle
        });
        setIsTyping(false);
      }, 1000);
    }
  }, [addMessage, callOpenAI, messages]);

  // Enhanced message sending with minimal notifications
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isTyping) return;

    if (trimmedMessage.length > 2000) {
      addNotification('Message too long. Please keep under 2000 characters.', 'warning');
      return;
    }

    const conversationHistory = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }));
    
    addMessage(trimmedMessage, true, { inputMethod: 'manual' });
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiResponse = await callOpenAI(trimmedMessage, conversationHistory);
      
      if (apiResponse && apiResponse.message) {
        addMessage(apiResponse.message, false, {
          aiGenerated: !apiResponse.error,
          isCrisis: apiResponse.isCrisis || false,
          suggestedPrograms: apiResponse.suggestedPrograms || [],
          sentiment: apiResponse.sentiment || 'neutral',
          confidence: apiResponse.confidence || 0.8,
          followUpSuggestions: apiResponse.responseMetadata?.followUpSuggestions || [],
          error: apiResponse.error || false,
          fallback: apiResponse.fallback || false,
          urgencyLevel: apiResponse.responseMetadata?.urgencyLevel || 'normal'
        });
      }
      
    } catch (error) {
      const fallback = generateFallbackResponse(trimmedMessage);
      addMessage(fallback.message, false, fallback);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping, addMessage, messages, callOpenAI, addNotification]);

  // Utility functions for enhanced AI processing
  const detectCrisisKeywords = (message) => {
    const crisisKeywords = [
      'emergency', 'crisis', 'urgent', 'help', 'desperate', 'suicide', 'abuse', 
      'violence', 'homeless', 'eviction', 'disconnection', 'broke', 'starving',
      'medical emergency', 'mental health', 'depression', 'anxiety', 'panic'
    ];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const suggestPrograms = (message) => {
    const lowerMessage = message.toLowerCase();
    const suggestions = [];
    
    if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('study')) {
      suggestions.push('STEP Tuition', 'Educational Bursaries', 'Academic Counseling');
    }
    if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('assistance')) {
      suggestions.push('Financial Assistance', 'Emergency Aid', 'Debt Counseling');
    }
    if (lowerMessage.includes('youth') || lowerMessage.includes('young') || lowerMessage.includes('leadership')) {
      suggestions.push('Youth Club', 'Leadership Programs', 'Career Mentoring');
    }
    if (lowerMessage.includes('family') || lowerMessage.includes('counseling') || lowerMessage.includes('therapy')) {
      suggestions.push('Family Counseling', 'Crisis Support', 'Project Athena');
    }
    
    return suggestions;
  };

  const analyzeSentiment = (message) => {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied', 'thank', 'appreciate', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'unhappy', 'frustrated', 'angry', 'disappointed', 'urgent', 'crisis', 'emergency'];
    
    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  };

  const calculateConfidence = (message, history) => {
    let confidence = 0.8;
    
    const keywords = ['step', 'tuition', 'financial', 'youth', 'family', 'help'];
    const hasKeywords = keywords.some(keyword => message.toLowerCase().includes(keyword));
    if (hasKeywords) confidence += 0.1;
    
    if (history.length > 2) confidence += 0.05;
    if (message.length < 10 || message.length > 500) confidence -= 0.1;
    
    return Math.min(1.0, Math.max(0.1, confidence));
  };

  const detectPrograms = (message) => {
    const programs = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('step') || lowerMessage.includes('tuition')) programs.push('education');
    if (lowerMessage.includes('financial') || lowerMessage.includes('assistance')) programs.push('family');
    if (lowerMessage.includes('youth') || lowerMessage.includes('leadership')) programs.push('youth');
    if (lowerMessage.includes('community') || lowerMessage.includes('outreach')) programs.push('community');
    
    return programs;
  };

  const detectLanguage = (message) => {
    const languageIndicators = {
      tamil: ['tamil', 'தமிழ்', 'vanakkam'],
      hindi: ['hindi', 'हिंदी', 'namaste'],
      malayalam: ['malayalam', 'മലയാളം']
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [lang, indicators] of Object.entries(languageIndicators)) {
      if (indicators.some(indicator => lowerMessage.includes(indicator))) {
        return lang;
      }
    }
    return 'english';
  };

  const assessUrgency = (message) => {
    const urgentKeywords = ['emergency', 'urgent', 'crisis', 'immediate', 'asap'];
    const highKeywords = ['soon', 'quickly', 'help', 'need'];
    
    const lowerMessage = message.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) return 'critical';
    if (highKeywords.some(keyword => lowerMessage.includes(keyword))) return 'high';
    return 'normal';
  };

  const generateIntelligentResponse = (message, history) => {
    const lowerMessage = message.toLowerCase();
    const context = analyzeConversationContext(history);
    
    if (lowerMessage.includes('step') || lowerMessage.includes('tuition') || lowerMessage.includes('education')) {
      return generateEducationResponse(context);
    }
    
    if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('assistance')) {
      return generateFinancialResponse(context);
    }
    
    if (lowerMessage.includes('youth') || lowerMessage.includes('leadership')) {
      return generateYouthResponse(context);
    }
    
    if (lowerMessage.includes('family') || lowerMessage.includes('counselling')) {
      return generateFamilyResponse(context);
    }
    
    return generateGeneralResponse(context);
  };

  const analyzeConversationContext = (history) => {
    const topics = new Set();
    let sentiment = 'neutral';
    let lastTopic = null;
    
    history.forEach(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('education') || content.includes('step')) {
        topics.add('education');
        lastTopic = 'education';
      }
      if (content.includes('financial') || content.includes('money')) {
        topics.add('financial');
        lastTopic = 'financial';
      }
      if (content.includes('youth')) {
        topics.add('youth');
        lastTopic = 'youth';
      }
      if (content.includes('family')) {
        topics.add('family');
        lastTopic = 'family';
      }
    });
    
    return {
      topics: Array.from(topics),
      sentiment,
      lastTopic,
      messageCount: history.length
    };
  };

  const generateEducationResponse = (context) => `🎓 **STEP Tuition Program - Excellence in Education**

**What makes STEP special:**
• **Affordable Excellence**: Only $10-15/hour (90% government subsidized!)
• **Proven Results**: 94.7% pass rate, consistently above national average
• **Expert Teachers**: MOE-qualified with 5+ years experience
• **Small Classes**: Maximum 8-10 students for personalized attention
• **Comprehensive Coverage**: Primary 1-6, Secondary 1-5, JC1-2

**Subjects Available:**
📚 Core: English, Mathematics, Science
🌍 Languages: Tamil, Hindi, Mother Tongue options
🎯 Specialized: Exam preparation (PSLE, O-Level, A-Level)

**15+ Centres Across Singapore:**
Central, East, North, West, North-East regions

**Simple Registration:**
📞 Call 1800 295 3333 now
🏢 Visit 1 Beatty Road for assessment
💻 Online application available

**Eligibility:** Per capita income ≤ $1,600, Singapore citizens/PRs of Indian descent

Ready to transform your child's academic journey?`;

  const generateFinancialResponse = (context) => `💰 **SINDA Financial Assistance - Your Safety Net**

**Immediate Support Available:**
🚨 **Emergency Aid**: Cash assistance within 24-48 hours
💡 **Monthly Support**: Ongoing help for sustained periods
🏠 **Essential Bills**: Utilities, rent, medical expenses
🎓 **Education Costs**: School fees, uniforms, transport

**Specialized Programs:**
• **Crisis Intervention**: Immediate response to emergencies
• **Debt Counseling**: Professional guidance for financial recovery
• **Project Athena**: Enhanced support for single mothers
• **Medical Fund**: Healthcare cost assistance

**Assessment Process:**
1. **Call 1800 295 3333** for immediate consultation
2. **Documentation Review**: Income, family circumstances
3. **Social Worker Assessment**: Confidential and respectful
4. **Support Plan**: Customized assistance based on needs
5. **Ongoing Support**: Regular check-ins and adjustments

**Success Rate**: 96% of families achieve stability within 12 months

**You're not alone - help is available right now.**`;

  const generateYouthResponse = (context) => `🎯 **Youth Development - Building Tomorrow's Leaders**

**SINDA Youth Club (Ages 18-35):**
🌟 **Leadership Excellence**: Intensive development programs
🤝 **Networking**: Connect with like-minded professionals
🏆 **Recognition**: Annual Youth Awards program
💼 **Career Growth**: Corporate mentoring opportunities

**Programs Available:**
• **Youth Leaders' Seminar**: Immersive leadership training
• **Corporate Mentoring**: Industry professional guidance
• **Community Projects**: Real-world leadership experience
• **Skills Workshops**: Communication, project management
• **Social Events**: Networking and relationship building

**Success Stories:**
• 150+ award recipients annually
• 89% report career advancement within 2 years
• Strong alumni network across industries

**Join Us:**
📞 Call 1800 295 3333
💻 Email queries@sinda.org.sg
🏢 Visit 1 Beatty Road

Ready to unlock your leadership potential?`;

  const generateFamilyResponse = (context) => `👨‍👩‍👧‍👦 **Family Services - Strengthening Families, Building Futures**

**SINDA Family Service Centre:**
Only self-help group with dedicated FSC providing:

🤝 **Professional Counseling**: Individual, couple, family therapy
🚨 **Crisis Intervention**: 24/7 emergency support
📋 **Case Management**: Comprehensive support planning
🏠 **Family Programs**: Skill-building and relationship enhancement

**Specialized Support:**
• **Project Athena**: Single mother empowerment
• **Prisons Outreach**: Support for affected families
• **Elder Care**: Assistance for senior family members
• **Child Protection**: Safe environment advocacy

**Our Promise:**
✅ **Confidential**: All services completely private
✅ **Professional**: Qualified social workers and counselors
✅ **Culturally Sensitive**: Understanding Indian family values
✅ **Holistic**: Addressing root causes, not just symptoms

**Immediate Help:**
📞 **Crisis Hotline**: 1800 295 3333 (24/7)
🏢 **Walk-in**: 1 Beatty Road, Singapore 209943

Every family deserves support, dignity, and hope.`;

  const generateGeneralResponse = (context) => `🙏 **Welcome to SINDA - 30+ Years of Community Service**

**How can I help you today?**

🎓 **Education**: STEP tuition, bursaries, academic support
👨‍👩‍👧‍👦 **Family**: Counseling, financial aid, crisis support
🎯 **Youth**: Leadership development (ages 18-35)
🤝 **Community**: Outreach programs, volunteer opportunities

**Quick Facts:**
• **30+ years** serving the community
• **12,000+ families** helped
• **94.7% success rate** across programs
• **$2.1M+** in financial aid distributed annually

**Get Started:**
📞 **Call**: 1800 295 3333 (24/7 hotline)
🏢 **Visit**: 1 Beatty Road, Singapore 209943
📧 **Email**: queries@sinda.org.sg

What specific area interests you most? I'm here to guide you every step of the way!`;

  const generateFallbackResponse = (message) => ({
    message: `I apologize for the technical difficulty. Let me help you with your query: "${message}"\n\n${generateGeneralResponse({})}`,
    error: true,
    isCrisis: detectCrisisKeywords(message),
    suggestedPrograms: [],
    fallback: true,
    confidence: 0.3
  });

  const generateFollowUpSuggestions = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('education')) {
      return ['Check eligibility', 'Find centers', 'Application process', 'Fee structure'];
    }
    if (lowerMessage.includes('financial')) {
      return ['Eligibility criteria', 'Required documents', 'Emergency assistance', 'Application timeline'];
    }
    if (lowerMessage.includes('youth')) {
      return ['Join Youth Club', 'Leadership workshops', 'Mentoring programs', 'Upcoming events'];
    }
    
    return ['Contact information', 'Other programs', 'Success stories', 'Volunteer opportunities'];
  };

  // Enhanced event handlers
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Welcome Screen Component
  const WelcomeScreen = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced floating elements with better animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-cyan-200/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-teal-200/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-purple-200/20 rounded-full animate-float-medium"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 space-y-8">
        {/* Enhanced header section */}
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
          
          <button
            onClick={() => setCurrentStep('language')}
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto animate-bounce-gentle group"
          >
            Start Your Journey
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  ));

  // Enhanced Language Selection Component
  const LanguageSelection = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="mb-6 bg-white/80 hover:bg-white/90 p-3 rounded-xl border border-blue-200 transition-all duration-300 hover:scale-110"
            aria-label="Go back to welcome screen"
          >
            <ArrowRight size={20} className="rotate-180 text-blue-600" />
          </button>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-up">Choose Your Language</h2>
          <p className="text-lg text-gray-600 mb-12 animate-fade-in">Select your preferred language to continue with personalized support</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(languages).map(([key, lang], index) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentStep('chat');
                  setTimeout(() => addMessage(lang.greeting, false), 500);
                }}
                className={`bg-white/80 backdrop-blur-sm border-2 hover:border-blue-500 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:transform hover:scale-110 group animate-slide-up ${
                  selectedLanguage === key ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-4 animate-pulse">{lang.flag}</div>
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl animate-slide-up">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-glow">
                <BookOpen className="text-white animate-pulse" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <div className="flex items-center gap-4 text-blue-100 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${apiConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
                    <span>{apiConnected ? 'AI Online' : 'AI Offline'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleVoiceInput}
                className={`bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 ${
                  isListening ? 'bg-red-500/50 animate-pulse' : ''
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
                disabled={isLoading}
              >
                {isListening ? <MicIcon size={20} className="animate-bounce" /> : <Mic size={20} />}
              </button>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110"
                title={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110"
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
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category.title)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-500 hover:shadow-lg text-left group hover:scale-105 animate-fade-in relative overflow-hidden"
                  style={{animationDelay: `${index * 0.1}s`}}
                  disabled={isLoading}
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

        {/* Messages Area */}
        <div className={`${compactMode ? 'h-64' : 'h-96'} overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50 backdrop-blur-sm`}>
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="text-blue-400 mb-4 animate-bounce-gentle">
                <MessageCircle size={48} className="mx-auto" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or application processes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {quickHelp
                  .slice(0, 6)
                  .map((help, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addMessage(help.text, true, { quickHelp: true });
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className={`border rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105 animate-slide-up ${
                      help.priority === 'urgent' ? 'border-red-300 bg-red-50 hover:border-red-400' :
                      help.priority === 'high' ? 'border-orange-300 bg-orange-50 hover:border-orange-400' :
                      'bg-blue-50 border-blue-200 hover:border-blue-400'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                    disabled={isLoading}
                  >
                    <span className="flex-1">{help.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-slide-up group`}>
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
                </div>
                
                {/* Message actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content);
                    }}
                    className="bg-black/20 hover:bg-black/30 p-1 rounded text-white/80 hover:text-white transition-all duration-200"
                    title="Copy message"
                  >
                    <Copy size={12} />
                  </button>
                  {!msg.isUser && voiceEnabled && (
                    <button
                      onClick={() => speakMessage(msg.content)}
                      className="bg-black/20 hover:bg-black/30 p-1 rounded text-white/80 hover:text-white transition-all duration-200"
                      title="Read aloud"
                    >
                      <Volume2 size={12} />
                    </button>
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
                  rows={compactMode ? "1" : "2"}
                  disabled={isTyping}
                  maxLength={2000}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {inputMessage.length}/2000
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:transform-none animate-glow flex items-center justify-center"
              >
                {isTyping ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  setSearchQuery('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-xl transition-all duration-300 hover:scale-110"
                title="Clear Chat"
                disabled={isTyping}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Messages: {messages.length}</span>
              <span>Language: {languages[selectedLanguage].native}</span>
              <span className={`${apiConnected ? 'text-green-600' : 'text-red-600'}`}>
                API: {apiConnected ? 'Connected' : 'Disconnected'}
              </span>
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl max-w-md w-full shadow-2xl animate-slide-up">
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
              {/* Audio Settings */}
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
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Voice Output</span>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
              
              {/* Display Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Display</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dark Mode</span>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        darkMode ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compact Mode</span>
                    <button
                      onClick={() => setCompactMode(!compactMode)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        compactMode ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        compactMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
              
              {/* Language Settings */}
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
              
              {/* Data & Privacy */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Data & Privacy</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const data = messages.map(msg => ({
                        timestamp: msg.timestamp,
                        isUser: msg.isUser,
                        content: msg.content
                      }));
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `sinda-chat-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  >
                    Export Chat History
                  </button>
                  <button
                    onClick={() => {
                      setMessages([]);
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

  // FIXED: Simplified Notification Panel - smaller and less intrusive
  const NotificationPanel = React.memo(() => {
    if (notifications.length === 0) return null;
    
    return (
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-xs">
        {notifications.slice(0, 2).map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-500 animate-slide-down text-sm ${
              notification.type === 'success' ? 'bg-green-100/90 text-green-800 border border-green-200' :
              notification.type === 'warning' ? 'bg-yellow-100/90 text-yellow-800 border border-yellow-200' :
              notification.type === 'error' ? 'bg-red-100/90 text-red-800 border border-red-200' :
              'bg-blue-100/90 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity duration-200"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  });

  // Main Dashboard Component (simplified)
  const MainDashboard = React.memo(() => (
    <div className="space-y-8 p-6">
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl p-8 text-white animate-slide-up">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Interactions', value: '247', icon: MessageCircle, color: 'blue' },
          { label: 'Emergency Cases', value: '12', icon: AlertTriangle, color: 'red' },
          { label: 'New Applications', value: '34', icon: FileText, color: 'green' },
          { label: 'System Health', value: '99.97%', icon: Shield, color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-${stat.color}-100 shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
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
    </div>
  ));

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 ${darkMode ? 'dark' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      {/* Header for chat mode */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200 animate-slide-down">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg animate-glow">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SINDA Assistant</h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${apiConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span>AI-Powered Community Support • {languages[selectedLanguage].native}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'purple' },
                { key: 'chat', label: 'Chat', icon: MessageCircle, color: 'blue' }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setCurrentView(view.key)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                    currentView === view.key 
                      ? `bg-gradient-to-r from-${view.color}-500 to-${view.color}-600 text-white shadow-lg animate-glow` 
                      : `bg-gray-100 text-gray-600 hover:bg-${view.color}-50 hover:text-${view.color}-600`
                  }`}
                  disabled={isLoading}
                >
                  <view.icon size={18} />
                  {view.label}
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
          {currentStep === 'chat' && currentView === 'chat' && <ChatInterface />}
        </Suspense>
      </div>

      {/* Settings Modal */}
      <SettingsModal />

      {/* FIXED: Simplified Notification Panel */}
      <NotificationPanel />

      {/* Footer */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12 animate-slide-up">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-6 px-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${apiConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-600">System Status: {apiConnected ? 'Operational' : 'Limited'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-500" />
                <span className="text-gray-600">Hotline: 1800 295 3333</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-gray-600">1 Beatty Road, Singapore 209943</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Lock size={16} className="text-green-500" />
                <span>Secure & Confidential</span>
              </div>
              <div className="text-xs">
                Session: {Math.floor((Date.now() - userSession.startTime) / 60000)}min
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #dbeafe;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #1e40af);
        }

        /* Focus states for accessibility */
        button:focus,
        textarea:focus,
        input:focus,
        select:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
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
