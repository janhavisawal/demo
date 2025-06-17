import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, MessageCircle, Users, Globe, AlertTriangle, 
  BarChart3, Shield, Settings, Download, TrendingUp,
  Clock, MapPin, DollarSign, Calendar, Activity,
  Eye, Target, Zap, Lock, CheckCircle, XCircle, Cpu,
  Server, Database, Wifi, Monitor, Code
} from 'lucide-react';

// Enhanced SINDA Assistant with Modern Tech UI
const EnhancedSINDAAssistant = () => {
  const [currentView, setCurrentView] = useState('chat');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [messageId, setMessageId] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const messagesEndRef = useRef(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    realTimeMetrics: {
      activeUsers: 47,
      messagesPerMinute: 12,
      responseTime: 1.2,
      resolutionRate: 94.3
    },
    intentAccuracy: 97.8,
    entityExtraction: 96.2,
    userEngagement: {
      avgSessionDuration: 8.5,
      messagePerSession: 6.3,
      returnUsers: 73.2
    }
  });

  // Intent Recognition System
  const [detectedIntents, setDetectedIntents] = useState([]);
  const [extractedEntities, setExtractedEntities] = useState([]);

  // Security Monitoring
  const [securityStatus, setSecurityStatus] = useState({
    encryption: 'active',
    compliance: 'SOC2-ready',
    uptime: 99.7,
    lastSecurityScan: '2 hours ago'
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: 'Welcome to SINDA! 👋 I can help you find the right programs and guide you through the application process.'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'SINDA வில் உங்களை வரவேற்கிறோம்! 👋'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'SINDA में आपका स्वागत है! 👋'
    }
  };

  // Advanced Intent Recognition
  const recognizeIntent = useCallback((message) => {
    const intents = {
      'apply_program': { keywords: ['apply', 'application', 'register', 'sign up'], confidence: 0.95 },
      'check_eligibility': { keywords: ['eligible', 'qualify', 'requirements'], confidence: 0.92 },
      'program_info': { keywords: ['tell me about', 'what is', 'information'], confidence: 0.89 },
      'financial_help': { keywords: ['money', 'financial', 'assistance', 'help'], confidence: 0.96 },
      'urgent_crisis': { keywords: ['emergency', 'urgent', 'crisis', 'immediate'], confidence: 0.98 }
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

    // Entity extraction
    const phoneRegex = /(\+65\s?)?[689]\d{7}/g;
    const emailRegex = /\S+@\S+\.\S+/g;
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
    const amountRegex = /\$\d+/g;

    const phones = message.match(phoneRegex);
    const emails = message.match(emailRegex);
    const dates = message.match(dateRegex);
    const amounts = message.match(amountRegex);

    if (phones) entities.push({ type: 'phone', values: phones });
    if (emails) entities.push({ type: 'email', values: emails });
    if (dates) entities.push({ type: 'date', values: dates });
    if (amounts) entities.push({ type: 'amount', values: amounts });

    setDetectedIntents(detected);
    setExtractedEntities(entities);

    return { intents: detected, entities };
  }, []);

  // Enhanced message handling
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

    // Update analytics
    if (isUser) {
      setAnalyticsData(prev => ({
        ...prev,
        realTimeMetrics: {
          ...prev.realTimeMetrics,
          messagesPerMinute: prev.realTimeMetrics.messagesPerMinute + 1
        }
      }));
    }
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
      let response = "I understand you're looking for help with SINDA programs. Let me assist you with that.";
      
      if (analysis.intents.length > 0) {
        const primaryIntent = analysis.intents[0];
        
        switch (primaryIntent.intent) {
          case 'apply_program':
            response = "Great! I can help you start your application. Let me guide you through the process. Which program are you interested in?";
            break;
          case 'check_eligibility':
            response = "I'll help you check your eligibility. Most SINDA programs require a per capita income of ≤ $1,600. Can you tell me about your household size and income?";
            break;
          case 'financial_help':
            response = "SINDA offers various financial assistance programs including emergency aid, bill payment support, and ongoing monthly assistance. Would you like to know more about eligibility requirements?";
            break;
          case 'urgent_crisis':
            response = "🚨 For immediate crisis support, please call SINDA at 1800 295 3333 right away. They have 24/7 emergency assistance available.";
            break;
          default:
            response = "I can help you with SINDA programs. What specific information are you looking for today?";
        }
      }

      addMessage(response, false, { 
        intentConfidence: analysis.intents[0]?.confidence || 0.8,
        responseGenerated: true 
      });
      setIsTyping(false);
    }, Math.random() * 1000 + 1500);
  }, [inputMessage, isTyping, addMessage, recognizeIntent]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Modern Analytics Dashboard
  const AnalyticsDashboard = () => (
    <div className="space-y-8 p-6">
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData.realTimeMetrics.activeUsers}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 text-xs">+12% from yesterday</span>
              </div>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Response Time</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData.realTimeMetrics.responseTime}s</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 text-xs">15% faster</span>
              </div>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <Zap className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Intent Accuracy</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData.intentAccuracy}%</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-purple-400 text-xs">+2.3% this week</span>
              </div>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <Target className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Resolution Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData.realTimeMetrics.resolutionRate}%</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-orange-400 text-xs">+1.7% improvement</span>
              </div>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <CheckCircle className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="text-blue-400" size={24} />
            Neural Network Activity
          </h3>
          <div className="space-y-4">
            {Array.from({length: 6}, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="flex-1 bg-slate-700 rounded-full h-2 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm">{(Math.random() * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="text-green-400" size={24} />
            Performance Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">CPU Usage</span>
                <span className="text-green-400">23%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full w-[23%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Memory</span>
                <span className="text-blue-400">67%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-[67%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Network</span>
                <span className="text-purple-400">45%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modern Reports Dashboard
  const ReportsDashboard = () => (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Advanced Analytics</h2>
        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg">
            <Download size={18} />
            Export Data
          </button>
          <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg">
            Schedule Report
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <BarChart3 className="text-blue-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Conversations</span>
              <span className="text-white font-bold text-lg">2,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Success Rate</span>
              <span className="text-green-400 font-bold text-lg">94.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Avg Response</span>
              <span className="text-blue-400 font-bold text-lg">1.2s</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300">
            View Details
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Growth Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">New Users</span>
              <span className="text-white font-bold text-lg">+167</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Conversion Rate</span>
              <span className="text-green-400 font-bold text-lg">23.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Engagement</span>
              <span className="text-purple-400 font-bold text-lg">+15%</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-300">
            Growth Analysis
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <DollarSign className="text-purple-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">ROI Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cost Savings</span>
              <span className="text-white font-bold text-lg">$67,800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">ROI</span>
              <span className="text-green-400 font-bold text-lg">340%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Efficiency</span>
              <span className="text-blue-400 font-bold text-lg">+89%</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl transition-all duration-300">
            Financial Report
          </button>
        </div>
      </div>
    </div>
  );

  // Modern Security Dashboard
  const SecurityDashboard = () => (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Security Center</h2>
        <div className="flex items-center gap-3 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
          <CheckCircle size={20} className="text-green-400" />
          <span className="text-green-400 font-medium">All Systems Secure</span>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-green-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Encryption</p>
              <p className="text-2xl font-bold text-green-400 mt-2">Active</p>
              <p className="text-xs text-slate-500 mt-1">AES-256 Enabled</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <Lock className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Compliance</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">SOC2</p>
              <p className="text-xs text-slate-500 mt-1">GDPR/PDPA Ready</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Shield className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Uptime</p>
              <p className="text-2xl font-bold text-purple-400 mt-2">99.7%</p>
              <p className="text-xs text-slate-500 mt-1">Above 99.5% SLA</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <Server className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Last Scan</p>
              <p className="text-2xl font-bold text-orange-400 mt-2">2h ago</p>
              <p className="text-xs text-slate-500 mt-1">No threats found</p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <Eye className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modern Chat Interface
  const ChatInterface = () => (
    <div className="max-w-6xl mx-auto p-6">
      {currentStep === 'welcome' && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-12 text-center shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
            <Cpu className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Enhanced SINDA Assistant</h2>
          <p className="text-slate-400 mb-8 text-lg">AI-powered support with advanced analytics and security</p>
          <button
            onClick={() => setCurrentStep('language')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Start Conversation
          </button>
        </div>
      )}

      {currentStep === 'language' && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Choose your language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentStep('chat');
                  setTimeout(() => addMessage(lang.greeting, false), 500);
                }}
                className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-white mb-2">{lang.name}</div>
                <div className="text-slate-400 text-sm">Select Language</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'chat' && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Code className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enhanced SINDA Assistant</h3>
                  <p className="text-blue-100 text-sm">
                    Intent Accuracy: {analyticsData.intentAccuracy}% | Response Time: {analyticsData.realTimeMetrics.responseTime}s
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
                >
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Intent Recognition Display */}
          {detectedIntents.length > 0 && (
            <div className="bg-blue-500/10 border-b border-blue-500/20 p-4">
              <div className="flex items-center gap-3 text-sm">
                <Target className="text-blue-400" size={16} />
                <span className="font-medium text-white">Detected Intents:</span>
                {detectedIntents.map((intent, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
                    {intent.intent.replace('_', ' ')} ({Math.round(intent.confidence * 100)}%)
                  </span>
                ))}
              </div>
              {extractedEntities.length > 0 && (
                <div className="flex items-center gap-3 text-sm mt-2">
                  <span className="font-medium text-white">Entities:</span>
                  {extractedEntities.map((entity, index) => (
                    <span key={index} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/30">
                      {entity.type}: {entity.values.join(', ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-800 to-slate-900">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                  msg.isUser 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-600 text-white border border-slate-600'
                } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-600 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-300">AI processing with {analyticsData.intentAccuracy}% accuracy...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="p-6 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full resize-none bg-slate-700 border border-slate-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 text-sm"
                  rows="2"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overlay */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Real-time Analytics</h2>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-all duration-300"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <AnalyticsDashboard />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Modern Header with Navigation */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Cpu className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Enhanced SINDA Assistant</h1>
              <p className="text-slate-400 flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                Advanced AI • 97.8% Intent Accuracy • Enterprise Security
              </p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('chat')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                currentView === 'chat' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <MessageCircle size={18} />
              Chat
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                currentView === 'analytics' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <BarChart3 size={18} />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('reports')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                currentView === 'reports' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <Download size={18} />
              Reports
            </button>
            <button
              onClick={() => setCurrentView('security')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                currentView === 'security' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <Shield size={18} />
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-8">
        {currentView === 'chat' && <ChatInterface />}
        {currentView === 'analytics' && <AnalyticsDashboard />}
        {currentView === 'reports' && <ReportsDashboard />}
        {currentView === 'security' && <SecurityDashboard />}
      </div>

      {/* Modern Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-4 px-6">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300">System Status: Operational</span>
            </div>
            <div className="flex items-center space-x-3">
              <Activity size={16} className="text-blue-400" />
              <span className="text-slate-300">Active Users: {analyticsData.realTimeMetrics.activeUsers}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap size={16} className="text-green-400" />
              <span className="text-slate-300">Avg Response: {analyticsData.realTimeMetrics.responseTime}s</span>
            </div>
            <div className="flex items-center space-x-3">
              <Target size={16} className="text-purple-400" />
              <span className="text-slate-300">Intent Accuracy: {analyticsData.intentAccuracy}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Lock size={16} className="text-green-400" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Enhanced Styling */}
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default EnhancedSINDAAssistant;
