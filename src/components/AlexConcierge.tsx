"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Bot, User, Mic, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AlexConcierge() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: lang === 'ar' 
          ? "أهلاً بك في ذا فيستا. أنا أليكس، مساعدك الشخصي الفاخر. كيف يمكنني مساعدتك في التخطيط لرحلتك القادمة اليوم؟" 
          : "Welcome to The Vista. I am Alex, your luxury concierge. How may I assist you with your travel plans today?"
      }
    ]
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20`}
        aria-label="Open Concierge"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60] w-[90vw] md:w-[400px] h-[500px] bg-navy/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-white/10 flex flex-col overflow-hidden transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-primary/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">ALEX</h3>
              <p className="text-primary/70 text-[10px] font-medium uppercase tracking-widest leading-tight">
                {lang === 'ar' ? 'الكونسيرج الفاخر' : 'Luxury Concierge'}
              </p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        >
          {messages.map((m: any) => (
            <div 
              key={m.id} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
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
            <div className="flex justify-start">
              <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={lang === 'ar' ? 'اسأل أليكس...' : 'Ask Alex...'}
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
