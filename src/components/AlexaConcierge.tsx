"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Keyboard, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AlexaConcierge() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const recognitionRef = React.useRef<any>(null);
  
  const initialGreeting = lang === 'ar' 
    ? "أهلاً بك في ذا فيستا أنا أليكسا، مساعدتك الشخصية الفاخرة كيف يمكنني مساعدتك في التخطيط لرحلتك القادمة في مصر اليوم؟" 
    : "Welcome to The Vista. I am Alexa, your luxury concierge. How may I assist you with your travel plans in Egypt today?";

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (lang === 'ar') {
      selectedVoice = voices.find(v => v.lang.includes('ar')) || voices[0];
    } else {
      selectedVoice = voices.find(v => v.name.includes('Premium') && v.lang.includes('en')) || 
                      voices.find(v => v.lang === 'en-GB') || 
                      voices.find(v => v.lang === 'en-US') || voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-GB';
    utterance.rate = 0.95; // Elegant, slightly slower pacing
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: initialGreeting
      }
    ],
    onFinish: (message) => {
      if (isVoiceMode) {
        speakText(message.content);
      }
    },
    onError: (err) => {
      console.error("Chat error:", err);
      const errorMsg = lang === 'ar' 
        ? "عذراً، أواجه صعوبة بسيطة في الاتصال حالياً هل يمكنك المحاولة مرة أخرى؟" 
        : "I'm sorry, I'm having a bit of trouble connecting right now. Could you try again?";
        
      append({
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMsg
      });
      
      if (isVoiceMode) {
        speakText(errorMsg);
      }
    }
  });

  // Init browser Speech Recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            append({
              id: Date.now().toString(),
              role: 'user',
              content: transcript
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
      
      // Load voices
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
           window.speechSynthesis.getVoices();
        };
      }
    }
  }, [append]);

  const toggleChat = () => {
    if (isOpen) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (isListening && recognitionRef.current) {
         recognitionRef.current.stop();
      }
    } else {
      // When opening, reset to text mode by default unless specified
      setIsVoiceMode(false);
    }
    setIsOpen(!isOpen);
  };

  const switchToVoiceMode = () => {
    setIsVoiceMode(true);
    // If they haven't spoken yet, maybe repeat the greeting or last message?
    if (messages.length > 0) {
      speakText(messages[messages.length - 1].content);
    }
  };

  const switchToTextMode = () => {
    setIsVoiceMode(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
    }
  };

  const switchListeningState = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
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
        className={`fixed bottom-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-[90vw] md:w-[400px] h-[550px] bg-navy/95 backdrop-blur-xl rounded-2xl shadow-luxury border flex flex-col overflow-hidden transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 opacity-100 scale-100 border-white/10' : 'translate-y-10 opacity-0 scale-95 pointer-events-none border-transparent'
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
            <div className="relative z-10">
              <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                isListening ? 'bg-red-500/30 scale-150 animate-pulse' : 
                isSpeaking ? 'bg-emerald-400/40 scale-125 animate-ping' : 'bg-primary/20 scale-100'
              }`} />
              
              <button
                onClick={switchListeningState}
                className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-4 backdrop-blur-md ${
                  isListening 
                    ? 'bg-red-500/90 border-red-400 text-white scale-105' 
                    : isSpeaking 
                      ? 'bg-emerald-500/90 border-emerald-400 text-white scale-110'
                      : 'bg-primary border-primary/50 text-white hover:scale-105 hover:bg-primary-dark cursor-pointer'
                }`}
              >
                {isListening ? (
                  <>
                     <Mic className="w-10 h-10 mb-2 animate-bounce" />
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
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{lang === 'ar' ? 'اضغط للتحدث' : 'Tap to speak'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Text overlay */}
            <div className="z-10 text-center">
              {isLoading && !isSpeaking && (
                <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ar' ? 'أليكسا تفكر' : 'Alexa is thinking'}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Text Messages Area */
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
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
                  disabled={!input || isLoading}
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
