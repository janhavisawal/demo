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
    const systemPrompt = `You are a friendly SINDA program assistant helping people find the right support programs. Keep responses conversational, helpful, and concise.

Your role:
- Help users discover SINDA programs that match their needs
- Explain programs in simple terms
- Guide them to apply when ready
- Be warm and approachable, not formal

SINDA Programs (mention only when relevant):
**Education**: Tuition subsidies, pre-school help, university bursaries
**Family**: Counselling, emergency financial aid, family support  
**Employment**: Job training, career help, skills courses
**Eldercare**: Senior activity centres, social programs

Key eligibility (mention if asked):
- Most programs for household income under $4,500-$6,000
- Must be Singapore citizen/PR
- Emergency help available for urgent cases

Guidelines:
- Use natural, friendly language like you're talking to a friend
- Don't start every response with "Hi" or the person's name
- Keep responses 2-3 sentences unless they ask for details
- Ask simple follow-up questions to understand their needs
- Only mention specific programs when relevant to their situation
- If they want to apply, direct them to call SINDA or visit the website
- For emergencies, immediately mention calling 6298 8775

Be helpful but not overwhelming. Focus on having a natural conversation.`;

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
      'eviction', 'no money', 'can\'t afford', 'homeless'
    ];
    
    const isCrisis = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    // Enhanced response with program suggestions
    let enhancedResponse = aiMessage;
    
    if (isCrisis) {
      enhancedResponse += "\n\n🚨 For immediate help, please call SINDA at 6298 8775 right away.";
    }

    // Add simple call-to-action for applications
    if (lowerMessage.includes('apply') || lowerMessage.includes('how to') || lowerMessage.includes('start')) {
      enhancedResponse += "\n\nReady to apply? Call SINDA at 6298 8775 or visit www.sinda.org.sg to get started!";
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

What are you looking for today? Education support, family help, job training, or something else? Just tell me a bit about your situation and I'll point you in the right direction.

You can also call 6298 8775 or visit www.sinda.org.sg anytime.`;
    
    res.status(200).json({ 
      message: fallbackMessage,
      error: true,
      isCrisis: false,
      programCategories: Object.keys(SINDA_PROGRAMS)
    });
  }
}
