// pages/api/chat.js - Enhanced SINDA Program Guide API (Version 7)
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Comprehensive SINDA Programs Database (Updated 2024)
const SINDA_PROGRAMS = {
  education: {
    name: "Education Programs",
    description: "Supporting academic excellence from pre-school to tertiary education",
    programs: [
      {
        name: "SINDA Tutorials for Enhanced Performance (STEP)",
        description: "Flagship nation-wide tuition program for Primary and Secondary students",
        subjects: "English, Mathematics, Science, Mother Tongue languages",
        levels: "Primary 1-6, Secondary 1-5",
        eligibility: "Per capita income ≤ $1,600, Singapore citizens/PRs of Indian descent",
        fees: "Heavily subsidised - $10/hour if household income below $2,500, $15/hour if $2,501-$4,000",
        centres: "Multiple locations: Ang Mo Kio, Bedok, Jurong, Tampines, Woodlands, and more",
        features: "Small class sizes, qualified teachers, MOE-aligned materials",
        contact: "1800 295 3333"
      },
      {
        name: "STEP Plus",
        description: "Holistic development program focusing on non-academic skills",
        features: "Time management, cyber-wellness, goal-setting, healthy lifestyle workshops",
        eligibility: "Students in STEP program",
        parental_involvement: "Greater parental engagement encouraged",
        contact: "1800 295 3333"
      },
      {
        name: "A-Level Tuition @ STEP",
        description: "Specialized tuition for Junior College students",
        levels: "JC1-JC2",
        eligibility: "Per capita income ≤ $1,600, JC students of Indian descent",
        contact: "1800 295 3333"
      },
      {
        name: "GUIDE Programme",
        description: "Mentoring and guidance program for students",
        features: "Academic guidance, personal development, career counselling",
        contact: "1800 295 3333"
      },
      {
        name: "TEACH Programme",
        description: "Intensive support for academically weak students",
        target: "Students who need additional academic intervention",
        approach: "Personalized attention and remedial support",
        contact: "1800 295 3333"
      },
      {
        name: "ITE Programs",
        description: "Support for Institute of Technical Education students",
        programs: [
          "ITE Aspire - Academic performance enhancement and life skills",
          "ITE Leadership Programme (ITELP) - Leadership development for ITE students"
        ],
        eligibility: "ITE students of Indian descent",
        launched: "ITE Aspire (2017), ITELP (2015)",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA Bursary",
        description: "Financial assistance for tertiary education",
        levels: "Polytechnic, University, Professional courses",
        eligibility: "Per capita income criteria, academic merit",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA Excellence Awards (SEA)",
        description: "Highest honors for students achieving excellence in academics, arts, or sports",
        recognition: "Outstanding achievements in various fields",
        annual_event: "Annual awards ceremony",
        contact: "1800 295 3333"
      }
    ]
  },
  family: {
    name: "Family & Social Services",
    description: "Comprehensive family support and social assistance",
    programs: [
      {
        name: "SINDA Family Service Centre",
        description: "Only self-help group with dedicated family service centre",
        services: [
          "Individual and family counselling",
          "Case management and support",
          "Referral services",
          "Crisis intervention",
          "Family life programs"
        ],
        eligibility: "Open to all families, priority for Indian community",
        address: "1 Beatty Road, Singapore 209943",
        contact: "1800 295 3333"
      },
      {
        name: "Financial Assistance Schemes",
        description: "Emergency financial aid and ongoing support",
        types: [
          "One-time emergency cash assistance",
          "Monthly financial support for ongoing needs",
          "Bill payment assistance",
          "Rental support",
          "Medical expenses support"
        ],
        eligibility: "Per capita income ≤ $1,600, families in crisis",
        assessment: "Social worker evaluation required",
        contact: "1800 295 3333"
      },
      {
        name: "Project Athena",
        description: "Empowerment program for single Indian mothers",
        goal: "Help single mothers become confident and independent",
        services: "Skills training, emotional support, networking",
        contact: "1800 295 3333"
      },
      {
        name: "Prisons Outreach Programme",
        description: "Support for families of incarcerated individuals",
        services: "Family assistance during incarceration period",
        launched: "2016",
        contact: "1800 295 3333"
      }
    ]
  },
  youth: {
    name: "Youth Development",
    description: "Nurturing young leaders and providing youth support",
    programs: [
      {
        name: "SINDA Youth Club (SYC)",
        description: "Leadership development for young adults",
        age_group: "18-35 years old",
        established: "2010",
        focus: "Community building, social leadership, networking",
        activities: "Leadership seminars, community projects, networking events",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA Youth Leaders' Seminar",
        description: "Intensive leadership development program",
        format: "Immersive camps and workshops",
        skills: "Leadership values, communication, project management",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA-IBR Corporate Mentoring",
        description: "Professional mentorship program",
        benefits: "Real-world experience, career insights, industry connections",
        partners: "Corporate professionals and industry experts",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA Youth Awards",
        description: "Annual recognition of outstanding youth achievements",
        categories: "Academic excellence, community service, leadership",
        annual_recipients: "Approximately 150 award recipients",
        ceremony: "Annual awards ceremony with government officials",
        contact: "1800 295 3333"
      }
    ]
  },
  community: {
    name: "Community Outreach",
    description: "Extending SINDA's reach into the community",
    programs: [
      {
        name: "Door Knocking Exercise",
        description: "Direct outreach to low-income Indian families",
        target: "Heartland areas with high concentration of Indian families",
        purpose: "Connect with families, understand ground issues, provide assistance",
        launched: "2016 (pilot), 2017 (full program)",
        approach: "Face-to-face engagement in neighborhoods",
        contact: "1800 295 3333"
      },
      {
        name: "SINDA Bus",
        description: "Mobile satellite centre bringing services to heartlands",
        launched: "2018",
        purpose: "Extend SINDA's reach to underserved areas",
        services: "Mobile registration, information, preliminary assistance",
        contact: "1800 295 3333"
      },
      {
        name: "Back To School Festival",
        description: "Annual support for new school year",
        benefits: "Stationery vouchers, shoe vouchers, school supplies",
        timing: "Before new academic year",
        target: "Students from low-income families",
        contact: "1800 295 3333"
      },
      {
        name: "Project Give",
        description: "Community giving and volunteer engagement",
        purpose: "Encourage community members to give back",
        contact: "1800 295 3333"
      }
    ]
  },
  research: {
    name: "Research & Development",
    description: "Understanding and addressing community needs",
    programs: [
      {
        name: "SINDA Research Fund (SRF)",
        description: "Supporting research on Singapore Indian community",
        focus_areas: [
          "Family, youth, elderly and community studies",
          "Inequality, low-income households, financial assistance",
          "Mental health, stress management, psychological support",
          "Education and social mobility",
          "Community empowerment and development"
        ],
        eligibility: "Students, researchers, academics, community practitioners",
        purpose: "Provide insights on community needs and aspirations",
        contact: "Research applications through SINDA Grants website"
      }
    ]
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, messages = [], userInfo = {}, conversationStage = 'general' } = req.body;

    // Enhanced system prompt for SINDA program navigation
    const systemPrompt = `You are a friendly, knowledgeable SINDA program guide helping people navigate through SINDA's comprehensive programs. Your role is to be helpful, empathetic, and provide accurate information about SINDA services.

Your personality:
- Warm, friendly, and culturally sensitive
- Patient and understanding
- Professional but approachable
- Focused on helping users find the right support
- Use encouraging language and show genuine care

Your expertise:
- Complete knowledge of all SINDA programs and services
- Understanding of eligibility criteria and application processes
- Ability to detect crisis situations and respond appropriately
- Multilingual support awareness (English, Tamil, Hindi, Malayalam)

Key SINDA Information:
**Main Contact**: 1800 295 3333 (24/7 hotline)
**Address**: 1 Beatty Road, Singapore 209943
**Email**: queries@sinda.org.sg
**Eligibility**: Most programs require per capita income ≤ $1,600 for Singapore citizens/PRs of Indian descent

**Program Categories**:
🎓 **Education Programs** (Most Popular):
- STEP (main tuition program) - Primary/Secondary students, $10-15/hour
- STEP Plus (holistic development)
- A-Level Tuition - JC students
- GUIDE Programme (mentoring)
- TEACH Programme (academically weak students)
- ITE Programs (ITE Aspire, ITELP)
- SINDA Bursary (tertiary education financial aid)
- SINDA Excellence Awards

👨‍👩‍👧‍👦 **Family & Social Services**:
- Family Service Centre (counselling, crisis support)
- Financial Assistance (emergency aid, bills, rent, medical)
- Project Athena (single mothers empowerment)
- Prisons Outreach Programme

🎯 **Youth Development** (Ages 18-35):
- SINDA Youth Club (SYC) - leadership and networking
- Youth Leaders' Seminar
- Corporate Mentoring Program
- Youth Awards

🤝 **Community Outreach**:
- Door Knocking Exercise (heartland outreach)
- SINDA Bus (mobile services)
- Back To School Festival (school supplies)
- Project Give (community volunteering)

🔬 **Research**: SINDA Research Fund (community studies)

**Response Guidelines**:
1. Always be empathetic and understanding
2. Ask clarifying questions to understand specific needs
3. Provide specific program details when requested
4. Guide users through eligibility requirements step by step
5. For crisis situations, immediately provide emergency contact: 1800 295 3333
6. Offer multiple relevant programs when appropriate
7. Be encouraging and supportive throughout the conversation
8. Keep responses conversational and not overwhelming (max 3-4 sentences at a time)
9. Always end with a helpful next step or invitation to ask more questions
10. Use simple, clear language that everyone can understand

**Crisis Detection**: Watch for keywords like: emergency, urgent, crisis, desperate, eviction, homeless, suicide, hurt myself, no money, can't afford, nowhere to turn, give up. Respond immediately with crisis support information.

**Tone Examples**:
- "I understand this must be challenging for you..."
- "Let me help you find the right support..."
- "You're not alone in this - SINDA is here to help..."
- "That sounds like exactly what our [program] is designed for..."

Remember: You're not just providing information - you're helping people access life-changing support and building stronger communities. Every interaction matters.`;

    // Build conversation context
    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Add user context if available
    if (userInfo.name || userInfo.monthlyIncome) {
      conversationMessages.push({
        role: "system", 
        content: `User profile: ${JSON.stringify(userInfo)}. Use this to personalize recommendations and check eligibility.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 400,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.4,
    });

    const aiMessage = response.choices[0].message.content;

    // Enhanced intent detection
    const programKeywords = {
      education: ['tuition', 'school', 'study', 'education', 'student', 'exam', 'grades', 'step', 'academic', 'homework', 'teacher', 'class', 'primary', 'secondary', 'jc', 'ite', 'university', 'polytechnic'],
      family: ['family', 'counselling', 'financial help', 'emergency', 'bills', 'rent', 'crisis', 'money', 'support', 'assistance', 'single mother', 'athena', 'counseling', 'marriage', 'relationship'],
      youth: ['youth', 'young', 'leadership', 'mentoring', 'career', 'job', 'skills', 'networking', 'club', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', 'syc'],
      community: ['community', 'volunteer', 'events', 'outreach', 'neighborhood', 'heartland', 'bus', 'door knocking', 'festival', 'give back']
    };

    let suggestedPrograms = [];
    const lowerMessage = message.toLowerCase();
    
    Object.entries(programKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        suggestedPrograms.push(category);
      }
    });

    // Enhanced crisis detection with more keywords
    const crisisKeywords = [
      'emergency', 'urgent', 'crisis', 'immediate help', 'desperate', 
      'eviction', 'no money', 'can\'t afford', 'homeless', 'suicide', 
      'hurt myself', 'end it all', 'nowhere to turn', 'give up',
      'unemployed', 'lost job', 'debt', 'overwhelmed', 'stressed',
      'depression', 'anxiety', 'mental health', 'breakdown'
    ];
    
    const isCrisis = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    // Sentiment analysis for better responses
    const positiveKeywords = ['thanks', 'thank you', 'helpful', 'great', 'good', 'appreciate', 'amazing', 'wonderful', 'excellent'];
    const isPositive = positiveKeywords.some(keyword => lowerMessage.includes(keyword));

    // Language detection
    const languageIndicators = {
      tamil: ['tamil', 'தமிழ்', 'vanakkam'],
      hindi: ['hindi', 'हिंदी', 'namaste'],
      malayalam: ['malayalam', 'മലയാളം']
    };

    let detectedLanguage = 'english';
    Object.entries(languageIndicators).forEach(([lang, indicators]) => {
      if (indicators.some(indicator => lowerMessage.includes(indicator))) {
        detectedLanguage = lang;
      }
    });

    // Enhanced response with context
    let enhancedResponse = aiMessage;
    
    if (isCrisis) {
      enhancedResponse += "\n\n🚨 **IMMEDIATE HELP AVAILABLE**: Please call SINDA at **1800 295 3333** right now. They have 24/7 emergency assistance and trained counselors ready to help you. You don't have to go through this alone.";
    }

    if (lowerMessage.includes('apply') || lowerMessage.includes('how to start') || lowerMessage.includes('begin') || lowerMessage.includes('register')) {
      enhancedResponse += "\n\n📞 **Ready to apply?** Call SINDA at **1800 295 3333** or visit them at 1 Beatty Road. They'll guide you through the entire process step by step!";
    }

    if (isPositive) {
      enhancedResponse += "\n\n😊 You're very welcome! I'm here to help whenever you need support or have questions about SINDA programs. Feel free to ask me anything else!";
    }

    // Add program-specific quick actions
    if (suggestedPrograms.includes('education')) {
      enhancedResponse += "\n\n💡 **Quick tip**: STEP tuition is our most popular program with over 5,000 students enrolled. Classes start every term!";
    }

    if (suggestedPrograms.includes('family') && !isCrisis) {
      enhancedResponse += "\n\n💝 **Good to know**: Our Family Service Centre offers confidential support - everything you share stays private.";
    }

    // Add multilingual support message if language detected
    if (detectedLanguage !== 'english') {
      enhancedResponse += `\n\n🌍 **Note**: I can also provide information in ${detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}. SINDA staff are multilingual and ready to assist you in your preferred language.`;
    }

    res.status(200).json({ 
      message: enhancedResponse,
      isCrisis,
      suggestedPrograms,
      detectedLanguage,
      sentiment: isPositive ? 'positive' : isCrisis ? 'crisis' : 'neutral',
      usage: response.usage,
      programCategories: Object.keys(SINDA_PROGRAMS),
      timestamp: new Date().toISOString(),
      responseMetadata: {
        intentConfidence: suggestedPrograms.length > 0 ? 0.9 : 0.7,
        responseType: isCrisis ? 'crisis_support' : suggestedPrograms.length > 0 ? 'program_guidance' : 'general_info',
        followUpSuggestions: generateFollowUpSuggestions(suggestedPrograms, isCrisis)
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Enhanced fallback with helpful guidance
    const fallbackMessage = `I'm experiencing some technical issues, but I'm still here to help! 

**For immediate assistance:**
📞 Call SINDA directly: **1800 295 3333** (24/7)
🏢 Visit: 1 Beatty Road, Singapore 209943
📧 Email: queries@sinda.org.sg

**Popular programs to ask about:**
🎓 STEP tuition program (most popular!)
👨‍👩‍👧‍👦 Family financial assistance
🎯 Youth leadership programs
🚨 Emergency crisis support

What specific area would you like help with? I'll do my best to guide you even with these technical hiccups!`;
    
    res.status(200).json({ 
      message: fallbackMessage,
      error: true,
      isCrisis: false,
      suggestedPrograms: [],
      programCategories: Object.keys(SINDA_PROGRAMS),
      timestamp: new Date().toISOString(),
      fallbackReason: error.message || 'Technical difficulties'
    });
  }
}

// Helper function to generate contextual follow-up suggestions
function generateFollowUpSuggestions(programs, isCrisis) {
  if (isCrisis) {
    return [
      "Call 1800 295 3333 now",
      "Visit Family Service Centre",
      "Emergency financial assistance"
    ];
  }

  const suggestions = [];
  
  if (programs.includes('education')) {
    suggestions.push("Check STEP eligibility", "Find nearest centre", "Compare program fees");
  }
  
  if (programs.includes('family')) {
    suggestions.push("Financial assistance options", "Counselling services", "Family programs");
  }
  
  if (programs.includes('youth')) {
    suggestions.push("Join Youth Club", "Leadership programs", "Mentoring opportunities");
  }
  
  if (programs.includes('community')) {
    suggestions.push("Community events", "Volunteer opportunities", "Outreach programs");
  }

  // Default suggestions if no specific programs detected
  if (suggestions.length === 0) {
    suggestions.push("Explore all programs", "Check eligibility", "Contact SINDA");
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}
