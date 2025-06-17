// pages/index.js - SINDA Chatbot UI with Tailwind Styling
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
    { text: '📚 Education Programs', type: 'education' },
    { text: '👨‍👩‍👧‍👦 Family Services', type: 'family' },
    { text: '💼 Employment Support', type: 'employment' },
    { text: '👴 Eldercare Services', type: 'eldercare' },
    { text: '💰 Financial Assistance', type: 'financial' },
    { text: '🚨 Urgent Help', type: 'crisis' }
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
        <title>SINDA Community Support</title>
        <meta name="description" content="SINDA chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
        {currentStep === 'welcome' && (
          <div className="text-center mt-24">
            <h1 className="text-4xl font-bold mb-4">Welcome to SINDA Support</h1>
            <p className="text-lg text-gray-600 mb-6">We’re here to help you find the right programs and guidance.</p>
            <button onClick={handleWelcomeStart} className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow">Start</button>
          </div>
        )}

        {currentStep === 'language' && (
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold mb-4">Select Your Language</h2>
            <div className="flex justify-center gap-4">
              {Object.entries(languages).map(([key, lang]) => (
                <button key={key} onClick={() => handleLanguageSelect(key)} className="px-4 py-2 border border-orange-400 rounded text-orange-700 hover:bg-orange-100">{lang.name}</button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="w-full max-w-2xl flex flex-col bg-white rounded-lg shadow p-4">
            <div className="flex flex-col space-y-2 h-[400px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg text-sm max-w-xs ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>{msg.content}</div>
                </div>
              ))}
              {isTyping && <div className="text-sm text-gray-500">Typing...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2 mt-4">
              <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 px-4 py-2 border rounded focus:outline-none" placeholder="Type your message..." />
              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Send</button>
            </form>
          </div>
        )}

        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Apply for SINDA Program</h3>
              <input placeholder="Name" value={contactData.name} onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-3 py-2 border rounded" />
              <input placeholder="Phone" value={contactData.phone} onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))} required className="w-full px-3 py-2 border rounded" />
              <textarea placeholder="Tell us about your situation..." value={contactData.description} onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowContactForm(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">Submit</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
