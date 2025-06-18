import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

// Main SINDA Assistant Component - Fixed Flickering Issues
const SINDAAssistant = () => {
  // Core State Management - Stabilized with useCallback and useMemo
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(0);
  
  // Stabilized state to prevent unnecessary re-renders
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [apiConnected] = useState(true); // Stabilized - no random changes
  
  // Performance optimized refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Memoized static data to prevent recreation on every render
  const languages = useMemo(() => ({
    english: { 
      name: 'English', 
      native: 'English',
      greeting: 'Welcome to SINDA! 🙏 I\'m here to help you discover our programs and guide you through your journey with us. How can I assist you today?',
      flag: '🇬🇧'
    },
    tamil: { 
      name: 'Tamil', 
      native: 'தமிழ்',
      greeting: 'SINDA வில் உங்களை வரவேற்கிறோம்! 🙏 நான் உங்கள் பயணத்தில் உதவ இங்கே இருக்கிறேன். இன்று நான் எப்படி உதவ முடியும்?',
      flag: '🇮🇳'
    },
    hindi: { 
      name: 'Hindi', 
      native: 'हिंदी',
      greeting: 'SINDA में आपका स्वागत है! 🙏 मैं आपकी यात्रा में सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
      flag: '🇮🇳'
    },
    malayalam: {
      name: 'Malayalam',
      native: 'മലയാളം',
      greeting: 'SINDA യിലേക്ക് സ്വാഗതം! 🙏 നിങ്ങളുടെ യാത്രയിൽ സഹായിക്കാൻ ഞാനിവിടെയുണ്ട്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
      flag: '🇮🇳'
    }
  }), []);

  // Memoized program categories to prevent flickering
  const programCategories = useMemo(() => [
    {
      id: 'education',
      title: 'Education Programs',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Academic support from pre-school to tertiary education',
      programs: ['STEP Tuition', 'A-Level Support', 'ITE Programs', 'Bursaries'],
      count: '8 Programs',
      beneficiaries: 5234,
      successRate: 94.7
    },
    {
      id: 'family',
      title: 'Family Services',
      icon: Heart,
      color: 'from-cyan-500 to-teal-600',
      description: 'Counselling, financial aid, and family support',
      programs: ['Family Service Centre', 'Financial Assistance', 'Crisis Support'],
      count: '5 Services',
      beneficiaries: 3489,
      successRate: 96.2
    },
    {
      id: 'youth',
      title: 'Youth Development',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Leadership and skills development for ages 18-35',
      programs: ['Youth Club', 'Leadership Seminars', 'Mentoring'],
      count: '5 Programs',
      beneficiaries: 2245,
      successRate: 91.8
    },
    {
      id: 'community',
      title: 'Community Outreach',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Bringing SINDA services to your neighborhood',
      programs: ['Door Knocking', 'SINDA Bus', 'Community Events'],
      count: '6 Initiatives',
      beneficiaries: 1496,
      successRate: 88.4
    }
  ], []);

  // Stabilized quick help options
  const quickHelp = useMemo(() => [
    { text: 'Apply for STEP tuition', category: 'education', estimatedTime: '15 min' },
    { text: 'Financial assistance eligibility', category: 'family', estimatedTime: '10 min' },
    { text: 'Join Youth Club', category: 'youth', estimatedTime: '5 min' },
    { text: 'Emergency support', category: 'family', estimatedTime: 'Immediate' },
    { text: 'Job placement assistance', category: 'career', estimatedTime: '20 min' },
    { text: 'Community events near me', category: 'community', estimatedTime: '5 min' }
  ], []);

  // Optimized API call function
  const callOpenAI = useCallback(async (userMessage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          messages: messages.slice(-5) // Only send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.message || 'I apologize, but I encountered an issue. Please try again.',
        error: false
      };
      
    } catch (error) {
      console.error('API Error:', error);
      return {
        message: `I'm experiencing some technical difficulties, but I'm still here to help! 

**For immediate assistance:**
📞 Call SINDA: **1800 295 3333** (24/7)
🏢 Visit: 1 Beatty Road, Singapore 209943
📧 Email: queries@sinda.org.sg

**Popular programs:**
🎓 STEP tuition program
👨‍👩‍👧‍👦 Family financial assistance  
🎯 Youth leadership programs
🚨 Emergency support

What specific area would you like help with?`,
        error: true
      };
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Stabilized message handling
  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    if (!content?.trim()) return;

    const newMessage = {
      id: messageId,
      content: content.trim(),
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  // Optimized program click handler
  const handleProgramClick = useCallback(async (categoryTitle) => {
    const programMessage = `Tell me about ${categoryTitle}`;
    
    addMessage(programMessage, true, { triggerType: 'programButton' });
    setIsTyping(true);
    
    try {
      const response = await callOpenAI(programMessage);
      
      setTimeout(() => {
        addMessage(response.message, false, { aiGenerated: !response.error });
        setIsTyping(false);
      }, 1500); // Consistent delay
      
    } catch (error) {
      setTimeout(() => {
        addMessage('I apologize for the technical difficulty. Please call 1800 295 3333 for immediate assistance.', false, { error: true });
        setIsTyping(false);
      }, 1000);
    }
  }, [addMessage, callOpenAI]);

  // Optimized message sending
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isTyping) return;

    addMessage(trimmedMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await callOpenAI(trimmedMessage);
      
      setTimeout(() => {
        addMessage(response.message, false, { aiGenerated: !response.error });
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      setTimeout(() => {
        addMessage('I apologize for the technical difficulty. Please call 1800 295 3333 for immediate assistance.', false, { error: true });
        setIsTyping(false);
      }, 1000);
    }
  }, [inputMessage, isTyping, addMessage, callOpenAI]);

  // Stabilized event handlers
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Auto-scroll with ref
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome Screen Component - Memoized
  const WelcomeScreen = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Simplified floating elements - no random movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full opacity-60"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-cyan-200/20 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full opacity-50"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 space-y-8">
        <div className="text-center">
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
          
          {/* Static status indicators */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">AI System Online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
              <Users size={16} />
              <span className="text-sm font-medium">24/7 Support Available</span>
            </div>
          </div>
          
          {/* Static key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '30+', label: 'Years Serving', icon: Calendar },
              { value: '12K+', label: 'Families Helped', icon: Heart },
              { value: '25+', label: 'Programs', icon: BookOpen },
              { value: '24/7', label: 'Support', icon: Phone }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:scale-105 transition-transform duration-300">
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
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  ));

  // Language Selection Component - Memoized
  const LanguageSelection = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="mb-6 bg-white/80 hover:bg-white/90 p-3 rounded-xl border border-blue-200 transition-all duration-300"
          >
            <ArrowRight size={20} className="rotate-180 text-blue-600" />
          </button>
          
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
                className={`bg-white/80 backdrop-blur-sm border-2 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedLanguage === key ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
              >
                <div className="text-4xl mb-4">{lang.flag}</div>
                <div className="text-xl font-bold text-gray-800 mb-2">{lang.native}</div>
                <div className="text-sm text-gray-500">{lang.name}</div>
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

  // Chat Interface Component - Optimized
  const ChatInterface = React.memo(() => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl">
        {/* Chat Header - Simplified */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <div className="flex items-center gap-4 text-blue-100 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                    <span>AI Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Program Categories */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Explore Our Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category.title)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-300 hover:shadow-lg text-left hover:scale-105"
                  disabled={isLoading}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{category.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                  <div className="text-xs text-green-600 mt-1 font-medium">{category.successRate}% success</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50">
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
                      addMessage(help.text, true);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105"
                    disabled={isLoading}
                  >
                    <span>{help.text}</span>
                    <div className="text-xs text-gray-500 mt-1">{help.estimatedTime}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 ${
                msg.isUser 
                  ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-blue-200'
              } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!msg.isUser && msg.metadata?.aiGenerated && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      AI
                    </span>
                  )}
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

        {/* Input Area */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm transition-all duration-300"
                rows="2"
                disabled={isTyping}
                maxLength={1000}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {inputMessage.length}/1000
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
                onClick={() => setMessages([])}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-xl transition-all duration-300"
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
              <span className="text-green-600">API: Connected</span>
            </div>
            <div className="text-xs text-gray-500">
              SINDA Assistant - Available 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Settings Modal - Simplified
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
              
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Emergency Contact</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" />
                    <span>1800 295 3333 (24/7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span>1 Beatty Road, Singapore 209943</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    <span>queries@sinda.org.sg</span>
                  </div>
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
      {/* Header for chat view */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SINDA Assistant</h1>
                <div className="text-gray-600 text-sm">
                  AI-Powered Community Support • Since 1991 • {languages[selectedLanguage].native}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentView === 'chat' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <MessageCircle size={18} />
                Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        {currentStep === 'welcome' && <WelcomeScreen />}
        {currentStep === 'language' && <LanguageSelection />}
        {currentStep === 'chat' && <ChatInterface />}
      </div>

      {/* Settings Modal */}
      <SettingsModal />

      {/* Footer */}
      {currentStep === 'chat' && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-6 px-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600">System Operational</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-500" />
                <span className="text-gray-600">1800 295 3333</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SINDAAssistant;
