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
  const lastInputWasVoiceRef = useRef(false);
  
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
        content: lang === 'ar' 
          ? "أهلاً 🌟 أنا أليكسا، كونسيرجك الشخصي في ذا فيستا. كيف أقدر أساعدك؟" 
          : "Welcome 🌟 I'm Alexa, your personal concierge at The Vista. How may I help you today?"
      }
    ],
    onFinish: (message) => {
      // Auto-speak ONLY if the user used the microphone for their last message
      if (lastInputWasVoiceRef.current) {
        speakMessage(message.content);
      }
    },
    onError: (err) => {
      console.error("Chat error:", err);
      alert(lang === 'ar' ? 'فشل الاتصال. يرجى المحاولة لاحقاً.' : 'Connection failed. Please try again shortly.');
    }
  });

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Speak a specific message ONLY when user clicks the speaker icon
  const speakMessage = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // 1. Strip Markdown, Emojis, and weird punctuation that makes TTS sound robotic
    const cleanText = text
      .replace(/[\*\#\_\[\]\(\)]/g, '') // remove markdown symbols
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') // remove emojis
      .replace(/\?/g, '.'); // Convert question marks to periods to avoid the weird rising intonation bug
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // 2. Try to find the BEST female Arabic voice (Prioritize Google's cloud voices over OS default)
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = 
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('ar')) ||
      voices.find(v => v.lang.startsWith('ar') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('ar')) ||
      voices.find(v => v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google UK English Female')) ||
      null;
    
    if (bestVoice) utterance.voice = bestVoice;
    utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    utterance.pitch = 1.15;
    utterance.rate = 0.95;
    
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input: transcribes speech and sends as text
  const toggleListening = () => {
    if (isListening) { setIsListening(false); return; }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input not supported. Try Chrome."); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setIsListening(false);
      lastInputWasVoiceRef.current = true; // Mark as voice input
      append({ role: 'user', content: event.results[0][0].transcript });
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    recognition.start();
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
              <div className="relative group max-w-[85%]">
                <div 
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                      : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
                {/* Speaker button — only on Alexa messages, shown on hover */}
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.content)}
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Hear Alexa speak this"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
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
              {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <form 
            onSubmit={(e) => {
              lastInputWasVoiceRef.current = false; // Keyboard input, don't auto-speak
              handleSubmit(e);
            }}
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
              disabled={!input || isLoading || isListening}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-[9px] text-center text-white/30 font-medium uppercase tracking-tighter">
            {lang === 'ar' ? 'أليكسا متصلة بـ Gemini 3.1 Pro' : 'Alexa powered by Gemini 3.1 Pro'}
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
