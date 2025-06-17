// pages/index.js - SINDA Chatbot with Dummy Contact Form Trigger
import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [conversationStage, setConversationStage] = useState('name');
  const [userInfo, setUserInfo] = useState({ name: '', age: '', location: '', situation: '' });
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    programInterest: '',
    incomeRange: '',
    preferredTime: '',
    description: ''
  });

  const languages = {
    english: { name: 'English', greeting: 'Hello! I\'m here to help and support you. To start, may I know your name?' },
    tamil: { name: 'தமிழ்', greeting: 'வணக்கம்! நான் உங்களுக்கு உதவி மற்றும் ஆதரவு வழங்க இங்கே இருக்கிறேன். தொடங்க, உங்கள் பெயரைக் கூற முடியுமா?' },
    hindi: { name: 'हिंदी', greeting: 'नमस्ते! मैं आपकी मदद और सहायता के लिए यहाँ हूँ। शुरुआत के लिए, क्या मैं आपका नाम जान सकता हूँ?' }
  };

  const quickHelp = [
    { text: '📚 Education Programs', type: 'education', description: 'Tuition schemes, bursaries, pre-school subsidies' },
    { text: '👨‍👩‍👧‍👦 Family Services', type: 'family', description: 'Counselling, financial assistance, family support' },
    { text: '💼 Employment Support', type: 'employment', description: 'Skills training, job placement services' },
    { text: '👴 Eldercare Services', type: 'eldercare', description: 'Senior centres, social activities' },
    { text: '💰 Financial Assistance', type: 'financial', description: 'Emergency aid, bill payment help' },
    { text: '🚨 Urgent Help', type: 'crisis', description: 'Immediate crisis support' }
  ];

  const getBasicResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase().trim();
    let response = "";
    let nextStage = conversationStage;
    const updatedInfo = { ...userInfo };

    switch (conversationStage) {
      case 'name':
        if (message.length > 1) {
          updatedInfo.name = userMessage.trim();
          nextStage = 'age';
          response = `Nice to meet you, ${updatedInfo.name}! How old are you?`;
        } else {
          response = "I'd love to know what to call you. What's your name?";
        }
        break;
      case 'age':
        updatedInfo.age = userMessage.trim();
        nextStage = 'location';
        response = `Thank you, ${updatedInfo.name}. Which area of Singapore are you from?`;
        break;
      case 'location':
        updatedInfo.location = userMessage.trim();
        nextStage = 'open_chat';
        response = `I see you're from ${updatedInfo.location}. Now ${updatedInfo.name}, I'm here to listen. What's been on your mind lately?`;
        break;
      default:
        response = "I'm here to listen and help. What would you like to talk about?";
    }

    setUserInfo(updatedInfo);
    setConversationStage(nextStage);
    return response;
  }, [conversationStage, userInfo]);

  const queryOpenAI = useCallback(async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, userInfo, conversationStage })
      });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const data = await response.json();
      return data.message || "I understand. Can you tell me more about how you're feeling?";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm here to support you. Please tell me more about what's troubling you.";
    }
  }, [userInfo, conversationStage]);

  const addMessage = useCallback((content, isUser = false) => {
    const newMessage = {
      id: messageId,
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = ['name', 'age', 'location'].includes(conversationStage)
        ? getBasicResponse(userMessage)
        : await queryOpenAI(userMessage);

      setTimeout(() => {
        addMessage(response, false);
        setIsTyping(false);

        if (["urgent", "crisis", "emergency"].some(word => userMessage.toLowerCase().includes(word))) {
          setTimeout(() => {
            addMessage("🚨 If this is an emergency, please call SINDA at 1800 295 3333 immediately for assistance.", false);
          }, 1500);
        }
      }, Math.random() * 800 + 1200);
    } catch (error) {
      setTimeout(() => {
        addMessage("I'm experiencing some technical difficulties, but I'm still here to listen. Can you tell me more about what's on your mind?", false);
        setIsTyping(false);
      }, 1200);
    }
  }, [inputMessage, isTyping, addMessage, queryOpenAI, getBasicResponse, conversationStage]);

  const handleQuickHelp = useCallback((help) => {
    setInputMessage(help.text);
    setContactData(prev => ({ ...prev, programInterest: help.type }));
    setShowContactForm(true);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleWelcomeStart = () => setCurrentStep('language');

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setCurrentStep('chat');
    setTimeout(() => addMessage(languages[langKey].greeting, false), 500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setShowContactForm(false);
    addMessage(`Thank you, ${contactData.name}! We've noted your interest in the ${contactData.programInterest} program. Our team will follow up with you soon.`, false);
    setContactData({ name: '', phone: '', programInterest: '', incomeRange: '', preferredTime: '', description: '' });
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | Here to Help You</title>
        <meta name="description" content="SINDA provides compassionate community support for Indian families in Singapore." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* UI Continues... */}
    </>
  );
}
