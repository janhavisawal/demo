// pages/index.js - Clean SINDA Chatbot with OpenAI Integration
import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next.js';

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

  // User conversation state
  const [conversationStage, setConversationStage] = useState('name');
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    location: '',
    situation: ''
  });

  // Contact form data
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    description: ''
  });

  const languages = {
    english: { 
      name: 'English', 
      greeting: 'Hello! I\'m here to help and support you. To start, may I know your name?'
    },
    tamil: { 
      name: 'தமிழ்', 
      greeting: 'வணக்கம்! நான் உங்களுக்கு உதவி மற்றும் ஆதரவு வழங்க இங்கே இருக்கிறேன். தொடங்க, உங்கள் பெயரைக் கூற முடியுமா?'
    },
    hindi: { 
      name: 'हिंदी', 
      greeting: 'नमस्ते! मैं आपकी मदद और सहायता के लिए यहाँ हूँ। शुरुआत के लिए, क्या मैं आपका नाम जान सकता हूँ?'
    }
  };

  const quickHelp = [
    { text: '🚨 Urgent Help', type: 'crisis' },
    { text: '💰 Financial Support', type: 'financial' },
    { text: '👨‍👩‍👧‍👦 Family Matters', type: 'family' },
    { text: '📚 Education Help', type: 'education' },
    { text: '💼 Employment', type: 'employment' },
    { text: '💬 General Support', type: 'general' }
  ];

  // Basic conversation flow for initial questions
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

  // OpenAI Integration
  const queryOpenAI = useCallback(async (userMessage) => {
    try {
      console.log('Sending message to OpenAI:', userMessage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userInfo: userInfo,
          conversationStage: conversationStage
        })
      });

      console.log('OpenAI API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI API Response data:', data);
      
      return data.message || "I understand. Can you tell me more about how you're feeling?";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm here to support you. Please tell me more about what's troubling you.";
    }
  }, [userInfo, conversationStage]);

  // Message handling
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
      // Use basic responses for initial info gathering, OpenAI for everything else
      const response = conversationStage === 'name' || conversationStage === 'age' || conversationStage === 'location'
        ? getBasicResponse(userMessage)
        : await queryOpenAI(userMessage);
      
      setTimeout(() => {
        addMessage(response, false);
        setIsTyping(false);
        
        // Crisis detection
        if (userMessage.toLowerCase().includes('urgent') || 
            userMessage.toLowerCase().includes('crisis') ||
            userMessage.toLowerCase().includes('emergency')) {
          setTimeout(() => {
            addMessage("🚨 If this is an emergency, please call our 24/7 helpline at 6298 8775 immediately.", false);
          }, 1500);
        }
      }, Math.random() * 800 + 1200);
      
    } catch (error) {
      setTimeout(() => {
        const fallbackResponse = "I'm experiencing some technical difficulties, but I'm still here to listen. Can you tell me more about what's on your mind?";
        addMessage(fallbackResponse, false);
        setIsTyping(false);
      }, 1200);
    }
  }, [inputMessage, isTyping, addMessage, queryOpenAI, getBasicResponse, conversationStage]);

  const handleQuickHelp = useCallback((help) => {
    setInputMessage(help.text);
    setTimeout(() => handleSendMessage(), 100);
  }, [handleSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleWelcomeStart = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    setCurrentStep('chat');
    
    setTimeout(() => {
      addMessage(languages[langKey].greeting, false);
    }, 500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactData, userInfo);
    setShowContactForm(false);
    addMessage(`Thank you, ${contactData.name}! A SINDA counselor will contact you within 24 hours. Remember, you can always call 6298 8775 if you need immediate support.`, false);
    setContactData({ name: '', phone: '', preferredTime: '', description: '' });
  };

  return (
    <>
      <Head>
        <title>SINDA Community Support | Here to Help You</title>
        <meta name="description" content="SINDA provides compassionate community support for Indian families in Singapore." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
        
        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0' }}>
                  SINDA Community Support
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: '4px 0 0 0' }}>
                  💜 Here to help you through life's challenges
                </p>
              </div>
              
              <a 
                href="tel:62988775"
                style={{ 
                  background: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🚨 Crisis Helpline: 6298 8775
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div style={{ 
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: '#3b82f6', 
                borderRadius: '50%', 
                margin: '0 auto 30px auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '40px'
              }}>
                💙
              </div>
              
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
                We're Here for You
              </h2>
              <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                Whether you're facing challenges with family, education, finances, or just need someone to talk to - SINDA's community support is here for you.
              </p>
              
              <button
                onClick={handleWelcomeStart}
                style={{ 
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
                }}
              >
                💬 Start Conversation
              </button>
            </div>
          )}

          {/* Language Selection */}
          {currentStep === 'language' && (
            <div style={{ 
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '40px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  Choose Your Language
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  We want you to feel comfortable expressing yourself
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px' 
              }}>
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    style={{ 
                      background: 'white',
                      border: '2px solid #fed7aa',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = '#fff7ed';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#fed7aa';
                      e.target.style.background = 'white';
                    }}
                  >
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      {lang.name}
                    </div>
                    <div style={{ 
                      background: '#ea580c',
                      color: 'white',
                      padding: '6px 12px', 
                      borderRadius: '15px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      border: 'none'
                    }}>
                      Select Language
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {currentStep === 'chat' && (
            <div style={{ 
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              
              {/* Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', 
                padding: '20px', 
                color: 'white' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      background: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      💙
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                        SINDA Support Helper
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0' }}>
                        Online • Ready to listen and help
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px', 
                      borderRadius: '12px', 
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📞 Request Call Back
                  </button>
                </div>
              </div>

              {/* Quick Help Buttons */}
              {messages.length === 0 && (
                <div style={{ padding: '20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ textAlign: 'center', color: '#374151', fontWeight: '600', marginBottom: '16px' }}>
                    What type of support do you need today?
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {quickHelp.map((help, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickHelp(help)}
                        style={{ 
                          background: help.type === 'crisis' ? '#dc2626' : '#ea580c',
                          color: 'white',
                          border: 'none',
                          padding: '12px', 
                          borderRadius: '8px', 
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {help.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div style={{ 
                height: '400px', 
                overflowY: 'auto', 
                padding: '20px', 
                background: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{ 
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ 
                      maxWidth: '75%',
                      padding: '12px 16px', 
                      borderRadius: '16px',
                      ...(message.isUser ? {
                        background: '#3b82f6',
                        color: 'white'
                      } : {
                        background: 'white',
                        color: '#111827',
                        border: '1px solid #e5e7eb'
                      })
                    }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                        {message.content}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        margin: '0',
                        opacity: '0.7'
                      }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ 
                      background: 'white',
                      borderRadius: '16px',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            background: '#ea580c', 
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite'
                          }}></div>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            background: '#ea580c', 
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite 0.16s'
                          }}></div>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            background: '#ea580c', 
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite 0.32s'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          SINDA helper is listening...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isTyping}
                    style={{ 
                      flex: '1',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    style={{ 
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      cursor: (isTyping || !inputMessage.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (isTyping || !inputMessage.trim()) ? '0.5' : '1'
                    }}
                  >
                    ➤
                  </button>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span style={{ 
                    background: '#fef2f2', 
                    color: '#dc2626', 
                    padding: '6px 12px', 
                    borderRadius: '15px', 
                    fontWeight: '600',
                    fontSize: '12px',
                    border: '1px solid #fecaca'
                  }}>
                    🚨 Emergency? Call 6298 8775 immediately
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                  Request Support Call
                </h3>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  Our caring counselors will reach out to you personally
                </p>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="What should we call you?"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+65 XXXX XXXX"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                    Best time to call
                  </label>
                  <select
                    value={contactData.preferredTime}
                    onChange={(e) => setContactData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="">When would you prefer we call?</option>
                    <option value="urgent">As soon as possible (urgent)</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                    How can we help? (optional)
                  </label>
                  <textarea
                    value={contactData.description}
                    onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Share anything you'd like us to know beforehand..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: '1',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!contactData.name || !contactData.phone}
                    style={{
                      flex: '2',
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: (!contactData.name || !contactData.phone) ? 'not-allowed' : 'pointer',
                      opacity: (!contactData.name || !contactData.phone) ? '0.5' : '1'
                    }}
                  >
                    💙 Request Call Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0.8); 
              opacity: 0.5; 
            }
            40% { 
              transform: scale(1.2); 
              opacity: 1; 
            }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            h1 {
              font-size: 20px !important;
            }
            
            h2 {
              font-size: 28px !important;
            }
            
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 480px) {
            .chat-container {
              margin: 10px;
              border-radius: 12px;
            }
            
            .welcome-container {
              padding: 30px 20px !important;
            }
            
            h2 {
              font-size: 24px !important;
            }
          }

          /* Smooth scrolling for chat */
          .chat-messages {
            scrollbar-width: thin;
            scrollbar-color: #ea580c #f3f4f6;
          }
          
          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }
          
          .chat-messages::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 3px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb {
            background: #ea580c;
            border-radius: 3px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #dc2626;
          }

          /* Focus states for accessibility */
          input:focus,
          textarea:focus,
          select:focus,
          button:focus {
            outline: 2px solid #ea580c;
            outline-offset: 2px;
          }

          /* Hover effects */
          button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }

          button:active {
            transform: translateY(0);
          }

          /* Input focus effects */
          input:focus,
          textarea:focus,
          select:focus {
            border-color: #ea580c !important;
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
          }
        `}</style>
      </div>
    </>
  );
}
