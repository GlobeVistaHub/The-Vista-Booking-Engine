"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Mic, Volume2, VolumeX, Keyboard, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AlexaConcierge() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micLang, setMicLang] = useState<'ar-EG' | 'en-US'>('ar-EG');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true); // User can mute/unmute audio
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Refs to track latest state for the audio onended callback
  const isVoiceModeRef = useRef(isVoiceMode);
  const isOpenRef = useRef(isOpen);
  const isSpeechEnabledRef = useRef(isSpeechEnabled);

  useEffect(() => { isVoiceModeRef.current = isVoiceMode; }, [isVoiceMode]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { isSpeechEnabledRef.current = isSpeechEnabled; }, [isSpeechEnabled]);

  // Function to play ElevenLabs speech
  const playSpeech = async (text: string) => {
    // If the user muted the speaker, do not fetch audio
    if (!isSpeechEnabledRef.current) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setIsSpeaking(true);
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('ElevenLabs speech generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Playback interrupted or failed:", error);
            setIsSpeaking(false);
          });
        }

        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          // AUTO-LISTEN REMOVED: To stop the mic flickering/auto-switching.
        };
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { isVoiceMode: isVoiceMode },
    initialMessages: [],
    onFinish: (message) => {
      if (message.role === 'assistant') {
        // ONLY speak out loud if the Voice Orb is active!
        if (isVoiceModeRef.current) {
          playSpeech(message.content);
        }
      }
    },
    onError: (err) => {
      console.warn("Chat error:", err);
    }
  });

  // Browser Native Speech Recognition
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = micLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      append({ role: 'user', content: transcript });
    };
    recognition.onerror = (event: any) => {
      console.warn("Speech Recognition Error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsVoiceMode(false);
      if (audioRef.current) audioRef.current.pause();
      setIsSpeaking(false);
      setIsListening(false);
    }
    setIsOpen(!isOpen);
  };

  const switchToVoiceMode = () => setIsVoiceMode(true);
  
  const switchToTextMode = () => {
    setIsVoiceMode(false);
    if (audioRef.current) audioRef.current.pause();
    setIsSpeaking(false);
    setIsListening(false);
  };

  const switchListeningState = () => {
    if (isListening || isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsSpeaking(false);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      startListening();
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

      <audio ref={audioRef} className="hidden" />

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
                {lang === 'ar' ? 'الكونسيرج الفاخر' : 'Luxury Concierge'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isVoiceMode ? (
              <button onClick={switchToTextMode} className="p-2 text-white/40 hover:text-white transition-colors" title="Switch to Text">
                <Keyboard className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={switchToVoiceMode} className="p-2 text-white/40 hover:text-white transition-colors animate-pulse" title="Switch to Voice">
                <Mic className="w-5 h-5 text-emerald-400" />
              </button>
            )}
            <button onClick={toggleChat} className="p-2 text-white/40 hover:text-white transition-colors ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isVoiceMode ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent transition-opacity duration-1000 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`} />
            
            <div className="relative z-10 w-64 h-64 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
                isListening ? 'bg-rose-500/25 scale-110' : 
                isSpeaking ? 'bg-emerald-400/35 scale-125' : 'bg-primary/15 scale-90'
              }`} />
              
              <button
                onClick={switchListeningState}
                className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-4 backdrop-blur-md ${
                  isListening 
                    ? 'bg-rose-500/95 border-rose-400 text-white shadow-rose-500/50' 
                    : isSpeaking 
                      ? 'bg-emerald-500/95 border-emerald-400 text-white shadow-emerald-500/50'
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

            <div className="z-10 text-center">
              {isListening && (
                <div className="flex items-center justify-center gap-2 text-rose-300 text-sm animate-pulse">
                  <span>{lang === 'ar' ? 'أليكسا تستمع إليك مباشرة' : 'Live connection active'}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth"
              style={{ overflowAnchor: 'auto' }}
            >
              {messages.filter(m => m.content && m.content.trim() !== "").map((m) => {
                const isUser = m.role === 'user';
                // Detect if the message content contains Arabic characters for proper RTL rendering
                const containsArabic = /[\u0600-\u06FF]/.test(m.content);
                
                return (
                  <div 
                    key={m.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div 
                      dir={containsArabic ? 'rtl' : 'ltr'}
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm text-start ${
                        isUser 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                )
              })}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 min-w-[60px] h-[38px] flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce[animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); if (input) handleSubmit(e); }}
                className="flex items-center gap-2"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={lang === 'ar' ? 'اسأل أليكسا شيئاً...' : 'Ask Alexa anything...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input}
                  className={`w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`}
                >
                  <Send className="w-4 h-4 relative right-0.5" />
                </button>
              </form>
              <div className="flex items-center justify-center gap-3 mt-3">
                <p className="text-[9px] text-white/30 font-medium uppercase tracking-tighter">
                  {lang === 'ar' ? 'أليكسا متصلة بالذكاء الاصطناعي' : 'Alexa powered by AI Voice Engine'}
                </p>
                <div className="flex items-center bg-white/5 rounded-full px-2 py-0.5 border border-white/5">
                  <button 
                    onClick={() => setMicLang('ar-EG')}
                    className={`text-[8px] font-bold px-1.5 transition-colors ${micLang === 'ar-EG' ? 'text-emerald-400' : 'text-white/20'}`}
                  >
                    AR
                  </button>
                  <div className="w-[1px] h-2 bg-white/10" />
                  <button 
                    onClick={() => setMicLang('en-US')}
                    className={`text-[8px] font-bold px-1.5 transition-colors ${micLang === 'en-US' ? 'text-emerald-400' : 'text-white/20'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
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