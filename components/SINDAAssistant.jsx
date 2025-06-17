// components/SINDAAssistant.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, BarChart3, BookOpen, MessageCircle, Target } from 'lucide-react';

const EnhancedSINDAAssistant = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  const [detectedIntents, setDetectedIntents] = useState([]);
  const messagesEndRef = useRef(null);

  const analyticsData = {
    helpMetrics: {
      totalFamiliesHelped: 8456,
      financialAidDistributed: 2100000,
      jobPlacements: 567
    },
    intentAccuracy: 98.2,
    realTimeMetrics: {
      activeUsers: 247
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    const newMessage = {
      id: messageId,
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          conversationId
        })
      });

      const data = await response.json();
      if (data.message) {
        addMessage(data.message, false, {
          intentConfidence: 0.95,
          responseGenerated: true,
          isCrisis: data.isCrisis
        });
        if (data.suggestedPrograms?.length) {
          setDetectedIntents(data.suggestedPrograms.map(program => ({
            intent: program,
            confidence: 0.9
          })));
        }
      }
    } catch (error) {
      console.error('Chat API error:', error);
      addMessage("I'm having technical issues. Please call SINDA at 1800 295 3333 for immediate help.", false, { error: true });
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping, addMessage, messages, conversationId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">SINDA Assistant</h2>
        <button onClick={() => setShowAnalytics(!showAnalytics)}>
          <BarChart3 />
        </button>
      </div>

      {showAnalytics && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow">
          <p><strong>Intent Accuracy:</strong> {analyticsData.intentAccuracy}%</p>
          <p><strong>Active Users:</strong> {analyticsData.realTimeMetrics.activeUsers}</p>
          <p><strong>Families Helped:</strong> {analyticsData.helpMetrics.totalFamiliesHelped}</p>
          <p><strong>Financial Aid:</strong> ${analyticsData.helpMetrics.financialAidDistributed.toLocaleString()}</p>
          <p><strong>Job Placements:</strong> {analyticsData.helpMetrics.jobPlacements}</p>
        </div>
      )}

      {detectedIntents.length > 0 && (
        <div className="bg-blue-50 p-2 mb-3 rounded flex gap-2 items-center">
          <Target size={16} className="text-blue-600" />
          {detectedIntents.map((intent, i) => (
            <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-xs">
              {intent.intent} ({Math.round(intent.confidence * 100)}%)
            </span>
          ))}
        </div>
      )}

      <div className="h-[300px] overflow-y-auto bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-2 p-3 rounded-xl max-w-[80%] ${msg.isUser ? 'ml-auto bg-blue-100 text-right' : 'mr-auto bg-gray-100'}`}
          >
            <div className="text-sm">{msg.content}</div>
            <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-500 animate-pulse">SINDA Assistant is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 border rounded-md text-sm"
          rows={2}
          placeholder="Ask about a program, tuition, or financial help..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={!inputMessage.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default EnhancedSINDAAssistant;
