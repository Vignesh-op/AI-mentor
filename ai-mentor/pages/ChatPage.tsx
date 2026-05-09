import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { Message } from '../types';
import { createChat, sendMessageStream } from '../services/geminiService';
import { MENTOR_PERSONA } from '../constants';
import { Chat } from '@google/genai';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "Hello! I'm AI Mentor. How can I help you advance your career today?", timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize standard mentor chat
    chatSessionRef.current = createChat(MENTOR_PERSONA);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    const modelMessagePlaceholder: Message = {
      id: modelMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isLoading: true
    };
    setMessages(prev => [...prev, modelMessagePlaceholder]);

    try {
      await sendMessageStream(chatSessionRef.current, userMessage.content, (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, content: text, isLoading: false } 
            : msg
        ));
      });
    } catch (error) {
       setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, content: "I'm having trouble connecting right now. Please try again.", isLoading: false } 
            : msg
        ));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-2">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-700">
        <div className="max-w-3xl mx-auto relative flex items-center bg-gray-800 border border-gray-600 rounded-full px-4 py-2 shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 py-2"
            placeholder="Ask anything about your career..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          
          <div className="flex items-center space-x-2 ml-2">
            <button 
              onClick={toggleVoiceInput}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-900/50 text-red-400 animate-pulse' : 'hover:bg-gray-700 text-gray-400'}`}
              title="Voice Input"
            >
              {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                !inputText.trim() || isLoading 
                  ? 'bg-gray-700 text-gray-500' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-500 hover:to-indigo-500'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          AI Mentor can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;