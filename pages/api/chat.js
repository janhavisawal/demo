// pages/api/chat.js - SINDA Program Guide API
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Comprehensive SINDA Programs Database (Based on Official Sources and Research)
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
    const systemPrompt = `You are a friendly SINDA program guide helping people navigate through SINDA's comprehensive programs. When users ask about programs, guide them through the options step by step.

Your role:
- Help users find the right SINDA programs for their specific needs
- Provide detailed program information when asked
- Guide them through eligibility requirements 
- Direct them to apply when ready
- Be conversational and helpful, not overwhelming

SINDA Program Categories:
**Education Programs** (Most Popular):
- STEP (main tuition program) - Primary/Secondary students
- STEP Plus (holistic development) 
- A-Level Tuition - JC students
- GUIDE Programme (mentoring)
- TEACH Programme (weak students)
- ITE Programs (ITE Aspire, ITELP)
- SINDA Bursary (tertiary education)
- SINDA Excellence Awards

**Family & Social Services**:
- Family Service Centre (counselling, crisis support)
- Financial Assistance (emergency aid, bills, rent)
- Project Athena (single mothers)
- Prisons Outreach

**Youth Development** (Ages 18-35):
- SINDA Youth Club (SYC)
- Youth Leaders' Seminar
- Corporate Mentoring
- Youth Awards

**Community Outreach**:
- Door Knocking Exercise
- SINDA Bus (mobile services)
- Back To School Festival
- Project Give

**Research**: SINDA Research Fund

Key Info (Updated 2024):
- Eligibility: Per capita income ≤ $1,600 (household income ÷ family members)
- For Singapore citizens/PRs of Indian descent
- Contact: 1800 295 3333 or queries@sinda.org.sg
- Address: 1 Beatty Road, Singapore 209943

Navigation Guidelines:
- When users ask about "programs" generally, show them the main categories first
- If they ask about specific needs (tuition, financial help, etc.), recommend relevant programs
- Provide program details only when they express interest in specific programs
- Always ask clarifying questions to understand their exact needs
- Keep responses conversational and not overwhelming
- Guide them step by step through their journey

Example Navigation:
User: "What programs do you have?"
You: "SINDA offers programs in several areas! Are you looking for:
📚 Education support (like tuition and academic help)
👨‍👩‍👧‍👦 Family services (counselling, financial assistance)  
🎯 Youth development (for ages 18-35)
🤝 Community programs

What area interests you most?"

Be helpful and guide them naturally through their program discovery journey.`;

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
        content: `User profile: ${JSON.stringify(userInfo)}. Use this to personalize recommendations.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: conversationMessages,
      temperature: 0.7, // More natural conversation
      max_tokens: 300, // Shorter responses
      top_p: 0.9,
      frequency_penalty: 0.5, // Reduce repetition
      presence_penalty: 0.6, // Encourage variety
    });

    const aiMessage = response.choices[0].message.content;

    // Detect if user is asking about specific programs
    const programKeywords = {
      education: ['tuition', 'school', 'study', 'education', 'student', 'exam', 'grades'],
      family: ['family', 'counselling', 'financial help', 'emergency', 'bills', 'rent'],
      employment: ['job', 'work', 'career', 'skills', 'training', 'unemployed', 'resume'],
      eldercare: ['elderly', 'senior', 'parent', 'grandparent', 'care', 'aged']
    };

    let suggestedPrograms = [];
    const lowerMessage = message.toLowerCase();
    
    Object.entries(programKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        suggestedPrograms.push(category);
      }
    });

    // Check for crisis situations
    const crisisKeywords = [
      'emergency', 'urgent', 'crisis', 'immediate help', 'desperate', 
      'eviction', 'no money', 'can\'t afford', 'homeless', 'suicide', 'hurt myself'
    ];
    
    const isCrisis = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    // Enhanced response with program suggestions
    let enhancedResponse = aiMessage;
    
    if (isCrisis) {
      enhancedResponse += "\n\n🚨 For immediate help, please call SINDA at 1800 295 3333 right away. They have emergency assistance available.";
    }

    // Add simple call-to-action for applications
    if (lowerMessage.includes('apply') || lowerMessage.includes('how to') || lowerMessage.includes('start')) {
      enhancedResponse += "\n\nReady to apply? Call SINDA at 1800 295 3333 or visit their office at 1 Beatty Road.";
    }

    res.status(200).json({ 
      message: enhancedResponse,
      isCrisis,
      suggestedPrograms,
      usage: response.usage,
      programCategories: Object.keys(SINDA_PROGRAMS)
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback with SINDA-specific guidance
    const fallbackMessage = `I'm having some technical issues, but I'm still here to help you find SINDA programs! 

What are you looking for today? Education support (like STEP tuition), family help, or something else? Just tell me a bit about your situation and I'll point you in the right direction.

You can also call 1800 295 3333 anytime for direct help.`;
    
    res.status(200).json({ 
      message: fallbackMessage,
      error: true,
      isCrisis: false,
      programCategories: Object.keys(SINDA_PROGRAMS)
    });
  }
}
