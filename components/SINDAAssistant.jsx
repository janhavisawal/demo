import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, MessageCircle, Users, Globe, AlertTriangle, 
  BarChart3, Shield, Settings, Download, TrendingUp,
  Clock, MapPin, DollarSign, Calendar, Activity,
  Eye, Target, Zap, Lock, CheckCircle, XCircle
} from 'lucide-react';

// Enhanced SINDA Assistant with Advanced Features
const EnhancedSINDAAssistant = () => {
  const [currentView, setCurrentView] = useState('chat'); // chat, analytics, reports, security
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

  // Intent Recognition System (Mock Implementation)
  const [detectedIntents, setDetectedIntents] = useState([]);
  const [extractedEntities, setExtractedEntities] = useState([]);

  // Security Monitoring
  const [securityStatus, setSecurityStatus] = useState({
    encryption: 'active',
    compliance: 'SOC2-ready',
    uptime: 99.7,
    lastSecurityScan: '2 hours ago'
  });

  // Enhanced Dummy Analytics Data
  const kpiData = {
    totalInquiries: 2847,
    resolvedCases: 2683,
    avgResponseTime: '1.2s',
    userSatisfaction: 4.7,
    conversionRate: 23.4,
    costPerConversation: '$2.30'
  };

  const engagementData = [
    { time: '09:00', interactions: 45, uniqueUsers: 42, avgSessionTime: 5.2 },
    { time: '10:00', interactions: 67, uniqueUsers: 61, avgSessionTime: 6.1 },
    { time: '11:00', interactions: 89, uniqueUsers: 78, avgSessionTime: 7.3 },
    { time: '12:00', interactions: 134, uniqueUsers: 118, avgSessionTime: 8.7 },
    { time: '13:00', interactions: 98, uniqueUsers: 87, avgSessionTime: 6.8 },
    { time: '14:00', interactions: 123, uniqueUsers: 109, avgSessionTime: 7.9 },
    { time: '15:00', interactions: 156, uniqueUsers: 134, avgSessionTime: 9.2 },
    { time: '16:00', interactions: 145, uniqueUsers: 128, avgSessionTime: 8.5 }
  ];

  // Daily Performance Data (Last 30 Days)
  const dailyPerformanceData = [
    { date: '2024-06-01', conversations: 247, resolved: 233, avgResponse: 1.2, satisfaction: 4.7, applications: 23 },
    { date: '2024-06-02', conversations: 289, resolved: 271, avgResponse: 1.1, satisfaction: 4.8, applications: 28 },
    { date: '2024-06-03', conversations: 312, resolved: 298, avgResponse: 1.3, satisfaction: 4.6, applications: 31 },
    { date: '2024-06-04', conversations: 276, resolved: 261, avgResponse: 1.0, satisfaction: 4.9, applications: 26 },
    { date: '2024-06-05', conversations: 334, resolved: 318, avgResponse: 1.4, satisfaction: 4.5, applications: 35 },
    { date: '2024-06-06', conversations: 298, resolved: 284, avgResponse: 1.2, satisfaction: 4.7, applications: 29 },
    { date: '2024-06-07', conversations: 267, resolved: 252, avgResponse: 1.1, satisfaction: 4.8, applications: 24 },
    { date: '2024-06-08', conversations: 401, resolved: 382, avgResponse: 1.5, satisfaction: 4.4, applications: 42 },
    { date: '2024-06-09', conversations: 356, resolved: 339, avgResponse: 1.3, satisfaction: 4.6, applications: 38 },
    { date: '2024-06-10', conversations: 289, resolved: 274, avgResponse: 1.1, satisfaction: 4.8, applications: 31 },
    { date: '2024-06-11', conversations: 323, resolved: 307, avgResponse: 1.2, satisfaction: 4.7, applications: 34 },
    { date: '2024-06-12', conversations: 278, resolved: 263, avgResponse: 1.0, satisfaction: 4.9, applications: 27 },
    { date: '2024-06-13', conversations: 345, resolved: 329, avgResponse: 1.4, satisfaction: 4.5, applications: 37 },
    { date: '2024-06-14', conversations: 312, resolved: 297, avgResponse: 1.3, satisfaction: 4.6, applications: 33 },
    { date: '2024-06-15', conversations: 267, resolved: 253, avgResponse: 1.1, satisfaction: 4.8, applications: 26 },
    { date: '2024-06-16', conversations: 389, resolved: 371, avgResponse: 1.5, satisfaction: 4.4, applications: 41 },
    { date: '2024-06-17', conversations: 298, resolved: 284, avgResponse: 1.2, satisfaction: 4.7, applications: 30 }
  ];

  // Weekly Trends Data (Last 12 Weeks)
  const weeklyTrendsData = [
    { week: 'Week 1', inquiries: 1847, applications: 167, enrollments: 89, satisfaction: 4.6, conversionRate: 23.4 },
    { week: 'Week 2', inquiries: 1923, applications: 178, enrollments: 94, satisfaction: 4.7, conversionRate: 24.1 },
    { week: 'Week 3', inquiries: 2012, applications: 189, enrollments: 101, satisfaction: 4.8, conversionRate: 25.2 },
    { week: 'Week 4', inquiries: 1789, applications: 156, enrollments: 82, satisfaction: 4.5, conversionRate: 22.1 },
    { week: 'Week 5', inquiries: 2156, applications: 203, enrollments: 108, satisfaction: 4.9, conversionRate: 26.3 },
    { week: 'Week 6', inquiries: 2034, applications: 192, enrollments: 102, satisfaction: 4.7, conversionRate: 24.8 },
    { week: 'Week 7', inquiries: 1934, applications: 174, enrollments: 91, satisfaction: 4.6, conversionRate: 23.7 },
    { week: 'Week 8', inquiries: 2234, applications: 218, enrollments: 116, satisfaction: 4.8, conversionRate: 27.1 },
    { week: 'Week 9', inquiries: 2098, applications: 198, enrollments: 105, satisfaction: 4.7, conversionRate: 25.0 },
    { week: 'Week 10', inquiries: 1876, applications: 167, enrollments: 88, satisfaction: 4.5, conversionRate: 22.9 },
    { week: 'Week 11', inquiries: 2189, applications: 209, enrollments: 112, satisfaction: 4.9, conversionRate: 26.8 },
    { week: 'Week 12', inquiries: 2067, applications: 195, enrollments: 104, satisfaction: 4.8, conversionRate: 25.3 }
  ];

  // ROI Analysis Data
  const roiAnalysisData = {
    monthlyOperatingCosts: {
      aiInfrastructure: 8500,
      staffSalaries: 45000,
      systemMaintenance: 3200,
      compliance: 2800,
      total: 59500
    },
    monthlySavings: {
      reducedCallCenter: 28000,
      automatedProcessing: 18500,
      fasterResolution: 12400,
      reducedErrors: 8900,
      total: 67800
    },
    monthlyMetrics: {
      totalConversations: 9247,
      costPerConversation: 2.30,
      traditionalCostPerCall: 12.50,
      savingsPerInteraction: 10.20,
      totalSavings: 94322
    },
    quarterlyProjections: {
      q1Savings: 203400,
      q2Savings: 278900,
      q3Savings: 312600,
      q4Savings: 345200,
      yearlyROI: 340
    }
  };

  // Program Performance Data
  const programPerformanceData = [
    { program: 'STEP Tuition', inquiries: 1245, applications: 234, enrolled: 189, completionRate: 87.3 },
    { program: 'Family Services', inquiries: 892, applications: 178, enrolled: 156, completionRate: 91.2 },
    { program: 'Financial Assistance', inquiries: 567, applications: 134, enrolled: 121, completionRate: 94.1 },
    { program: 'Youth Development', inquiries: 434, applications: 89, enrolled: 76, completionRate: 88.7 },
    { program: 'ITE Programs', inquiries: 298, applications: 67, enrolled: 58, completionRate: 85.2 },
    { program: 'Bursary Schemes', inquiries: 189, applications: 45, enrolled: 39, completionRate: 92.3 }
  ];

  // Geographic Distribution Data
  const geographicData = [
    { region: 'Central', users: 1234, applications: 156, conversionRate: 12.6 },
    { region: 'North', users: 987, applications: 134, conversionRate: 13.6 },
    { region: 'East', users: 856, applications: 98, conversionRate: 11.4 },
    { region: 'West', users: 743, applications: 89, conversionRate: 12.0 },
    { region: 'Northeast', users: 567, applications: 67, conversionRate: 11.8 }
  ];

  // User Demographics Data
  const demographicsData = [
    { ageGroup: '18-25', users: 1234, satisfaction: 4.8, avgSessionTime: 7.2 },
    { ageGroup: '26-35', users: 1567, satisfaction: 4.7, avgSessionTime: 8.9 },
    { ageGroup: '36-45', users: 1789, satisfaction: 4.6, avgSessionTime: 9.5 },
    { ageGroup: '46-55', users: 1245, satisfaction: 4.7, avgSessionTime: 8.1 },
    { ageGroup: '56-65', users: 892, satisfaction: 4.8, avgSessionTime: 6.8 },
    { ageGroup: '65+', users: 456, satisfaction: 4.9, avgSessionTime: 5.3 }
  ];

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

  // Advanced Intent Recognition (Mock)
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

    // Entity extraction (mock)
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

  // Enhanced message handling with analytics
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
    
    // Advanced intent recognition
    const analysis = recognizeIntent(userMessage);
    
    addMessage(userMessage, true, { 
      intents: analysis.intents,
      entities: analysis.entities 
    });
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with intent-based routing
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

  // Analytics Dashboard Component
  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-blue-600">{analyticsData.realTimeMetrics.activeUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">↗ +12% from yesterday</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-green-600">{analyticsData.realTimeMetrics.responseTime}s</p>
            </div>
            <Zap className="text-green-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">↗ 15% faster</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Intent Accuracy</p>
              <p className="text-2xl font-bold text-purple-600">{analyticsData.intentAccuracy}%</p>
            </div>
            <Target className="text-purple-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">↗ +2.3% this week</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-orange-600">{analyticsData.realTimeMetrics.resolutionRate}%</p>
            </div>
            <CheckCircle className="text-orange-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">↗ +1.7% improvement</p>
        </div>
      </div>

      {/* Engagement Heatmap */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="text-blue-500" size={20} />
          User Engagement Heatmap
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {engagementData.map((point, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-16 rounded mb-1"
                style={{ 
                  backgroundColor: `rgba(234, 88, 12, ${point.interactions / 200})`,
                  border: '1px solid #fed7aa'
                }}
              />
              <p className="text-xs text-gray-600">{point.time}</p>
              <p className="text-xs font-bold">{point.interactions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-500" size={20} />
          Conversion Funnel Analysis
        </h3>
        <div className="space-y-3">
          {[
            { stage: 'Initial Contact', users: 2847, rate: 100 },
            { stage: 'Program Inquiry', users: 1982, rate: 69.6 },
            { stage: 'Eligibility Check', users: 1456, rate: 51.1 },
            { stage: 'Application Started', users: 892, rate: 31.3 },
            { stage: 'Application Completed', users: 667, rate: 23.4 }
          ].map((stage, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">{stage.stage}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${stage.rate}%` }}
                >
                  {stage.rate}%
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600">{stage.users}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Reports Dashboard Component
  const ReportsDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Schedule Report
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Daily Performance Report</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Conversations:</span>
              <span className="font-bold">247</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved Cases:</span>
              <span className="font-bold text-green-600">233</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Response Time:</span>
              <span className="font-bold">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span>User Satisfaction:</span>
              <span className="font-bold text-blue-600">4.7/5</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
            View Full Report
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Weekly Trends</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Inquiries:</span>
              <span className="font-bold">1,847</span>
            </div>
            <div className="flex justify-between">
              <span>New Applications:</span>
              <span className="font-bold text-green-600">167</span>
            </div>
            <div className="flex justify-between">
              <span>Program Enrollments:</span>
              <span className="font-bold">89</span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-bold text-purple-600">23.4%</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded">
            Download PDF
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">ROI Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cost per Conversation:</span>
              <span className="font-bold">$2.30</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per Application:</span>
              <span className="font-bold text-orange-600">$17.80</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Savings:</span>
              <span className="font-bold text-green-600">$12,400</span>
            </div>
            <div className="flex justify-between">
              <span>ROI:</span>
              <span className="font-bold text-blue-600">340%</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-purple-500 text-white py-2 rounded">
            Detailed Analysis
          </button>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select className="w-full p-2 border rounded">
              <option>Performance Summary</option>
              <option>User Engagement</option>
              <option>Conversion Analysis</option>
              <option>Intent Recognition</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <select className="w-full p-2 border rounded">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select className="w-full p-2 border rounded">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
              <option>PowerBI</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded">
          Generate Custom Report
        </button>
      </div>
    </div>
  );

  // Security Dashboard Component
  const SecurityDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security & Compliance</h2>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={20} />
          <span className="font-medium">All Systems Secure</span>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Encryption Status</p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
            <Lock className="text-green-500" size={24} />
          </div>
          <p className="text-xs text-gray-500 mt-1">End-to-end encrypted</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance</p>
              <p className="text-lg font-bold text-blue-600">SOC2 Ready</p>
            </div>
            <Shield className="text-blue-500" size={24} />
          </div>
          <p className="text-xs text-gray-500 mt-1">GDPR/PDPA compliant</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-lg font-bold text-purple-600">{securityStatus.uptime}%</p>
            </div>
            <Activity className="text-purple-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">Above 99.5% SLA</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Scan</p>
              <p className="text-lg font-bold text-orange-600">2h ago</p>
            </div>
            <Eye className="text-orange-500" size={24} />
          </div>
          <p className="text-xs text-green-600 mt-1">No threats detected</p>
        </div>
      </div>

      {/* Security Monitoring */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Real-time Security Monitoring</h3>
        <div className="space-y-4">
          {[
            { event: 'User Authentication', status: 'success', time: '2 min ago', ip: '192.168.1.100' },
            { event: 'Data Access Request', status: 'success', time: '5 min ago', ip: '10.0.0.50' },
            { event: 'Admin Login', status: 'success', time: '12 min ago', ip: '172.16.0.10' },
            { event: 'API Rate Limit', status: 'warning', time: '18 min ago', ip: '203.0.113.5' },
            { event: 'Encryption Check', status: 'success', time: '25 min ago', ip: 'System' }
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                {event.status === 'success' ? 
                  <CheckCircle className="text-green-500" size={16} /> :
                  <AlertTriangle className="text-yellow-500" size={16} />
                }
                <span className="font-medium">{event.event}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{event.ip}</span>
                <span>{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Compliance Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { item: 'Data Encryption', status: true },
            { item: 'Access Logging', status: true },
            { item: 'GDPR Compliance', status: true },
            { item: 'PDPA Compliance', status: true },
            { item: 'SOC2 Controls', status: true },
            { item: 'Backup Systems', status: true },
            { item: 'Incident Response Plan', status: true },
            { item: 'Staff Training Records', status: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <span>{item.item}</span>
              {item.status ? 
                <CheckCircle className="text-green-500" size={20} /> :
                <XCircle className="text-red-500" size={20} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main Chat Interface
  const ChatInterface = () => (
    <div className="max-w-4xl mx-auto p-4">
      {currentStep === 'welcome' && (
        <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Globe className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Enhanced SINDA Assistant</h2>
          <p className="text-gray-600 mb-6">AI-powered support with advanced analytics and security</p>
          <button
            onClick={() => setCurrentStep('language')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200"
          >
            Start Conversation
          </button>
        </div>
      )}

      {currentStep === 'language' && (
        <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Choose your language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentStep('chat');
                  setTimeout(() => addMessage(lang.greeting, false), 500);
                }}
                className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 hover:border-orange-400 rounded-xl p-6 transition-all duration-200"
              >
                <div className="text-xl font-bold text-gray-800">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'chat' && (
        <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
          {/* Enhanced Chat Header with Analytics Toggle */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Enhanced SINDA Assistant</h3>
                  <p className="text-orange-100 text-sm">
                    Intent Accuracy: {analyticsData.intentAccuracy}% | Response Time: {analyticsData.realTimeMetrics.responseTime}s
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30"
                >
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Intent Recognition Display */}
          {detectedIntents.length > 0 && (
            <div className="bg-blue-50 p-3 border-b">
              <div className="flex items-center gap-2 text-sm">
                <Target className="text-blue-500" size={16} />
                <span className="font-medium">Detected Intents:</span>
                {detectedIntents.map((intent, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {intent.intent.replace('_', ' ')} ({Math.round(intent.confidence * 100)}%)
                  </span>
                ))}
              </div>
              {extractedEntities.length > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="font-medium">Entities:</span>
                  {extractedEntities.map((entity, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {entity.type}: {entity.values.join(', ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.isUser 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200'
                } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">AI processing with {analyticsData.intentAccuracy}% accuracy...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  rows="2"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overlay */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Real-time Analytics</h2>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Enhanced Header with Navigation */}
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Enhanced SINDA Assistant</h1>
              <p className="text-sm text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Advanced AI • 97.8% Intent Accuracy • Enterprise Security
              </p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'chat' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle size={16} className="inline mr-1" />
              Chat
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'analytics' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 size={16} className="inline mr-1" />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'reports' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Download size={16} className="inline mr-1" />
              Reports
            </button>
            <button
              onClick={() => setCurrentView('security')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'security' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Shield size={16} className="inline mr-1" />
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto p-4">
        {currentView === 'chat' && <ChatInterface />}
        {currentView === 'analytics' && <AnalyticsDashboard />}
        {currentView === 'reports' && <ReportsDashboard />}
        {currentView === 'security' && <SecurityDashboard />}
      </div>

      {/* Real-time Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Status: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity size={14} className="text-blue-500" />
              <span>Active Users: {analyticsData.realTimeMetrics.activeUsers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap size={14} className="text-green-500" />
              <span>Avg Response: {analyticsData.realTimeMetrics.responseTime}s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={14} className="text-purple-500" />
              <span>Intent Accuracy: {analyticsData.intentAccuracy}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Lock size={14} />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default EnhancedSINDAAssistant;
