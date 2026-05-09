import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { Message } from '../types';
import { createChat, sendMessageStream } from '../services/geminiService';
import { MOCK_INTERVIEW_INSTRUCTION } from '../constants';
import { Chat } from '@google/genai';

const MockInterview: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const startInterview = async () => {
    setIsActive(true);
    setIsInterviewEnded(false);
    setMessages([]);
    chatSessionRef.current = createChat(MOCK_INTERVIEW_INSTRUCTION);
    
    // Initial hidden prompt to kickstart the interview logic
    const hiddenPrompt = `Start a mock interview for the role of: ${role}. Begin by greeting me and asking the first question.`;
    
    setIsLoading(true);
    const modelMessageId = Date.now().toString();
    setMessages([{ id: modelMessageId, role: 'model', content: '', timestamp: Date.now(), isLoading: true }]);

    try {
      if(chatSessionRef.current) {
        await sendMessageStream(chatSessionRef.current, hiddenPrompt, (text) => {
             setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, content: text, isLoading: false } : msg
            ));
        });
      }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const endInterview = async () => {
    if (!chatSessionRef.current || isLoading || isInterviewEnded) return;
    
    setIsInterviewEnded(true);
    setIsLoading(true);
    
    // Add user message indicating end of interview
    const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: "End Interview",
        timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '', timestamp: Date.now(), isLoading: true }]);

    try {
        await sendMessageStream(chatSessionRef.current, "End Interview", (text) => {
            setMessages(prev => prev.map(msg => 
               msg.id === modelMessageId ? { ...msg, content: text, isLoading: false } : msg
           ));
       });
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setIsActive(false);
    setIsInterviewEnded(false);
    setMessages([]);
    chatSessionRef.current = null;
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
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '', timestamp: Date.now(), isLoading: true }]);

    try {
      await sendMessageStream(chatSessionRef.current, userMessage.content, (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, content: text, isLoading: false } : msg
        ));
      });
    } catch (error) {
        // Handle error
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

   // Voice Input Logic
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-transparent p-6">
        <div className="max-w-md w-full bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-8 text-center border border-gray-700">
            <div className="w-16 h-16 bg-blue-900/50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-500/20">
                <Mic size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Mock Interview</h2>
            <p className="text-gray-400 mb-8">
                Select a role and I'll test your knowledge, behavior, and technical skills with real-time feedback.
            </p>
            
            <div className="text-left mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
                <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400 shadow-sm"
                    placeholder="e.g. Frontend Developer"
                />
            </div>

            <button 
                onClick={startInterview}
                disabled={!role.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/50 transform hover:-translate-y-0.5"
            >
                <Play size={20} />
                <span>Start Interview</span>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="h-16 bg-gray-900/90 backdrop-blur-md border-b border-gray-700 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
         <div>
            <h2 className="font-semibold text-white">Interview: {role}</h2>
            {!isInterviewEnded ? (
                <p className="text-xs text-green-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live Session
                </p>
            ) : (
                <p className="text-xs text-gray-400 flex items-center">
                    <CheckCircle size={10} className="mr-1" />
                    Completed
                </p>
            )}
         </div>
         
         <div className="flex items-center space-x-2">
            {!isInterviewEnded && (
                <button 
                    onClick={endInterview} 
                    disabled={isLoading}
                    className="text-white bg-red-600 hover:bg-red-700 transition-colors px-3 py-1.5 rounded-lg text-sm font-medium flex items-center shadow-md shadow-red-900/30"
                >
                    <StopCircle size={16} className="mr-1.5" />
                    Finish & Get Feedback
                </button>
            )}
            <button 
                onClick={resetInterview} 
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-800"
                title="Reset"
            >
                 <XCircle size={20} />
            </button>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 z-10">
        {!isInterviewEnded ? (
            <div className="max-w-3xl mx-auto relative flex items-center bg-gray-800 border border-gray-600 rounded-full px-4 py-2 shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                    type="text"
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 py-2"
                    placeholder="Type your answer..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <div className="flex items-center space-x-2 ml-2">
                    <button 
                        onClick={toggleVoiceInput}
                        className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-900/50 text-red-400 animate-pulse' : 'hover:bg-gray-700 text-gray-400'}`}
                    >
                    {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        className={`p-2 rounded-full transition-all duration-200 ${
                            !inputText.trim() || isLoading 
                            ? 'bg-gray-700 text-gray-500' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md'
                        }`}
                    >
                    <Send size={18} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
                <button
                    onClick={startInterview}
                    className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all font-medium flex items-center justify-center shadow-lg shadow-blue-900/50 transform hover:-translate-y-0.5"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Start New Session
                </button>
                <button
                    onClick={resetInterview}
                    className="w-full md:w-auto px-6 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
                >
                    Back to Home
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;