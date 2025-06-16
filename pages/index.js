// pages/index.js - Complete Working SINDA Demo
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const languages = {
    english: { name: 'English', greeting: 'Vanakkam! Welcome to SINDA. I\'m here to help you learn about our community programs, educational support, and services. How can I assist you today?' },
    tamil: { name: 'தமிழ்', greeting: 'வணக்கம்! SINDA க்கு வரவேற்கிறோம். எங்கள் சமூக திட்டங்கள், கல்வி உதவி மற்றும் சேவைகள் பற்றி அறிய உங்களுக்கு உதவ நான் இங்கே இருக்கிறேன்.' },
    hindi: { name: 'हिंदी', greeting: 'नमस्ते! SINDA में आपका स्वागत है। मैं यहाँ आपको हमारे सामुदायिक कार्यक्रमों, शैक्षिक सहायता और सेवाओं के बारे में जानने में मदद करने के लिए हूँ।' },
    telugu: { name: 'తెలుగు', greeting: 'నమస్కారం! SINDA కి స్వాగతం. మా కమ్యూనిటీ ప్రోగ్రామ్స్, విద్య సహాయం మరియు సేవల గురించి తెలుసుకోవడానికి మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.' },
    malayalam: { name: 'മലയാളം', greeting: 'നമസ്കാരം! SINDA യിലേക്ക് സ്വാഗതം. ഞങ്ങളുടെ കമ്മ്യൂണിറ്റി പ്രോഗ്രാമുകൾ, വിദ്യാഭ്യാസ സഹായം, സേവനങ്ങൾ എന്നിവയെക്കുറിച്ച് അറിയാൻ നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.' }
  };

  const quickTopics = [
    { id: 'education', text: 'Educational Support', emoji: '📚' },
    { id: 'community', text: 'Community Programs', emoji: '🤝' },
    { id: 'cultural', text: 'Cultural Events', emoji: '🎭' },
    { id: 'professional', text: 'Career Guidance', emoji: '💼' },
    { id: 'family', text: 'Family Support', emoji: '👨‍👩‍👧‍👦' },
    { id: 'financial', text: 'Financial Assistance', emoji: '💰' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, isUser = false) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, message]);
  };

  const handleLanguageSelect = (langKey) => {
    setSelectedLanguage(langKey);
    addMessage(languages[langKey].greeting, false);
    setCurrentStep('chat');
  };

  const queryMistralAI = async (userMessage) => {
    try {
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
              content: `You are a helpful assistant for SINDA (Singapore Indian Development Association). 
              
              SINDA provides:
              - Educational support and tuition assistance
              - Community welfare programs  
              - Cultural heritage programs
              - Professional development and skills training
              - Family counseling and support services
              - Youth development programs
              - Senior citizen care
              - Financial assistance schemes
              
              Contact: 6298 8775 | 1 Beatty Road, Singapore 209943 | info@sinda.org.sg
              
              Provide helpful, warm, and culturally sensitive responses about SINDA's programs. Keep responses concise (2-3 sentences) and encourage contact for detailed information.`
            },
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
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'd be happy to connect you with our community team for detailed assistance. Please call 6298 8775.";
    } catch (error) {
      console.error('Mistral AI Error:', error);
      return "I'm experiencing technical difficulties. Please contact our support team at 6298 8775 for immediate assistance with SINDA programs and services.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await queryMistralAI(userMessage);
      setTimeout(() => {
        addMessage(aiResponse, false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        addMessage("Our team is available at 6298 8775 for immediate assistance.", false);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleQuickTopic = (topic) => {
    const message = `Tell me about ${topic.text}`;
    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>SINDA Community Assistant</title>
        <meta name="description" content="Singapore Indian Development Association - AI-powered community support" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderBottom: '2px solid #fed7aa',
          padding: '20px 0'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                background: '#ea580c', 
                color: 'white', 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🏢
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0'
                }}>
                  SINDA Community Assistant
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#6b7280', 
                  margin: '5px 0 0 0'
                }}>
                  Here to help with programs, services & community support
                </p>
              </div>
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🌍 {languages[selectedLanguage]?.name || 'English'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          
          {currentStep === 'language' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #fed7aa',
              marginBottom: '30px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ 
                  background: '#fff7ed', 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  fontSize: '36px'
                }}>
                  🌏
                </div>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0 0 10px 0'
                }}>
                  Welcome to SINDA
                </h2>
                <p style={{ 
                  fontSize: '18px', 
                  color: '#6b7280', 
                  margin: '0 0 10px 0'
                }}>
                  Singapore Indian Development Association
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af',
                  margin: '0'
                }}>
                  Please select your preferred language to continue
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px'
              }}>
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    style={{ 
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #fed7aa',
                      background: 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '16px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = '#fff7ed';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#fed7aa';
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      {lang.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280'
                    }}>
                      {key === 'english' && 'Select Language'}
                      {key === 'tamil' && 'மொழியைத் தேர்ந்தெடுக்கவும்'}
                      {key === 'hindi' && 'भाषा चुनें'}
                      {key === 'telugu' && 'భాషను ఎంచుకోండి'}
                      {key === 'malayalam' && 'ഭാഷ തിരഞ്ഞെടുക്കുക'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'chat' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #fed7aa'
            }}>
              
              {/* Chat Header */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                color: 'white',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '8px', 
                    borderRadius: '10px',
                    fontSize: '20px'
                  }}>
                    💬
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      margin: '0'
                    }}>
                      SINDA Community Assistant
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      opacity: '0.9',
                      margin: '5px 0 0 0'
                    }}>
                      Online • Ready to help
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Topics */}
              <div style={{ 
                background: '#fff7ed', 
                padding: '20px',
                borderBottom: '1px solid #fed7aa'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '0 0 15px 0'
                }}>
                  Quick topics to get started:
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px'
                }}>
                  {quickTopics.slice(0, 4).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleQuickTopic(topic)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'white',
                        border: '1px solid #fed7aa',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#ea580c';
                        e.target.style.color = 'white';
                        e.target.style.borderColor = '#ea580c';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = 'black';
                        e.target.style.borderColor = '#fed7aa';
                      }}
                    >
                      <span>{topic.emoji}</span>
                      <span>{topic.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ 
                height: '400px', 
                overflowY: 'auto', 
                padding: '20px'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{ 
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                      marginBottom: '15px'
                    }}
                  >
                    <div
                      style={{ 
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        ...(message.isUser ? {
                          background: '#ea580c',
                          color: 'white',
                          borderBottomRightRadius: '4px'
                        } : {
                          background: '#f3f4f6',
                          color: '#1f2937',
                          borderBottomLeftRadius: '4px'
                        })
                      }}
                    >
                      <p style={{ 
                        fontSize: '14px', 
                        margin: '0 0 5px 0',
                        lineHeight: '1.4'
                      }}>
                        {message.content}
                      </p>
                      <p style={{ 
                        fontSize: '11px',
                        margin: '0',
                        opacity: '0.7'
                      }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ 
                      background: '#f3f4f6',
                      borderRadius: '16px',
                      borderBottomLeftRadius: '4px',
                      padding: '12px 16px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#6b7280', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both'
                        }}></div>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#6b7280', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.16s'
                        }}></div>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#6b7280', 
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                          animationDelay: '0.32s'
                        }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ 
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{ 
                      flex: '1',
                      border: '1px solid #d1d5db',
                      borderRadius: '25px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    style={{ 
                      background: isLoading || !inputMessage.trim() ? '#d1d5db' : '#ea580c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading && inputMessage.trim()) {
                        e.target.style.background = '#dc2626';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading && inputMessage.trim()) {
                        e.target.style.background = '#ea580c';
                      }
                    }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div style={{ 
            marginTop: '30px',
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #fed7aa'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 20px 0'
            }}>
              SINDA Contact Information
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>📞</span>
                <div>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    margin: '0',
                    color: '#1f2937'
                  }}>
                    Hotline
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    6298 8775
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
                <div>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    margin: '0',
                    color: '#1f2937'
                  }}>
                    Email
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    info@sinda.org.sg
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <div>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    margin: '0',
                    color: '#1f2937'
                  }}>
                    Address
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    1 Beatty Road, Singapore 209943
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </>
  );
}
