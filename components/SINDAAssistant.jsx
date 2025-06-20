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

// Expanded Analytics Data with More Comprehensive Dummy Data
const ANALYTICS_DATA = {
  overview: {
    totalUsers: 2847,
    dailyActive: 247,
    weeklyGrowth: 12.5,
    monthlyGrowth: 34.2,
    messagesPerMinute: 18,
    avgResponseTime: 0.8,
    resolutionRate: 96.7,
    satisfactionScore: 4.6,
    totalFamiliesServed: 12847,
    totalStudentsInSTEP: 5234,
    emergencyCasesResolved: 1847,
    communityEvents: 156,
    volunteerHours: 18294,
    scholarshipsAwarded: 342
  },
  
  dailyStats: [
    { date: 'Mon', users: 198, messages: 1247, emergencies: 8, applications: 12, queries: 156, counseling: 23 },
    { date: 'Tue', users: 234, messages: 1456, emergencies: 5, applications: 18, queries: 189, counseling: 31 },
    { date: 'Wed', users: 267, messages: 1689, emergencies: 12, applications: 15, queries: 203, counseling: 28 },
    { date: 'Thu', users: 289, messages: 1834, emergencies: 7, applications: 22, queries: 234, counseling: 35 },
    { date: 'Fri', users: 321, messages: 2134, emergencies: 15, applications: 28, queries: 267, counseling: 42 },
    { date: 'Sat', users: 278, messages: 1567, emergencies: 9, applications: 19, queries: 198, counseling: 29 },
    { date: 'Sun', users: 245, messages: 1345, emergencies: 6, applications: 14, queries: 167, counseling: 25 }
  ],

  monthlyTrends: [
    { month: 'Jan', step: 456, family: 234, youth: 189, emergency: 89, women: 123, community: 78 },
    { month: 'Feb', step: 489, family: 267, youth: 198, emergency: 67, women: 134, community: 82 },
    { month: 'Mar', step: 523, family: 298, youth: 234, emergency: 78, women: 145, community: 91 },
    { month: 'Apr', step: 567, family: 312, youth: 267, emergency: 92, women: 156, community: 89 },
    { month: 'May', step: 598, family: 345, youth: 289, emergency: 84, women: 167, community: 94 },
    { month: 'Jun', step: 634, family: 378, youth: 298, emergency: 96, women: 178, community: 102 }
  ],

  centerPerformance: [
    { name: 'Ang Mo Kio', users: 287, satisfaction: 4.8, cases: 45, events: 12, volunteers: 23 },
    { name: 'Bedok', users: 234, satisfaction: 4.6, cases: 38, events: 9, volunteers: 18 },
    { name: 'Clementi', users: 298, satisfaction: 4.7, cases: 52, events: 14, volunteers: 25 },
    { name: 'Hougang', users: 267, satisfaction: 4.5, cases: 41, events: 11, volunteers: 20 },
    { name: 'Jurong West', users: 345, satisfaction: 4.9, cases: 58, events: 16, volunteers: 28 },
    { name: 'Sembawang', users: 198, satisfaction: 4.4, cases: 32, events: 8, volunteers: 15 },
    { name: 'Tampines', users: 312, satisfaction: 4.8, cases: 49, events: 13, volunteers: 24 },
    { name: 'Toa Payoh', users: 289, satisfaction: 4.6, cases: 44, events: 10, volunteers: 21 },
    { name: 'Woodlands', users: 267, satisfaction: 4.7, cases: 43, events: 12, volunteers: 22 },
    { name: 'Yishun', users: 245, satisfaction: 4.5, cases: 37, events: 9, volunteers: 19 }
  ],

  programDistribution: [
    { name: 'STEP Tuition', value: 45, color: '#3B82F6' },
    { name: 'Family Services', value: 28, color: '#10B981' },
    { name: 'Youth Programs', value: 18, color: '#F59E0B' },
    { name: 'Emergency Aid', value: 9, color: '#EF4444' }
  ],

  emergencyData: [
    { type: 'Financial Crisis', count: 34, avgResponse: '12 min', resolved: 32, pending: 2 },
    { type: 'Family Crisis', count: 28, avgResponse: '15 min', resolved: 26, pending: 2 },
    { type: 'Mental Health', count: 19, avgResponse: '8 min', resolved: 18, pending: 1 },
    { type: 'Medical Emergency', count: 15, avgResponse: '5 min', resolved: 15, pending: 0 },
    { type: 'Housing Issues', count: 12, avgResponse: '18 min', resolved: 11, pending: 1 }
  ],

  userDemographics: [
    { ageGroup: '18-25', percentage: 22, count: 627, programs: ['Youth', 'Education'] },
    { ageGroup: '26-35', percentage: 28, count: 797, programs: ['Family', 'Career'] },
    { ageGroup: '36-45', percentage: 25, count: 712, programs: ['Family', 'Education'] },
    { ageGroup: '46-55', percentage: 15, count: 427, programs: ['Community', 'Health'] },
    { ageGroup: '55+', percentage: 10, count: 284, programs: ['Community', 'Health'] }
  ],

  recentActivity: [
    { id: 1, type: 'Application', user: 'Priya S.', program: 'STEP Tuition', time: '2 min ago', status: 'approved' },
    { id: 2, type: 'Emergency', user: 'Raj K.', program: 'Financial Aid', time: '5 min ago', status: 'resolved' },
    { id: 3, type: 'Registration', user: 'Meera P.', program: 'Youth Club', time: '8 min ago', status: 'pending' },
    { id: 4, type: 'Counseling', user: 'Kumar R.', program: 'Family Services', time: '12 min ago', status: 'completed' },
    { id: 5, type: 'Event', user: 'Sita M.', program: 'Community', time: '15 min ago', status: 'attended' },
    { id: 6, type: 'Application', user: 'Devi L.', program: 'Women Empowerment', time: '18 min ago', status: 'approved' },
    { id: 7, type: 'Inquiry', user: 'Arjun N.', program: 'Scholarship', time: '22 min ago', status: 'responded' },
    { id: 8, type: 'Workshop', user: 'Lakshmi T.', program: 'Skills Training', time: '25 min ago', status: 'registered' }
  ],

  financialData: [
    { month: 'Jan', budget: 450000, spent: 387000, saved: 63000, assistance: 156000 },
    { month: 'Feb', budget: 450000, spent: 421000, saved: 29000, assistance: 189000 },
    { month: 'Mar', budget: 480000, spent: 445000, saved: 35000, assistance: 201000 },
    { month: 'Apr', budget: 480000, spent: 467000, saved: 13000, assistance: 223000 },
    { month: 'May', budget: 510000, spent: 489000, saved: 21000, assistance: 234000 },
    { month: 'Jun', budget: 510000, spent: 492000, saved: 18000, assistance: 245000 }
  ],

  successStories: [
    { name: 'Arjun Kumar', program: 'STEP', achievement: 'Scored 6 As in O-Levels', year: '2024' },
    { name: 'Priya Sharma', program: 'Women Empowerment', achievement: 'Started Tech Company', year: '2024' },
    { name: 'Ravi Family', program: 'Family Services', achievement: 'Overcome Financial Crisis', year: '2024' },
    { name: 'Youth Group', program: 'Leadership', achievement: 'Community Service Award', year: '2024' }
  ],

  geographicData: [
    { region: 'North', families: 2847, centers: 3, satisfaction: 4.7 },
    { region: 'South', families: 3156, centers: 2, satisfaction: 4.6 },
    { region: 'East', families: 2934, centers: 3, satisfaction: 4.8 },
    { region: 'West', families: 3589, centers: 2, satisfaction: 4.9 }
  ],

  staffMetrics: [
    { role: 'Counselors', count: 15, caseload: 45, satisfaction: 4.8 },
    { role: 'Tutors', count: 42, students: 125, satisfaction: 4.7 },
    { role: 'Social Workers', count: 8, families: 89, satisfaction: 4.9 },
    { role: 'Youth Coordinators', count: 6, participants: 156, satisfaction: 4.6 }
  ],

  programEffectiveness: [
    { program: 'STEP Tuition', participants: 5234, completion: 94, improvement: 87, satisfaction: 4.8 },
    { program: 'Family Counseling', participants: 1247, completion: 89, improvement: 92, satisfaction: 4.9 },
    { program: 'Youth Leadership', participants: 867, completion: 91, improvement: 85, satisfaction: 4.7 },
    { program: 'Women Empowerment', participants: 456, completion: 88, improvement: 90, satisfaction: 4.8 }
  ],

  waitingLists: [
    { program: 'STEP Primary', waiting: 145, avgWait: '2 weeks' },
    { program: 'STEP Secondary', waiting: 89, avgWait: '3 weeks' },
    { program: 'Family Counseling', waiting: 23, avgWait: '1 week' },
    { program: 'Youth Club', waiting: 34, avgWait: '2 weeks' }
  ],

  volunteerData: [
    { month: 'Jan', volunteers: 156, hours: 2340, programs: 12, impact: 'High' },
    { month: 'Feb', volunteers: 167, hours: 2510, programs: 14, impact: 'High' },
    { month: 'Mar', volunteers: 178, hours: 2670, programs: 15, impact: 'High' },
    { month: 'Apr', volunteers: 189, hours: 2835, programs: 16, impact: 'Very High' },
    { month: 'May', volunteers: 201, hours: 3015, programs: 18, impact: 'Very High' },
    { month: 'Jun', volunteers: 218, hours: 3270, programs: 19, impact: 'Very High' }
  ]
};

// Updated Chat Interface that actually uses OpenAI API
const CleanChatInterface = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = {
    english: { name: 'English', native: 'English', flag: '🇬🇧' },
    tamil: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    hindi: { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    malayalam: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  };

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
      // 🔥 TRY OPENAI API FIRST
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
          userInfo: { preferredLanguage: selectedLanguage },
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
        sentiment: data.sentiment || 'neutral',
        isAI: true // Mark as AI response
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('OpenAI API failed, using local response:', error);
      
      // 🔄 FALLBACK TO LOCAL RESPONSE SYSTEM
      try {
        const localResponse = getSINDAResponse(currentInput);
        
        const fallbackMessage = {
          id: Date.now() + 1,
          content: localResponse,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAI: false // Mark as local response
        };

        setMessages(prev => [...prev, fallbackMessage]);
      } catch (fallbackError) {
        // Final fallback
        const errorMessage = {
          id: Date.now() + 1,
          content: `I'm experiencing technical difficulties. 

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
      }
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
                  <span>AI Online • {languages[selectedLanguage].native}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white text-sm appearance-none cursor-pointer hover:bg-white/30 transition-colors min-w-[120px]"
                  style={{ backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27white%27 viewBox=%270 0 16 16%27%3e%3cpath d=%27M8 13.1l4.2-4.2-1.4-1.4L8 10.3 5.2 7.5 3.8 8.9z%27/%3e%3c/svg%3e')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key} className="bg-blue-600 text-white">
                      {lang.flag} {lang.native}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                {selectedLanguage === 'tamil' ? 'இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?' :
                 selectedLanguage === 'hindi' ? 'आज मैं आपकी कैसे मदद कर सकता हूँ?' :
                 selectedLanguage === 'malayalam' ? 'ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?' :
                 'How can I help you today?'}
              </h4>
              <p className="text-gray-500 mb-6">
                {selectedLanguage === 'tamil' ? 'SINDA திட്டங்கள், தகுதி அல்லது விண்ணப்பங்கள் பற்றி என்னிடம் கேளுங்கள்' :
                 selectedLanguage === 'hindi' ? 'SINDA कार्यक्रमों, पात्रता या आवेदनों के बारे में मुझसे पूछें' :
                 selectedLanguage === 'malayalam' ? 'SINDA പ്രോഗ്രാമുകൾ, യോഗ്യത അല്ലെങ്കിൽ അപ്ലിക്കേഷനുകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കുക' :
                 'Ask me about SINDA programs, eligibility, or applications'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  { 
                    text: selectedLanguage === 'tamil' ? 'STEP பயிற்சிக்கு விண்ணப்பிக்கவும்' :
                          selectedLanguage === 'hindi' ? 'STEP ट्यूशन के लिए आवेदन करें' :
                          selectedLanguage === 'malayalam' ? 'STEP ട്യൂഷനായി അപേക്ഷിക്കുക' :
                          'Apply for STEP tuition', 
                    icon: '🎓' 
                  },
                  { 
                    text: selectedLanguage === 'tamil' ? 'அவசர நிதி உதவி' :
                          selectedLanguage === 'hindi' ? 'आपातकालीन वित्तीय सहायता' :
                          selectedLanguage === 'malayalam' ? 'അടിയന്തര സാമ്പത്തിക സഹായം' :
                          'Emergency financial help', 
                    icon: '🚨' 
                  },
                  { 
                    text: selectedLanguage === 'tamil' ? 'युवाओं के कार्यक्रमों में शामिल हों' :
                          selectedLanguage === 'hindi' ? 'युवाओं के कार्यक्रमों में शामिल हों' :
                          selectedLanguage === 'malayalam' ? 'യുവജന പ്രോഗ്രാമുകളിൽ ചേരുക' :
                          'Join youth programs', 
                    icon: '🎯' 
                  },
                  { 
                    text: selectedLanguage === 'tamil' ? 'குടும்ப ஆலோசனை சேவைகள்' :
                          selectedLanguage === 'hindi' ? 'पारिवारिक परामर्श सेवाएं' :
                          selectedLanguage === 'malayalam' ? 'കുടുംബ കൗൺസിലിംഗ് സേവനങ്ങൾ' :
                          'Family counselling services', 
                    icon: '👨‍👩‍👧‍👦' 
                  }
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

              {/* Language Info & WhatsApp Alternative */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    {selectedLanguage === 'tamil' ? '🌍 நான் தமிழ், ஹிந்தி, மலையாளம் மற்றும் ஆங்கிலத்தில் உதவ முடியும்' :
                     selectedLanguage === 'hindi' ? '🌍 मैं तमिल, हिंदी, मलयालम और अंग्रेजी में मदद कर सकता हूं' :
                     selectedLanguage === 'malayalam' ? '🌍 എനിക്ക് തമിഴ്, ഹിന്ദി, മലയാളം, ഇംഗ്ലീഷ് എന്നിവയിൽ സഹായിക്കാൻ കഴിയും' :
                     '🌍 I can help in Tamil, Hindi, Malayalam, and English'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-800 mb-2">
                    {selectedLanguage === 'tamil' ? '💬 விரும்பினால் WhatsApp இல் பேசலாம்' :
                     selectedLanguage === 'hindi' ? '💬 चाहें तो WhatsApp पर भी बात कर सकते हैं' :
                     selectedLanguage === 'malayalam' ? '💬 വേണമെങ്കിൽ WhatsApp-ൽ സംസാരിക്കാം' :
                     '💬 Prefer WhatsApp? We\'re there too!'}
                  </p>
                  <a
                    href={`https://wa.me/65912345671818?text=${encodeURIComponent(
                      selectedLanguage === 'tamil' ? 'வணக்கம்! SINDA திட்டங்கள் பற்றி தகவல் தேவை.' :
                      selectedLanguage === 'hindi' ? 'नमस्ते! मुझे SINDA कार्यक्रमों के बारे में जानकारी चाहिए।' :
                      selectedLanguage === 'malayalam' ? 'നമസ്കാരം! എനിക്ക് SINDA പ്രോഗ്രാമുകളെക്കുറിച്ച് വിവരങ്ങൾ വേണം.' :
                      'Hello! I need information about SINDA programs.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                    </svg>
                    {selectedLanguage === 'tamil' ? 'WhatsApp இல் செல்லுங்கள்' :
                     selectedLanguage === 'hindi' ? 'WhatsApp पर जाएं' :
                     selectedLanguage === 'malayalam' ? 'WhatsApp-ൽ പോകുക' :
                     'Open WhatsApp'}
                  </a>
                </div>
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
                  {message.isAI && (
                    <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      AI • {languages[selectedLanguage].flag}
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
                  <span className="text-sm text-gray-600">Thinking...</span>
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
                placeholder={
                  selectedLanguage === 'tamil' ? 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யுங்கள்...' :
                  selectedLanguage === 'hindi' ? 'अपना संदेश यहाँ टाइप करें...' :
                  selectedLanguage === 'malayalam' ? 'നിങ്ങളുടെ സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക...' :
                  'Type your message here...'
                }
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

          {/* WhatsApp Quick Contact */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="text-xs text-gray-500 text-center">
              {selectedLanguage === 'tamil' ? 'அல்லது உடனடி உதவிக்கு:' :
               selectedLanguage === 'hindi' ? 'या तत्काल सहायता के लिए:' :
               selectedLanguage === 'malayalam' ? 'അല്ലെങ്കിൽ ഉടനടി സഹായത്തിന്:' :
               'Or for instant help:'}
            </div>
            
            <div className="flex gap-3">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/659123456718?text=${encodeURIComponent(
                  selectedLanguage === 'tamil' ? 'வணக்கம்! SINDA திட்டங்கள் பற்றி தகவல் தேவை.' :
                  selectedLanguage === 'hindi' ? 'नमस्ते! मुझे SINDA कार्यक्रमों के बारे में जानकारी चाहिए।' :
                  selectedLanguage === 'malayalam' ? 'നമസ്കാരം! എനിക്ക് SINDA പ്രോഗ്രാമുകളെക്കുറിച്ച് വിവരങ്ങൾ വേണം.' :
                  'Hello! I need information about SINDA programs.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                </svg>
                WhatsApp
              </a>

              {/* Phone Button */}
              <a
                href="tel:18002953333"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Phone size={16} />
                Call
              </a>
            </div>
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

        {/* WhatsApp Support Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Need Help Understanding These Analytics?</h3>
                <p className="text-sm text-gray-600">Our team is available on WhatsApp for personalized assistance</p>
              </div>
            </div>
            <a
              href="https://wa.me/659123456718?text=Hello!%20I%20need%20help%20understanding%20SINDA%20analytics%20and%20program%20data."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
              </svg>
              Ask Expert
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
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
              label: 'Families Served', 
              value: ANALYTICS_DATA.overview.totalFamiliesServed.toLocaleString(), 
              change: '+5.2%',
              changeType: 'positive',
              icon: Heart, 
              color: 'pink',
              detail: 'Since inception'
            },
            { 
              label: 'STEP Students', 
              value: ANALYTICS_DATA.overview.totalStudentsInSTEP.toLocaleString(), 
              change: '+8.7%',
              changeType: 'positive',
              icon: BookOpen, 
              color: 'indigo',
              detail: 'Currently enrolled'
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
              label: 'Volunteer Hours', 
              value: ANALYTICS_DATA.overview.volunteerHours.toLocaleString(), 
              change: '+15.3%',
              changeType: 'positive',
              icon: Users, 
              color: 'green',
              detail: 'This year'
            },
            { 
              label: 'Success Rate', 
              value: `${ANALYTICS_DATA.overview.resolutionRate}%`, 
              change: '+2.1%',
              changeType: 'positive',
              icon: CheckCircle, 
              color: 'purple',
              detail: 'Cases resolved'
            }
          ].map((metric, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedView(`metric-${index}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${metric.color}-100 p-3 rounded-xl`}>
                  <metric.icon className={`text-${metric.color}-600`} size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  metric.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs">{metric.label}</p>
                <p className={`text-xl font-bold text-${metric.color}-600 mt-1`}>{metric.value}</p>
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

  const startChat = () => {
    setCurrentView('dashboard');
  };

  // Floating WhatsApp Button Component
  const FloatingWhatsApp = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/659123456718?text=${encodeURIComponent(
          selectedLanguage === 'tamil' ? 'வணக்கம்! SINDA திட்டங்கள் பற்றி தகவல் தேவை.' :
          selectedLanguage === 'hindi' ? 'नमस्ते! मुझे SINDA कार्यक्रमों के बारे में जानकारी चाहिए।' :
          selectedLanguage === 'malayalam' ? 'നമസ്കാരം! എനിക്ക് SINDA പ്രോഗ്രാമുകളെക്കുറിച്ച് വിവരങ്ങൾ വേണം.' :
          'Hello! I need information about SINDA programs.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-bounce hover:animate-none relative"
        aria-label="Contact SINDA via WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {selectedLanguage === 'tamil' ? 'WhatsApp இல் உடனடி உதவி' :
           selectedLanguage === 'hindi' ? 'WhatsApp पर तुरंत मदद' :
           selectedLanguage === 'malayalam' ? 'WhatsApp-ൽ ഉടനടി സഹായം' :
           'Instant help on WhatsApp'}
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
        </div>

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">!</span>
        </div>
      </a>
    </div>
  );

  // Welcome Screen
  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-6">
        <FloatingWhatsApp />
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">Access all SINDA programs and services through our AI-powered assistant</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => startChat()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MessageCircle size={20} />
                  Enter SINDA Assistant
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                🌍 Available in English, Tamil, Hindi & Malayalam
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need immediate help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:18002953333" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 justify-center">
                <Phone size={18} />
                Call 1800 295 3333
              </a>
              <a
                href="https://wa.me/659123456718?text=Hello%21%20I%20need%20information%20about%20SINDA%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                </svg>
                WhatsApp Support
              </a>
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
                { label: 'Today\'s Interactions', value: ANALYTICS_DATA.overview.dailyActive, icon: MessageCircle, color: 'blue', detail: `${ANALYTICS_DATA.overview.messagesPerMinute}/min avg` },
                { label: 'Emergency Cases', value: '12', icon: Phone, color: 'red', detail: '2 pending response' },
                { label: 'New Applications', value: '34', icon: Users, color: 'green', detail: '89% approval rate' },
                { label: 'Program Satisfaction', value: `${ANALYTICS_DATA.overview.satisfactionScore}/5`, icon: Activity, color: 'purple', detail: `${ANALYTICS_DATA.overview.resolutionRate}% success rate` }
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
                      <p className="text-gray-500 text-xs mt-1">{stat.detail}</p>
                    </div>
                    <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                      <stat.icon className={`text-${stat.color}-600`} size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Scholarships Awarded</span>
                    <span className="font-bold text-green-600">{ANALYTICS_DATA.overview.scholarshipsAwarded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Community Events</span>
                    <span className="font-bold text-blue-600">{ANALYTICS_DATA.overview.communityEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Crisis Cases Resolved</span>
                    <span className="font-bold text-purple-600">{ANALYTICS_DATA.overview.emergencyCasesResolved}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">New Registrations</span>
                    <span className="font-bold text-green-600">+127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Counseling Sessions</span>
                    <span className="font-bold text-blue-600">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Volunteer Hours</span>
                    <span className="font-bold text-purple-600">742</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Alerts & Updates</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-600">High demand for STEP Primary</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Youth Club enrollment up 25%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">New volunteer training next week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Education Programs',
                  icon: BookOpen,
                  color: 'from-blue-500 to-indigo-600',
                  description: 'STEP tuition, scholarships, and academic support',
                  beneficiaries: ANALYTICS_DATA.overview.totalStudentsInSTEP.toLocaleString(),
                  metrics: { 
                    applications: `${ANALYTICS_DATA.monthlyTrends[5].step} this month`, 
                    success: `${ANALYTICS_DATA.programEffectiveness[0].completion}% completion rate`,
                    satisfaction: `${ANALYTICS_DATA.programEffectiveness[0].satisfaction}/5 rating`
                  }
                },
                {
                  title: 'Family Services',
                  icon: Heart,
                  color: 'from-cyan-500 to-teal-600',
                  description: 'Counselling, financial aid, and family support',
                  beneficiaries: '3,489',
                  metrics: { 
                    sessions: `${ANALYTICS_DATA.monthlyTrends[5].family} sessions`, 
                    resolution: `${ANALYTICS_DATA.programEffectiveness[1].improvement}% success rate`,
                    satisfaction: `${ANALYTICS_DATA.programEffectiveness[1].satisfaction}/5 rating`
                  }
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
                  
                  <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
                    {Object.entries(program.metrics).map(([key, value], idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-800">{value}</div>
                        <div className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
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

            {/* Real-Time Metrics Dashboard */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Live Community Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                  { label: 'Active Now', value: `${ANALYTICS_DATA.overview.dailyActive}`, trend: '+12%', color: 'green' },
                  { label: 'This Month', value: `${(ANALYTICS_DATA.overview.totalUsers * 0.65).toFixed(0)}`, trend: '+8.3%', color: 'blue' },
                  { label: 'Response Time', value: `${ANALYTICS_DATA.overview.avgResponseTime}s`, trend: '-15%', color: 'purple' },
                  { label: 'Satisfaction', value: `${ANALYTICS_DATA.overview.satisfactionScore}/5`, trend: '+2.1%', color: 'yellow' }
                ].map((metric, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                      <div className={`text-xs mt-2 px-2 py-1 rounded-full ${
                        metric.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {metric.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-3">Top Performing Centers</h4>
                  <div className="space-y-2">
                    {ANALYTICS_DATA.centerPerformance.slice(0, 3).map((center, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{center.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{center.satisfaction}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-3">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-gray-600">97% program completion rate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-600">2,000+ families assisted this year</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-gray-600">15 new community partnerships</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm py-4 px-6 gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-gray-600">System Online</span>
              </div>
              <a href="tel:18002953333" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <Phone size={14} className="text-blue-500" />
                <span className="text-gray-600">1800 295 3333</span>
              </a>
              <a
                href="https://wa.me/659123456718?text=Hello%21%20I%20need%20information%20about%20SINDA%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-green-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                </svg>
                <span className="text-gray-600">WhatsApp</span>
              </a>
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
    return (
      <>
        <FloatingWhatsApp />
        <CleanChatInterface onBack={() => setCurrentView('dashboard')} />
      </>
    );
  }

  if (currentView === 'analytics') {
    return (
      <>
        <FloatingWhatsApp />
        <DetailedAnalytics onBack={() => setCurrentView('dashboard')} selectedView={analyticsView} setSelectedView={setAnalyticsView} />
      </>
    );
  }

  return null;
};

export default CleanSINDAApp;
