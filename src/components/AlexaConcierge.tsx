"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Mic, Volume2, Keyboard, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GeminiLiveClient } from '@/lib/gemini-live-client';

export default function AlexaConcierge() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const liveClientRef = useRef<GeminiLiveClient | null>(null);
  const initialGreeting = "Hi, how is everything going? Alexa is with you, how can I help you today?"; 

  // Initialize Gemini Live Client
  useEffect(() => {
    liveClientRef.current = new GeminiLiveClient();
    liveClientRef.current.onStateChange = (state) => {
      if (state === 'listening') {
        setIsListening(true);
        setIsSpeaking(false);
      } else if (state === 'speaking') {
        setIsSpeaking(true);
        setIsListening(false);
      } else {
        setIsListening(false);
        setIsSpeaking(false);
      }
    };
    
    liveClientRef.current.onError = (err) => {
      console.error("Voice Error caught in UI:", err);
      alert(lang === 'ar' ? `خطأ في الصوت: ${err}` : `Voice Error: ${err}`);
      setIsListening(false);
      setIsSpeaking(false);
    };
    
    return () => {
      liveClientRef.current?.disconnect();
    };
  }, [lang]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { isVoiceMode: false }, // Text mode only for useChat now
    initialMessages: initialGreeting ? [
      {
        id: 'welcome',
        role: 'assistant',
        content: initialGreeting
      }
    ] : [],
    onError: (err) => {
      console.warn("Chat error:", err);
    }
  });

  const toggleChat = () => {
    if (isOpen) {
      liveClientRef.current?.disconnect();
      setIsVoiceMode(false);
    }
    setIsOpen(!isOpen);
  };

  const switchToVoiceMode = () => {
    setIsVoiceMode(true);
  };

  const switchToTextMode = () => {
    setIsVoiceMode(false);
    liveClientRef.current?.disconnect();
  };

  const switchListeningState = () => {
    if (isListening || isSpeaking) {
      liveClientRef.current?.disconnect();
    } else {
      liveClientRef.current?.connect();
    }
  };

  useEffect(() => {
    if (scrollRef.current && !isVoiceMode) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isVoiceMode]);

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20`}
        aria-label="Toggle Alexa Concierge"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-primary animate-pulse" />
          </div>
        )}
      </button>

      {/* Main Window */}
      <div 
        className={`fixed bottom-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[99999] w-[90vw] md:w-[400px] h-[550px] bg-navy/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-white/20 flex flex-col overflow-hidden ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-primary/10 border-b border-white/10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-xs">AX</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">ALEXA</h3>
              <p className="text-primary/70 text-[10px] font-medium uppercase tracking-widest leading-tight">
                {lang === 'ar' ? 'الكونسيرج الفاخر (تجريبي)' : 'Luxury Concierge (Beta)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            {isVoiceMode ? (
              <button onClick={switchToTextMode} className="text-white/40 hover:text-white transition-colors" title="Switch to Text">
                <Keyboard className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={switchToVoiceMode} className="text-white/40 hover:text-white transition-colors animate-pulse" title="Switch to Voice">
                <Mic className="w-5 h-5 text-emerald-400" />
              </button>
            )}
            <button onClick={toggleChat} className="text-white/40 hover:text-white transition-colors ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Body: Voice Orb vs Text Messages */}
        {isVoiceMode ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent transition-opacity duration-1000 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`} />
            
            {/* The Voice Orb Core */}
            <div className="relative z-10 w-48 h-48 flex items-center justify-center">
              {/* Refined Glowing Aura - No Jitter */}
              <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
                isListening ? 'bg-rose-500/20 scale-110' : 
                isSpeaking ? 'bg-emerald-400/30 scale-125' : 'bg-primary/10 scale-90'
              }`} />
              
              <button
                onClick={switchListeningState}
                className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-4 backdrop-blur-md ${
                  isListening 
                    ? 'bg-rose-500/90 border-rose-400 text-white shadow-rose-500/40' 
                    : isSpeaking 
                      ? 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/40'
                      : 'bg-primary border-primary/50 text-white hover:bg-primary-dark cursor-pointer'
                }`}
              >
                {isListening ? (
                  <>
                     <Mic className="w-10 h-10 mb-2 animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest">{lang === 'ar' ? 'تستمع' : 'Listening'}</span>
                  </>
                ) : isSpeaking ? (
                  <>
                     <Volume2 className="w-10 h-10 mb-2 animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest">{lang === 'ar' ? 'تتحدث' : 'Speaking'}</span>
                  </>
                ) : (
                  <>
                     <Mic className="w-10 h-10 mb-2" />
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{lang === 'ar' ? 'اضغط للتحدث' : 'Tap to connect'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Text overlay */}
            <div className="z-10 text-center">
              {isListening && (
                <div className="flex items-center justify-center gap-2 text-rose-300 text-sm animate-pulse">
                  <span>{lang === 'ar' ? 'أليكسا تستمع إليك مباشرة' : 'Live connection active'}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Text Messages Area */
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth"
              style={{ overflowAnchor: 'auto' }}
            >
              {messages.filter(m => m.content && m.content.trim() !== "").map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 min-w-[60px] h-[38px] flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); if (input) handleSubmit(e); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={lang === 'ar' ? 'اسأل أليكسا شيئاً' : 'Ask Alexa anything'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input || (Date.now() - lastRequestTime < 1000)}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[9px] text-center text-white/30 font-medium uppercase tracking-tighter mt-3">
                {lang === 'ar' ? 'أليكسا متصلة بالذكاء الاصطناعي' : 'Alexa powered by AI Voice Engine'}
              </p>
            </div>
          </div>
        )}
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
