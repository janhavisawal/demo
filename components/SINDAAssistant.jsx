import React, { useState } from 'react';
import { 
  BookOpen, MessageCircle, BarChart3, Phone, Users, 
  Globe, ArrowRight, Clock, Heart, Activity, MapPin, Mail
} from 'lucide-react';

// SINDA Program Database
const SINDA_PROGRAMS = {
  education: {
    title: "Education Programs",
    programs: [
      {
        name: "STEP (Student Tuition Scheme)",
        description: "Subsidized tuition for students from low-income families",
        eligibility: "Students from families with monthly household income ≤ $2,000",
        benefits: "Up to 90% subsidy for tuition fees",
        contact: "Call 6298 9771 or visit SINDA centers"
      },
      {
        name: "Merit Scholarships",
        description: "Academic excellence awards for outstanding students",
        eligibility: "Academic achievers from SINDA member families",
        benefits: "Cash awards and continuing education support",
        contact: "Apply during scholarship periods"
      },
      {
        name: "Homework Centers",
        description: "After-school study support and mentoring",
        eligibility: "Primary and secondary school students",
        benefits: "Free homework supervision and academic guidance",
        contact: "Available at 10 SINDA centers islandwide"
      }
    ]
  },
  family: {
    title: "Family Services",
    programs: [
      {
        name: "Family Service Centre",
        description: "Comprehensive family counseling and support services",
        eligibility: "Families facing relationship, financial, or social challenges",
        benefits: "Professional counseling, casework, and referral services",
        contact: "Call 6841 9491 for appointments"
      },
      {
        name: "Emergency Financial Assistance",
        description: "Immediate financial help for families in crisis",
        eligibility: "Families with urgent financial needs",
        benefits: "One-time financial grants and payment assistance",
        contact: "Call 1800 295 3333 for urgent cases"
      },
      {
        name: "Marriage Counseling",
        description: "Professional marriage and relationship counseling",
        eligibility: "Couples seeking relationship support",
        benefits: "Confidential counseling sessions",
        contact: "Book through Family Service Centre"
      }
    ]
  },
  youth: {
    title: "Youth Development",
    programs: [
      {
        name: "Youth Leadership Programs",
        description: "Leadership development and community engagement for youth",
        eligibility: "Youth aged 16-25",
        benefits: "Leadership training, networking, and project opportunities",
        contact: "Contact youth coordinators at SINDA centers"
      },
      {
        name: "Skills Training Workshops",
        description: "Vocational and life skills development programs",
        eligibility: "Youth and young adults",
        benefits: "Certification courses and job readiness training",
        contact: "Check SINDA website for schedules"
      }
    ]
  },
  elderly: {
    title: "Elderly Care",
    programs: [
      {
        name: "Senior Citizens' Programs",
        description: "Health, wellness and social activities for seniors",
        eligibility: "Senior citizens aged 55 and above",
        benefits: "Regular activities, health screenings, and social support",
        contact: "Visit nearest SINDA center"
      }
    ]
  }
};

// Smart response system for SINDA queries
const getSINDAResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Emergency keywords
  if (message.includes('emergency') || message.includes('urgent') || message.includes('crisis')) {
    return `🚨 **Emergency Support Available**

For immediate help, please call our 24/7 hotline: **1800 295 3333**

**Emergency Financial Assistance:**
- One-time financial grants for urgent needs
- Payment assistance for utilities, rent, medical bills
- Crisis intervention and counseling

**How to Apply:**
1. Call our hotline immediately
2. Speak with our duty officer
3. Provide basic family information
4. Emergency assessment within 24 hours

Our team is here to help you through difficult times.`;
  }

  // STEP/Tuition queries
  if (message.includes('step') || message.includes('tuition') || message.includes('school')) {
    const stepProgram = SINDA_PROGRAMS.education.programs[0];
    return `🎓 **STEP (Student Tuition Scheme)**

${stepProgram.description}

**Eligibility:** ${stepProgram.eligibility}
**Benefits:** ${stepProgram.benefits}

**How to Apply:**
1. Bring family income documents
2. Student's latest school report
3. Visit any SINDA center
4. Complete application form

**Contact:** ${stepProgram.contact}

**10 SINDA Centers Available Islandwide**
We're here to support your child's education!`;
  }

  // Family services
  if (message.includes('family') || message.includes('counseling') || message.includes('marriage')) {
    const familyProgram = SINDA_PROGRAMS.family.programs[0];
    return `👨‍👩‍👧‍👦 **Family Support Services**

${familyProgram.description}

**Services Available:**
• Marriage and relationship counseling
• Family mediation
• Child behavioral support
• Financial counseling
• Crisis intervention

**Eligibility:** ${familyProgram.eligibility}
**Contact:** ${familyProgram.contact}

All services are confidential and provided by qualified social workers.`;
  }

  // Youth programs
  if (message.includes('youth') || message.includes('leadership') || message.includes('skills')) {
    const youthProgram = SINDA_PROGRAMS.youth.programs[0];
    return `🎯 **Youth Development Programs**

${youthProgram.description}

**Available Programs:**
• Leadership training workshops
• Community service projects
• Skills development courses
• Mentorship programs
• Networking events

**Eligibility:** ${youthProgram.eligibility}
**Contact:** ${youthProgram.contact}

Join our vibrant youth community and develop your potential!`;
  }

  // Scholarship queries
  if (message.includes('scholarship') || message.includes('merit') || message.includes('award')) {
    const scholarship = SINDA_PROGRAMS.education.programs[1];
    return `🏆 **Merit Scholarships**

${scholarship.description}

**Available Scholarships:**
• Academic Excellence Awards
• Higher Education Scholarships
• Vocational Training Support
• Special Recognition Awards

**Eligibility:** ${scholarship.eligibility}
**Benefits:** ${scholarship.benefits}

**Application Period:** Usually opens in November-December
**Contact:** Visit www.sinda.org.sg for latest updates`;
  }

  // General program information
  if (message.includes('programs') || message.includes('services') || message.includes('help')) {
    return `📋 **SINDA Programs & Services**

**🎓 Education (Ages 4-25)**
• STEP Tuition Scheme (90% subsidy)
• Merit Scholarships
• Homework Centers at 10 locations

**👨‍👩‍👧‍👦 Family Services**
• Family counseling and mediation
• Emergency financial assistance
• Crisis intervention support

**🎯 Youth Development (Ages 16-25)**
• Leadership training programs
• Skills workshops and certification
• Community engagement projects

**👴 Senior Citizens (55+)**
• Health and wellness programs
• Social activities and support

**📞 Contact Information:**
• General: 6298 9771
• Emergency: 1800 295 3333
• Family Service: 6841 9491

How can I help you with any specific program?`;
  }

  // Location/center queries
  if (message.includes('location') || message.includes('center') || message.includes('address')) {
    return `📍 **SINDA Centers & Locations**

**Main Office:**
1 Beatty Road, Singapore 209943
Phone: 6298 9771

**10 Centers Islandwide:**
• Ang Mo Kio
• Bedok
• Clementi  
• Hougang
• Jurong West
• Sembawang
• Tampines
• Toa Payoh
• Woodlands
• Yishun

**Operating Hours:**
Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 9:00 AM - 1:00 PM
Sunday: Closed

**Emergency Hotline Available 24/7:** 1800 295 3333

Which center would you like to visit?`;
  }

  // Membership queries
  if (message.includes('member') || message.includes('join') || message.includes('registration')) {
    return `👥 **SINDA Membership**

**Membership Benefits:**
• Access to all SINDA programs and services
• Priority for scholarships and financial aid
• Community events and networking
• Educational workshops and seminars

**Membership Types:**
• Individual Membership: $10/year
• Family Membership: $20/year
• Life Membership: $200 (one-time)

**How to Join:**
1. Visit any SINDA center
2. Complete membership form
3. Provide NRIC and address proof
4. Pay membership fee
5. Receive membership card

**Required Documents:**
• NRIC (original and copy)
• Proof of address
• Passport-size photo

Join our community of over 12,000 families!`;
  }

  // Default response for other queries
  return `Hello! I'm here to help you learn about SINDA's programs and services.

**Quick Options:**
• Type "programs" - View all available services
• Type "STEP" - Learn about tuition assistance
• Type "emergency" - Get urgent help information
• Type "family" - Family counseling services
• Type "youth" - Youth development programs
• Type "location" - Find SINDA centers

**Need immediate help?**
Call our 24/7 hotline: **1800 295 3333**

What would you like to know about SINDA?`;
};

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
    setInput('');
    setIsLoading(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      try {
        // Use our SINDA knowledge base first
        const response = getSINDAResponse(userMessage.content);
        
        const aiMessage = {
          id: Date.now() + 1,
          content: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          content: 'I\'m experiencing technical difficulties. For immediate help, please call SINDA at 1800 295 3333.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
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
                  : 'bg-white border border-blue-200 text-gray-800 rounded-bl-md'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
                <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp}
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
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input - SIMPLE AND CLEAN */}
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

const SimpleAnalytics = ({ onBack }) => (
  <div className="p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        <button 
          onClick={onBack}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Users', value: '247', icon: Users, color: 'blue' },
          { label: 'Messages/Min', value: '18', icon: MessageCircle, color: 'green' },
          { label: 'Response Time', value: '0.8s', icon: Clock, color: 'yellow' },
          { label: 'Resolution Rate', value: '96.7%', icon: Activity, color: 'purple' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{metric.label}</p>
                <p className={`text-2xl font-bold text-${metric.color}-600 mt-1`}>{metric.value}</p>
              </div>
              <div className={`bg-${metric.color}-100 p-3 rounded-xl`}>
                <metric.icon className={`text-${metric.color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Knowledge Base</span>
            <span className="text-green-600 font-medium">Updated</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Response System</span>
            <span className="text-green-600 font-medium">Online</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Emergency Hotline</span>
            <span className="text-green-600 font-medium">24/7 Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ✅ MAIN CLEAN APP COMPONENT
const CleanSINDAApp = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');

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

  // Dashboard
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
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Today\'s Interactions', value: '247', icon: MessageCircle, color: 'blue' },
                { label: 'Emergency Cases', value: '12', icon: Phone, color: 'red' },
                { label: 'New Applications', value: '34', icon: Users, color: 'green' },
                { label: 'System Health', value: '99.97%', icon: Activity, color: 'purple' }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Education Programs',
                  icon: BookOpen,
                  color: 'from-blue-500 to-indigo-600',
                  description: 'STEP tuition, scholarships, and academic support',
                  beneficiaries: '5,234'
                },
                {
                  title: 'Family Services',
                  icon: Heart,
                  color: 'from-cyan-500 to-teal-600',
                  description: 'Counselling, financial aid, and family support',
                  beneficiaries: '3,489'
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
                <span className="text-gray-600">System Online</span>
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
              Powered by AI Knowledge Base
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
    return <SimpleAnalytics onBack={() => setCurrentView('dashboard')} />;
  }

  return null;
};

export default CleanSINDAApp;
