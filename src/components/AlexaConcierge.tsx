"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AlexaConcierge() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Alexa's initial context
  const initialGreeting = lang === 'ar' 
    ? "أهلاً بك في ذا فيستا. أنا أليكسا، مساعدتك الشخصية الفاخرة. كيف يمكنني مساعدتك في التخطيط لرحلتك القادمة في مصر اليوم؟" 
    : "Welcome to The Vista. I am Alexa, your luxury concierge. How may I assist you with your travel plans in Egypt today?";

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: initialGreeting
      }
    ]
  });

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Voice Toggle
  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      // Logic to stop MediaRecorder and send to Gemini
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsListening(true);
        // Logic to start MediaRecorder...
        // For now, we simulate the "Live" interaction
      } catch (err) {
        console.error("Microphone access denied", err);
        alert("Please allow microphone access to talk with Alexa.");
      }
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20`}
        aria-label="Open Alexa Concierge"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-primary animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-[90vw] md:w-[400px] h-[550px] bg-navy/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-white/10 flex flex-col overflow-hidden transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-primary/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-xs">AX</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">ALEXA</h3>
              <p className="text-primary/70 text-[10px] font-medium uppercase tracking-widest leading-tight">
                {lang === 'ar' ? 'الكونسيرج المصري الفاخر' : 'Native Egyptian Concierge'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            <button onClick={toggleChat} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        >
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
          {/* Voice Mode Call to Action (Microphone) */}
          <div className="flex justify-center -mt-8 mb-2">
            <button
              onClick={toggleListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isListening 
                  ? 'bg-red-500 text-white scale-110 animate-pulse ring-4 ring-red-500/20' 
                  : 'bg-primary text-white hover:scale-105 active:scale-95'
              }`}
              title={isListening ? "Stop Listening" : "Talk to Alexa"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={lang === 'ar' ? 'اسأل أليكسا شيئاً...' : 'Ask Alexa anything...'}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button 
              type="submit"
              disabled={!input || isLoading}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-[9px] text-center text-white/30 font-medium uppercase tracking-tighter">
            {lang === 'ar' ? 'أليكسا متصلة بـ Gemini 2.0 Flash' : 'Alexa powered by Gemini 2.0 Flash'}
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}
