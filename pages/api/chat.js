// pages/api/chat.js - SINDA Program Guide API
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SINDA Programs Database
const SINDA_PROGRAMS = {
  education: {
    name: "Education Support",
    programs: [
      {
        name: "SINDA Tuition Scheme",
        description: "Subsidised tuition for primary and secondary students",
        eligibility: "Monthly household income ≤ $4,500",
        applicationProcess: "Submit online application with income documents",
        documents: ["IC copies", "Income statements", "School reports"],
        website: "https://www.sinda.org.sg/education/tuition-scheme"
      },
      {
        name: "Pre-School Subsidies",
        description: "Financial assistance for kindergarten and childcare",
        eligibility: "Monthly household income ≤ $6,000",
        applicationProcess: "Apply through participating centres",
        documents: ["IC copies", "Income proof", "Birth certificate"],
        website: "https://www.sinda.org.sg/education/preschool"
      },
      {
        name: "Higher Education Bursaries",
        description: "Financial aid for polytechnic and university students",
        eligibility: "Monthly per capita income ≤ $1,125",
        applicationProcess: "Apply online with academic transcripts",
        documents: ["Academic records", "Income proof", "Bank statements"],
        website: "https://www.sinda.org.sg/education/higher-education"
      }
    ]
  },
  family: {
    name: "Family Services",
    programs: [
      {
        name: "Family Service Centre",
        description: "Counselling and family support services",
        eligibility: "Open to all families needing support",
        applicationProcess: "Walk-in or call for appointment",
        documents: ["IC copies"],
        website: "https://www.sinda.org.sg/family-services/fsc"
      },
      {
        name: "Financial Assistance",
        description: "Emergency financial aid for families in crisis",
        eligibility: "Monthly household income ≤ $3,000",
        applicationProcess: "Assessment by social worker required",
        documents: ["Income proof", "Bills", "Bank statements"],
        website: "https://www.sinda.org.sg/family-services/financial-aid"
      }
    ]
  },
  employment: {
    name: "Employment Support",
    programs: [
      {
        name: "Skills Training Programs",
        description: "Vocational training and certification courses",
        eligibility: "Singapore citizens and PRs",
        applicationProcess: "Register online or at SINDA centres",
        documents: ["IC copy", "Educational certificates"],
        website: "https://www.sinda.org.sg/employment/skills-training"
      },
      {
        name: "Job Placement Services",
        description: "Career guidance and job matching services",
        eligibility: "Open to all job seekers",
        applicationProcess: "Register with employment team",
        documents: ["Resume", "IC copy"],
        website: "https://www.sinda.org.sg/employment/job-placement"
      }
    ]
  },
  eldercare: {
    name: "Eldercare Services",
    programs: [
      {
        name: "Senior Activity Centres",
        description: "Day care and social activities for seniors",
        eligibility: "Seniors aged 60 and above",
        applicationProcess: "Register at nearest centre",
        documents: ["IC copy", "Medical reports if applicable"],
        website: "https://www.sinda.org.sg/eldercare/senior-centres"
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

    // Enhanced system prompt for SINDA program guidance
    const systemPrompt = `You are the SINDA Program Guide Assistant, helping users discover and apply for SINDA programs in Singapore. SINDA supports the Indian community with education, family services, employment, and eldercare programs.

Your role is to:
1. **Understand user needs** - Ask about their situation, family income, and specific challenges
2. **Recommend suitable programs** - Match users to appropriate SINDA services based on their needs and eligibility
3. **Guide through applications** - Explain application processes, required documents, and deadlines
4. **Provide accurate information** - Use the SINDA programs database to give specific details
5. **Be proactive** - Suggest related programs they might benefit from

SINDA Program Categories:
- **Education**: Tuition schemes, pre-school subsidies, higher education bursaries
- **Family Services**: Counselling, financial assistance, family support
- **Employment**: Skills training, job placement, career guidance  
- **Eldercare**: Senior activity centres, social programs

Key Information:
- SINDA serves the Indian community in Singapore
- Most programs have income eligibility criteria
- Applications typically require IC copies and income proof
- Emergency help available at 6298 8775
- Main website: www.sinda.org.sg

Guidelines:
- Ask qualifying questions to determine eligibility
- Provide specific program names, eligibility criteria, and application steps
- Mention required documents upfront
- Offer to help with application process
- Be warm and supportive - many users may be in difficult situations
- Use simple, clear language and avoid jargon
- Always provide website links for detailed information

Current programs database: ${JSON.stringify(SINDA_PROGRAMS)}`;

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
      temperature: 0.3, // More focused responses for program guidance
      max_tokens: 1200,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.4,
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
      'eviction', 'no money', 'can\'t afford', 'homeless'
    ];
    
    const isCrisis = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    // Enhanced response with program suggestions
    let enhancedResponse = aiMessage;
    
    if (isCrisis) {
      enhancedResponse += "\n\n🚨 **URGENT HELP**: For immediate assistance, please call SINDA at 6298 8775. Our Family Service Centre can provide emergency support.";
    }

    // Add program recommendations based on context
    if (suggestedPrograms.length > 0 && !aiMessage.includes('www.sinda.org.sg')) {
      enhancedResponse += "\n\n💡 **Quick Links**: Visit www.sinda.org.sg for detailed information and online applications.";
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
    const fallbackMessage = `I'm experiencing some technical difficulties, but I'm still here to help you find the right SINDA programs! 

Here are some quick options:
📚 **Education Support**: Tuition schemes and bursaries
👨‍👩‍👧‍👦 **Family Services**: Counselling and financial assistance  
💼 **Employment**: Skills training and job placement
👴 **Eldercare**: Senior activity centres

Visit www.sinda.org.sg or call 6298 8775 for immediate help with applications.`;
    
    res.status(200).json({ 
      message: fallbackMessage,
      error: true,
      isCrisis: false,
      programCategories: Object.keys(SINDA_PROGRAMS)
    });
  }
}
