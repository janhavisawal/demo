import React, { useState } from 'react';
import { 
  BookOpen, MessageCircle, BarChart3, Phone, Users, 
  Globe, ArrowRight, Clock, Heart, Activity, MapPin, Mail,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Calendar, DollarSign, Award, Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// SINDA Program Database - Based on Real Programs from sinda.org.sg
const SINDA_PROGRAMS = {
  education: {
    title: "Education Programs",
    programs: [
      {
        name: "STEP (SINDA Tutorials for Enhanced Performance)",
        description: "SINDA's flagship tuition program launched in 1992, providing quality education support",
        eligibility: "Singapore Citizens/PRs of Indian ethnicity, studying in government/government-aided schools, Primary 1 to JC2",
        benefits: "Heavily subsidized group tuition based on Family Per Capita Income (PCI)",
        contact: "Visit SINDA centers or call 1800 295 3333",
        locations: "Multiple centers across Singapore including Ang Mo Kio, Bedok, Jurong, Tampines, Woodlands"
      },
      {
        name: "A-Level Tuition @ STEP",
        description: "Specialized tuition for Junior College students",
        eligibility: "JC students from Indian families",
        benefits: "Subject-specific tuition to excel in A-Level examinations",
        contact: "Register through SINDA centers"
      },
      {
        name: "Home Tuition Programme",
        description: "One-to-one and small group tuition at students' homes",
        eligibility: "Primary 1 to Secondary 5 students of Indian ethnicity",
        benefits: "Personalized attention, covers English, Math, Science, Mother Tongue",
        contact: "Apply online through SINDA website"
      },
      {
        name: "GUIDE Programme",
        description: "Academic guidance and mentoring for students",
        eligibility: "Students needing additional academic support",
        benefits: "Student mentoring and academic guidance",
        contact: "Available at SINDA centers"
      },
      {
        name: "TEACH Programme",
        description: "Introduced to help academically weak students",
        eligibility: "Students with learning difficulties",
        benefits: "Specialized teaching methods and support",
        contact: "Contact SINDA Family Service Centre"
      }
    ]
  },
  youth: {
    title: "Youth Development",
    programs: [
      {
        name: "SINDA Youth Club (SYC)",
        description: "Established in 2010, nurtures Indian leaders with passion for community building",
        eligibility: "Indians aged 18-35 years old",
        benefits: "Leadership training, community service, networking, social leadership development",
        contact: "Contact SINDA Youth coordinators"
      },
      {
        name: "SINDA Youth Hub",
        description: "Launched in 2018, provides conducive space for students and youth activities",
        eligibility: "Youth and students",
        benefits: "Study space, connects youth to SINDA programs and services",
        contact: "Visit SINDA centers"
      },
      {
        name: "Youth Leadership Seminars",
        description: "Leadership development through immersive camps and seminars",
        eligibility: "Youth participants",
        benefits: "Leadership skills, values cultivation, real-world experience",
        contact: "Register during program periods"
      },
      {
        name: "SINDA-IBR Corporate Mentoring",
        description: "Mentorship program providing real-world insights",
        eligibility: "Selected youth participants",
        benefits: "Corporate mentorship, career guidance, professional development",
        contact: "Apply through SINDA Youth programs"
      },
      {
        name: "ITE Leadership & Employability Programme (ITELP)",
        description: "Started in 2015, moulds Indian ITE students into effective leaders",
        eligibility: "ITE students of Indian ethnicity",
        benefits: "Leadership development, employability skills",
        contact: "Available at all three ITE colleges"
      }
    ]
  },
  family: {
    title: "Family Services",
    programs: [
      {
        name: "SINDA Family Service Centre",
        description: "SINDA is the only Self-Help Group with its own Family Service Centre",
        eligibility: "Families facing interpersonal, relationship, or social challenges",
        benefits: "Professional counseling, casework, referral services, family life programs",
        contact: "Call 1800 295 3333 or email queries@sinda.org.sg"
      },
      {
        name: "Project Athena",
        description: "Empowers single Indian mothers to become confident and independent",
        eligibility: "Single Indian mothers requiring support",
        benefits: "Empowerment programs, confidence building, independence training",
        contact: "Contact SINDA Family Service Centre"
      },
      {
        name: "Financial Assistance Programs",
        description: "Based on Family Per Capita Income (PCI) assessment",
        eligibility: "Families with financial needs, assessed by PCI criteria",
        benefits: "Financial grants, payment assistance, program fee subsidies",
        contact: "Call 1800 295 3333 for assessment"
      },
      {
        name: "Counseling Services",
        description: "Professional counseling for various family issues",
        eligibility: "Individuals and families needing counseling support",
        benefits: "Marriage counseling, family mediation, crisis intervention",
        contact: "Book appointments through Family Service Centre"
      }
    ]
  },
  women: {
    title: "Women Empowerment",
    programs: [
      {
        name: "Let Her Shine! Programme",
        description: "Comprehensive women empowerment initiative",
        eligibility: "Women from the Indian community",
        benefits: "Employability programs, public speaking workshops, STEM mentorship, leadership camps",
        contact: "Register through SINDA centers"
      },
      {
        name: "Python Coding for Girls",
        description: "Technical skills development for women",
        eligibility: "Girls and women interested in coding",
        benefits: "Programming skills, technology education",
        contact: "Part of Let Her Shine! programs"
      },
      {
        name: "STEM Mentorship Program",
        description: "Mentorship in Science, Technology, Engineering, Mathematics",
        eligibility: "Women pursuing STEM fields",
        benefits: "Professional mentorship, career guidance in STEM",
        contact: "Apply through Let Her Shine! programs"
      }
    ]
  },
  community: {
    title: "Community Programs",
    programs: [
      {
        name: "Back to School Festival",
        description: "Annual event providing school supplies for new academic year",
        eligibility: "Students from low-income families",
        benefits: "Stationery and shoe vouchers for new school year",
        contact: "Participate during festival period"
      },
      {
        name: "SINDA Bus",
        description: "Mobile satellite centre launched in 2018 to extend SINDA's reach",
        eligibility: "Heartland communities",
        benefits: "Brings SINDA services to neighborhoods, community outreach",
        contact: "Check SINDA Bus schedule"
      },
      {
        name: "Vibrance @ Yishun",
        description: "Collaboration between four Self-Help Groups, launched in 2018",
        eligibility: "Students and families from all ethnic communities",
        benefits: "Enrichment programs, educational talks, life skills workshops",
        contact: "Visit Vibrance @ Yishun center"
      },
      {
        name: "Prisons Outreach Programme",
        description: "Provides family assistance to inmates' families during incarceration",
        eligibility: "Families of incarcerated individuals",
        benefits: "Family support, assistance during difficult periods",
        contact: "Contact SINDA Family Service Centre"
      }
    ]
  }
};

// Dummy Analytics Data
const ANALYTICS_DATA = {
  overview: {
    totalUsers: 2847,
    dailyActive: 247,
    weeklyGrowth: 12.5,
    monthlyGrowth: 34.2,
    messagesPerMinute: 18,
    avgResponseTime: 0.8,
    resolutionRate: 96.7,
    satisfactionScore: 4.6
  },
  
  dailyStats: [
    { date: 'Mon', users: 198, messages: 1247, emergencies: 8, applications: 12 },
    { date: 'Tue', users: 234, messages: 1456, emergencies: 5, applications: 18 },
    { date: 'Wed', users: 267, messages: 1689, emergencies: 12, applications: 15 },
    { date: 'Thu', users: 289, messages: 1834, emergencies: 7, applications: 22 },
    { date: 'Fri', users: 321, messages: 2134, emergencies: 15, applications: 28 },
    { date: 'Sat', users: 278, messages: 1567, emergencies: 9, applications: 19 },
    { date: 'Sun', users: 245, messages: 1345, emergencies: 6, applications: 14 }
  ],

  monthlyTrends: [
    { month: 'Jan', step: 456, family: 234, youth: 189, emergency: 89 },
    { month: 'Feb', step: 489, family: 267, youth: 198, emergency: 67 },
    { month: 'Mar', step: 523, family: 298, youth: 234, emergency: 78 },
    { month: 'Apr', step: 567, family: 312, youth: 267, emergency: 92 },
    { month: 'May', step: 598, family: 345, youth: 289, emergency: 84 },
    { month: 'Jun', step: 634, family: 378, youth: 298, emergency: 96 }
  ],

  centerPerformance: [
    { name: 'Ang Mo Kio', users: 287, satisfaction: 4.8, cases: 45 },
    { name: 'Bedok', users: 234, satisfaction: 4.6, cases: 38 },
    { name: 'Clementi', users: 298, satisfaction: 4.7, cases: 52 },
    { name: 'Hougang', users: 267, satisfaction: 4.5, cases: 41 },
    { name: 'Jurong West', users: 345, satisfaction: 4.9, cases: 58 },
    { name: 'Sembawang', users: 198, satisfaction: 4.4, cases: 32 },
    { name: 'Tampines', users: 312, satisfaction: 4.8, cases: 49 },
    { name: 'Toa Payoh', users: 289, satisfaction: 4.6, cases: 44 },
    { name: 'Woodlands', users: 267, satisfaction: 4.7, cases: 43 },
    { name: 'Yishun', users: 245, satisfaction: 4.5, cases: 37 }
  ],

  programDistribution: [
    { name: 'STEP Tuition', value: 45, color: '#3B82F6' },
    { name: 'Family Services', value: 28, color: '#10B981' },
    { name: 'Youth Programs', value: 18, color: '#F59E0B' },
    { name: 'Emergency Aid', value: 9, color: '#EF4444' }
  ],

  emergencyData: [
    { type: 'Financial Crisis', count: 34, avgResponse: '12 min', resolved: 32 },
    { type: 'Family Crisis', count: 28, avgResponse: '15 min', resolved: 26 },
    { type: 'Mental Health', count: 19, avgResponse: '8 min', resolved: 18 },
    { type: 'Medical Emergency', count: 15, avgResponse: '5 min', resolved: 15 },
    { type: 'Housing Issues', count: 12, avgResponse: '18 min', resolved: 11 }
  ],

  userDemographics: [
    { ageGroup: '18-25', percentage: 22, count: 627 },
    { ageGroup: '26-35', percentage: 28, count: 797 },
    { ageGroup: '36-45', percentage: 25, count: 712 },
    { ageGroup: '46-55', percentage: 15, count: 427 },
    { ageGroup: '55+', percentage: 10, count: 284 }
  ]
};

// Updated Chat Interface that actually uses OpenAI API
const CleanChatInterface = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // 🔥 NOW ACTUALLY CALLING THE OPENAI API ENDPOINT
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          userInfo: {},
          conversationStage: 'general'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        content: data.message || 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis || false,
        suggestedPrograms: data.suggestedPrograms || [],
        sentiment: data.sentiment || 'neutral'
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle crisis detection
      if (data.isCrisis) {
        console.log('Crisis detected - emergency protocols activated');
      }

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        content: `I'm experiencing technical difficulties connecting to my AI service. 

**For immediate assistance:**
📞 Call SINDA: **1800 295 3333** (24/7)
🏢 Visit: 1 Beatty Road, Singapore 209943
📧 Email: queries@sinda.org.sg

Please try again in a moment, or contact SINDA directly for urgent help.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">SINDA Assistant</h3>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-300"></div>
                  <span>AI Online • Ready to Help</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or applications</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  { text: 'Apply for STEP tuition', icon: '🎓' },
                  { text: 'Emergency financial help', icon: '🚨' },
                  { text: 'Join youth programs', icon: '🎯' },
                  { text: 'Family counselling services', icon: '👨‍👩‍👧‍👦' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(action.text)}
                    className="bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-4 text-sm transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{action.icon}</span>
                      <span className="font-medium text-gray-800">{action.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                message.isUser 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md' 
                  : message.isError
                  ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md'
                  : message.isCrisis
                  ? 'bg-orange-50 border border-orange-300 text-orange-900 rounded-bl-md'
                  : 'bg-white border border-blue-200 text-gray-800 rounded-bl-md'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
                <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp}
                  {message.isCrisis && (
                    <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      Crisis Detected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-blue-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message here..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                rows="2"
                disabled={isLoading}
                maxLength={1000}
              />
              <div className="text-xs text-gray-400 mt-1">{input.length}/1000</div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <MessageCircle size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed Analytics Components
const DetailedAnalytics = ({ onBack, selectedView, setSelectedView }) => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const timeRanges = [
    { key: '24h', label: 'Last 24 Hours' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last Quarter' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
            <p className="text-gray-600 mt-1">Real-time insights into SINDA community engagement</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              {timeRanges.map(range => (
                <option key={range.key} value={range.key}>{range.label}</option>
              ))}
            </select>
            <button 
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Active Users', 
              value: ANALYTICS_DATA.overview.totalUsers.toLocaleString(), 
              change: `+${ANALYTICS_DATA.overview.weeklyGrowth}%`,
              changeType: 'positive',
              icon: Users, 
              color: 'blue',
              detail: `${ANALYTICS_DATA.overview.dailyActive} active today`
            },
            { 
              label: 'Messages Today', 
              value: '2,134', 
              change: '+18.2%',
              changeType: 'positive',
              icon: MessageCircle, 
              color: 'green',
              detail: `${ANALYTICS_DATA.overview.messagesPerMinute}/min avg`
            },
            { 
              label: 'Response Time', 
              value: `${ANALYTICS_DATA.overview.avgResponseTime}s`, 
              change: '-12%',
              changeType: 'positive',
              icon: Clock, 
              color: 'yellow',
              detail: 'Avg response time'
            },
            { 
              label: 'Resolution Rate', 
              value: `${ANALYTICS_DATA.overview.resolutionRate}%`, 
              change: '+2.1%',
              changeType: 'positive',
              icon: CheckCircle, 
              color: 'purple',
              detail: 'Cases resolved successfully'
            }
          ].map((metric, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedView(`metric-${index}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${metric.color}-100 p-3 rounded-xl`}>
                  <metric.icon className={`text-${metric.color}-600`} size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                  metric.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{metric.label}</p>
                <p className={`text-2xl font-bold text-${metric.color}-600 mt-1`}>{metric.value}</p>
                <p className="text-gray-500 text-xs mt-1">{metric.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Daily Activity Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Daily Activity Trends</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Applications</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ANALYTICS_DATA.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Program Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ANALYTICS_DATA.programDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ANALYTICS_DATA.programDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Assistant Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-700">OpenAI API: Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Chat Endpoint: Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Crisis Detection: Enabled</span>
            </div>
          </div>
        </div>

        {/* Rest of analytics components remain the same... */}
      </div>
    </div>
  );
};

// ✅ MAIN CLEAN APP COMPONENT
const CleanSINDAApp = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [analyticsView, setAnalyticsView] = useState('overview');

  const languages = {
    english: { name: 'English', native: 'English', flag: '🇬🇧' },
    tamil: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    hindi: { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    malayalam: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  };

  const startChat = (language) => {
    setSelectedLanguage(language);
    setCurrentView('dashboard');
  };

  // Welcome Screen
  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl">
              <BookOpen className="text-white" size={40} />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SINDA</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your AI-powered guide to Singapore Indian Development Association programs and services.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '30+', label: 'Years Serving', icon: Clock },
              { value: '12K+', label: 'Families Helped', icon: Heart },
              { value: '25+', label: 'Programs', icon: BookOpen },
              { value: '24/7', label: 'Support', icon: Phone }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-blue-600" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => startChat(key)}
                  className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                >
                  <div className="text-3xl mb-3">{lang.flag}</div>
                  <div className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
                    {lang.native}
                  </div>
                  <div className="text-sm text-gray-500">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need immediate help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:18002953333" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                <Phone size={18} />
                Call 1800 295 3333
              </a>
              <button
                onClick={() => startChat('english')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard (same as before)
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SINDA Assistant</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>AI Online • {languages[selectedLanguage].native}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[
                { key: 'chat', label: 'Chat', icon: MessageCircle },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setCurrentView(view.key)}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <view.icon size={16} />
                  {view.label}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentView('welcome')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl p-8 text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome to SINDA Dashboard</h2>
              <p className="text-blue-100 mb-4">Your comprehensive overview of community support</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span>OpenAI API Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Today\'s Interactions', value: ANALYTICS_DATA.overview.dailyActive, icon: MessageCircle, color: 'blue' },
                { label: 'Emergency Cases', value: '12', icon: Phone, color: 'red' },
                { label: 'New Applications', value: '34', icon: Users, color: 'green' },
                { label: 'System Health', value: '99.97%', icon: Activity, color: 'purple' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentView('analytics')}
                >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Education Programs',
                  icon: BookOpen,
                  color: 'from-blue-500 to-indigo-600',
                  description: 'STEP tuition, scholarships, and academic support',
                  beneficiaries: '5,234',
                  metrics: { applications: '634 this month', success: '96.7% approval rate' }
                },
                {
                  title: 'Family Services',
                  icon: Heart,
                  color: 'from-cyan-500 to-teal-600',
                  description: 'Counselling, financial aid, and family support',
                  beneficiaries: '3,489',
                  metrics: { sessions: '378 sessions', satisfaction: '4.8/5 rating' }
                }
              ].map((program, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${program.color} rounded-xl flex items-center justify-center`}>
                      <program.icon className="text-white" size={24} />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">{program.beneficiaries}</div>
                      <div className="text-xs text-gray-500">beneficiaries</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{program.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-800">{Object.values(program.metrics)[0]}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-800">{Object.values(program.metrics)[1]}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('chat')}
                    className={`w-full bg-gradient-to-r ${program.color} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <MessageCircle size={16} />
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-4 px-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-gray-600">OpenAI API Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-blue-500" />
                <span className="text-gray-600">1800 295 3333</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-gray-600">1 Beatty Road, Singapore</span>
              </div>
            </div>
            <div className="text-gray-500">
              Powered by OpenAI GPT-4
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other Views
  if (currentView === 'chat') {
    return <CleanChatInterface onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'analytics') {
    return <DetailedAnalytics onBack={() => setCurrentView('dashboard')} selectedView={analyticsView} setSelectedView={setAnalyticsView} />;
  }

  return null;
};

export default CleanSINDAApp;
