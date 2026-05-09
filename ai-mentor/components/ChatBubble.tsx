import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Sparkles, Volume2, Square, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    setIsAudioLoading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const pcmBytes = await generateSpeech(message.content);
      const audioBuffer = decodePCM(pcmBytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      
      sourceRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (e) {
      console.error("Failed to play audio", e);
      alert("Could not play audio. Please try again.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const decodePCM = (bytes: Uint8Array, ctx: AudioContext): AudioBuffer => {
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    return buffer;
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm border border-white/10 ${
          isUser 
            ? 'bg-blue-900/50 ml-3 text-blue-400' 
            : 'bg-indigo-900/50 mr-3 text-indigo-400'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div className={`p-4 rounded-2xl shadow-md text-sm md:text-base overflow-hidden ${
            isUser 
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none shadow-blue-900/20' 
              : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none shadow-gray-900/30'
          }`}>
            {message.isLoading ? (
              <div className="flex space-x-1.5 py-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className={`markdown-body ${isUser ? 'text-white' : 'text-gray-100'} overflow-x-auto`}>
                 <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Action Bar (Audio) */}
          {!isUser && !message.isLoading && (
            <div className="flex items-center mt-1 ml-1">
              <button 
                onClick={handlePlayAudio}
                disabled={isAudioLoading}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-gray-800"
                title="Read Aloud"
              >
                {isAudioLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isPlaying ? (
                  <Square size={14} fill="currentColor" />
                ) : (
                  <Volume2 size={14} />
                )}
                <span>{isPlaying ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;