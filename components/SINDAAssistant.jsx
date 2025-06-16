import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Globe, BookOpen, FileText, Share2, BarChart3, MessageCircle, HelpCircle, Zap, Clock, Users, GraduationCap, Heart, Building } from 'lucide-react';

const SINDAAssistant = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "🙏 Vanakkam! Welcome to SINDA. I'm here to help you learn about our community programs, educational support, and services. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    familySize: '',
    children: '',
    interests: [],
    location: '',
    preferredLanguage: 'English',
    serviceNeeds: [],
    contactPreference: '',
    stage: 'name'
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const features = [
    {
      icon: GraduationCap,
      title: "Educational Support",
      description: "Tuition assistance and learning programs",
      color: "bg-orange-50 text-orange-600",
      highlighted: false
    },
    {
      icon: Users,
      title: "Community Services",
      description: "Family support and welfare programs",
      color: "bg-orange-50 text-orange-600",
      highlighted: false
    },
    {
      icon: Heart,
      title: "Cultural Programs",
      description: "Heritage preservation and celebrations",
      color: "bg-orange-50 text-orange-600",
      highlighted: false
    },
    {
      icon: Building,
      title: "Professional Development",
      description: "Skills training and career guidance",
      color: "bg-orange-50 text-orange-600",
      highlighted: false
    },
    {
      icon: BarChart3,
      title: "Member Analytics",
      description: "Track engagement and program effectiveness",
      color: "bg-orange-100 text-orange-700",
      highlighted: true
    }
  ];

  // Mistral AI Integration for SINDA - Vercel API Route
  const queryMistralAI = async (userMessage) => {
    try {
      // Call Vercel API route instead of Mistral directly
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for SINDA (Singapore Indian Development Association). You have collected the following information:
              - Name: ${leadData.name}
              - Email: ${leadData.email}
              - Phone: ${leadData.phone}
              - Interests: ${leadData.interests.join(', ')}
              - Service Needs: ${leadData.serviceNeeds.join(', ')}
              - Location: ${leadData.location}
              
              SINDA provides:
              - Educational support and tuition assistance
              - Community welfare programs
              - Cultural heritage programs
              - Professional development and skills training
              - Family counseling and support services
              - Youth development programs
              - Senior citizen care
              - Financial assistance schemes
              
              Provide helpful, culturally sensitive responses about SINDA's programs and services. Keep responses warm and community-focused. Limit responses to 2-3 sentences.`
            },
            ...conversationContext.slice(-5),
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'd be happy to connect you with our community team for more detailed assistance.";
      
      setConversationContext(prev => [
        ...prev.slice(-4),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);

      return aiResponse;
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return "I'm experiencing some technical difficulties. Our community team will be able to provide you with detailed information when they contact you.";
    }
  };

  const addMessage = (type, content, options = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      content,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback, duration = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, duration);
  };

  const handleQuickReply = (option) => {
    addMessage('user', option.text);
    setTimeout(() => processUserInput(option.text, option.value), 500);
  };

  const processUserInput = async (input, value = null) => {
    const currentStage = leadData.stage;
    let updatedLeadData = { ...leadData };
    let botResponse = '';
    let options = null;

    // Use Mistral AI after initial information gathering
    if (useAI && currentStage === 'complete') {
      try {
        botResponse = await queryMistralAI(input);
        options = [
          { text: "Join Program", value: "join" },
          { text: "Visit Center", value: "visit" },
          { text: "Speak to Counselor", value: "counselor" }
        ];
      } catch (error) {
        botResponse = "I'd be happy to connect you with our community team for personalized assistance.";
      }
    } else {
      switch (currentStage) {
        case 'name':
          updatedLeadData.name = input;
          updatedLeadData.stage = 'services';
          botResponse = `Nice to meet you, ${input}! What brings you to SINDA today?`;
          options = [
            { text: "Educational Support", value: "education" },
            { text: "Community Programs", value: "community" },
            { text: "Cultural Activities", value: "cultural" },
            { text: "Financial Assistance", value: "financial" },
            { text: "General Inquiry", value: "general" }
          ];
          break;

        case 'services':
          const selectedService = value || input;
          updatedLeadData.serviceNeeds = [selectedService];
          updatedLeadData.stage = 'family_info';
          botResponse = "Great! Tell me a bit about your family - do you have children, and what are their ages?";
          break;

        case 'family_info':
          updatedLeadData.children = input;
          updatedLeadData.stage = 'location';
          botResponse = "Thank you! Which area of Singapore are you located in? This helps us recommend the nearest SINDA center.";
          options = [
            { text: "Central Singapore", value: "central" },
            { text: "North Singapore", value: "north" },
            { text: "East Singapore", value: "east" },
            { text: "West Singapore", value: "west" },
            { text: "Other/Prefer not to say", value: "other" }
          ];
          break;

        case 'location':
          updatedLeadData.location = value || input;
          updatedLeadData.stage = 'interests';
          botResponse = "Perfect! What specific programs or services are you most interested in?";
          options = [
            { text: "Tuition Classes", value: "tuition" },
            { text: "Skills Training", value: "skills" },
            { text: "Cultural Classes", value: "culture" },
            { text: "Family Counseling", value: "counseling" },
            { text: "Youth Programs", value: "youth" },
            { text: "Senior Care", value: "senior" }
          ];
          break;

        case 'interests':
          const selectedInterest = value || input;
          updatedLeadData.interests = [selectedInterest];
          updatedLeadData.stage = 'contact_info';
          botResponse = "Excellent choice! I'd love to send you more information about our programs. What's your email address?";
          break;

        case 'contact_info':
          if (input.includes('@')) {
            updatedLeadData.email = input;
            updatedLeadData.stage = 'phone';
            botResponse = "Thank you! And what's the best phone number to reach you?";
          } else {
            botResponse = "Please provide a valid email address so we can send you program details.";
          }
          break;

        case 'phone':
          updatedLeadData.phone = input;
          updatedLeadData.stage = 'language';
          botResponse = "Perfect! What's your preferred language for communication?";
          options = [
            { text: "English", value: "english" },
            { text: "Tamil", value: "tamil" },
            { text: "Hindi", value: "hindi" },
            { text: "Telugu", value: "telugu" },
            { text: "Malayalam", value: "malayalam" }
          ];
          break;

        case 'language':
          updatedLeadData.preferredLanguage = value || input;
          updatedLeadData.stage = 'contact_preference';
          botResponse = "How would you prefer our community team to follow up with you?";
          options = [
            { text: "Email Information", value: "email" },
            { text: "Phone Call", value: "phone" },
            { text: "WhatsApp Message", value: "whatsapp" },
            { text: "Visit Center", value: "visit" }
          ];
          break;

        case 'contact_preference':
          updatedLeadData.contactPreference = value || input;
          updatedLeadData.stage = 'complete';
          setUseAI(true);
          botResponse = `Thank you ${updatedLeadData.name}! Our community team will reach out via ${updatedLeadData.contactPreference} in ${updatedLeadData.preferredLanguage} about ${updatedLeadData.interests[0]} programs.

I'm now powered by AI - feel free to ask me anything about SINDA's programs, community services, or how we can support your family!`;
          options = [
            { text: "Program Details", value: "programs" },
            { text: "Center Locations", value: "locations" },
            { text: "Membership Benefits", value: "membership" },
            { text: "Upcoming Events", value: "events" }
          ];
          break;

        case 'complete':
          const questionType = value || input.toLowerCase();
          botResponse = getFollowUpResponse(questionType);
          options = [
            { text: "Join Program", value: "join" },
            { text: "Visit Center", value: "visit" },
            { text: "Speak to Counselor", value: "counselor" }
          ];
          break;

        default:
          botResponse = "I'd be happy to connect you with our community team for personalized assistance.";
      }
    }

    setLeadData(updatedLeadData);
    
    simulateTyping(() => {
      addMessage('bot', botResponse, options);
    });
  };

  const getFollowUpResponse = (questionType) => {
    const responses = {
      programs: "SINDA offers comprehensive programs including educational support (tuition for students), skills training for adults, cultural heritage classes, and family support services. All programs are designed to strengthen our Indian community in Singapore.",
      locations: "SINDA has multiple centers across Singapore: Headquarters at 1 Beatty Road, regional centers in Tampines, Jurong, and community outreach points. Each center offers tailored programs for the local community.",
      membership: "SINDA membership provides access to subsidized programs, priority enrollment, community networking opportunities, cultural events, and emergency assistance schemes. Annual membership helps us serve the community better.",
      events: "We host regular cultural celebrations like Deepavali festivities, educational seminars, youth camps, senior citizen programs, and community gatherings. Check our website for the latest event calendar.",
      join: "Wonderful! Our program coordinators will contact you with registration details, program schedules, and any required documentation. Welcome to the SINDA family!",
      visit: "Great! Our centers are open Monday-Friday 9AM-6PM, Saturday 9AM-1PM. We'll arrange a guided tour and program consultation for you.",
      counselor: "Perfect! Our experienced community counselors provide guidance on education, career development, family matters, and accessing government schemes. They'll reach out to schedule a consultation."
    };
    
    return responses[questionType] || "Our community team will provide detailed information about that when they contact you. SINDA is here to support you and your family's growth and development.";
  };

  const handleSubmit = () => {
    if (currentInput.trim()) {
      addMessage('user', currentInput);
      setTimeout(() => processUserInput(currentInput), 500);
      setCurrentInput('');
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  const MemberSummary = () => (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
      <h3 className="font-medium text-orange-800 mb-3">Community Member Information</h3>
      <div className="space-y-2 text-sm text-orange-700">
        {leadData.name && <div><strong>Name:</strong> {leadData.name}</div>}
        {leadData.email && <div><strong>Email:</strong> {leadData.email}</div>}
        {leadData.phone && <div><strong>Phone:</strong> {leadData.phone}</div>}
        {leadData.location && <div><strong>Location:</strong> {leadData.location}</div>}
        {leadData.children && <div><strong>Family:</strong> {leadData.children}</div>}
        {leadData.interests.length > 0 && <div><strong>Interest:</strong> {leadData.interests[0]}</div>}
        {leadData.serviceNeeds.length > 0 && <div><strong>Service:</strong> {leadData.serviceNeeds[0]}</div>}
        {leadData.preferredLanguage && <div><strong>Language:</strong> {leadData.preferredLanguage}</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Orange curved highlight for SINDA branding */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M200,80 Q600,20 1000,80 Q1100,120 1100,200 Q1050,400 900,500 Q600,600 300,500 Q150,400 200,300 Q180,200 200,80"
            fill="none"
            stroke="#FB923C"
            strokeWidth="3"
            opacity="0.8"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* SINDA Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SINDA Community Assistant</h1>
          <p className="text-gray-600">Singapore Indian Development Association - Empowering Community Growth</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
                feature.highlighted 
                  ? 'bg-orange-100 border-2 border-orange-200 shadow-lg' 
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'demo'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Community Chat
              </button>
              <button
                onClick={() => setActiveTab('how')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'how'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                How It Works
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'features'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Our Services
              </button>
            </nav>
          </div>

          {/* Demo Tab - Chat Interface */}
          {activeTab === 'demo' && (
            <div>
              {leadData.stage === 'complete' && <div className="p-6 border-b"><MemberSummary /></div>}
              
              <div className="h-96 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center relative">
                        <Bot className="w-5 h-5 text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">SINDA Community Assistant</h3>
                        <p className="text-sm text-gray-600">Here to help with programs, services & community support</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option>English</option>
                          <option>Tamil</option>
                          <option>Hindi</option>
                          <option>Telugu</option>
                          <option>Malayalam</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${useAI ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <span className="text-xs text-gray-600">
                          {useAI ? 'Mistral AI' : 'Guided Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`flex items-start space-x-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' ? 'bg-blue-600' : 'bg-orange-600'
                          }`}>
                            {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.timestamp && (
                              <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {message.options && (
                        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex flex-wrap gap-2 max-w-md">
                            {message.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickReply(option)}
                                className="px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full transition-colors hover:border-orange-300 hover:shadow-sm whitespace-nowrap"
                              >
                                {option.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={isTyping}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!currentInput.trim() || isTyping}
                      className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl p-3 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'how' && (
            <div className="p-8">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-8">How SINDA Community Assistant Works</h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Welcome & Discovery</h4>
                      <p className="text-gray-600 leading-relaxed">Community members are warmly welcomed and we learn about their specific needs - education, cultural programs, family support, or professional development.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Family & Community Profiling</h4>
                      <p className="text-gray-600 leading-relaxed">We gather information about family composition, location, language preferences, and specific program interests to provide personalized recommendations.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Program Matching & Support</h4>
                      <p className="text-gray-600 leading-relaxed">Based on needs assessment, we connect families with appropriate SINDA programs, centers, and community resources for maximum benefit.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Community Integration</h4>
                      <p className="text-gray-600 leading-relaxed">Our community coordinators follow up personally, ensuring smooth program enrollment and ongoing support for the entire family's development journey.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Services Tab */}
          {activeTab === 'features' && (
            <div className="p-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-8">SINDA Community Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Educational Support</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Tuition assistance, learning support programs, scholarship schemes, and academic counseling for students from kindergarten to university level.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Community Welfare</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Family support services, emergency assistance schemes, counseling services, and community outreach programs for holistic family development.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Skills Development</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Professional training programs, career guidance, employability workshops, and entrepreneurship support to enhance economic opportunities.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Cultural Heritage</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Traditional arts classes, language programs, cultural celebrations, and heritage preservation activities to maintain our rich Indian identity.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Multi-language Support</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Services available in English, Tamil, Hindi, Telugu, and Malayalam to ensure comfortable communication for all community members.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Accessible Support</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Multiple center locations across Singapore, flexible program timings, and 24/7 emergency support for urgent community needs.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-orange-50 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-900 mb-3">SINDA Centers Across Singapore</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
                    <div>
                      <p><strong>Headquarters:</strong> 1 Beatty Road, Singapore 209943</p>
                      <p><strong>East Region:</strong> Tampines Community Center</p>
                      <p><strong>West Region:</strong> Jurong East Community Hub</p>
                    </div>
                    <div>
                      <p><strong>North Region:</strong> Woodlands Regional Center</p>
                      <p><strong>Central Region:</strong> Toa Payoh Community Office</p>
                      <p><strong>Hotline:</strong> 6298 8775 (24/7 Support)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SINDAAssistant;
