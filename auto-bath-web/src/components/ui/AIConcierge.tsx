"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, Bot, MessageCircle, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const FALLBACK_REPLY = "Apologies, I'm having trouble connecting right now. Please try again in a moment, or message us directly on WhatsApp.";

export default function AIConcierge() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [waPhone, setWaPhone] = useState("61400764508");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    const history = [...messages, userMsg];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    const updateReply = (content: string) =>
      setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content } : m)));

    const MIN_TYPING_MS = 1000;
    const startedAt = Date.now();
    let fullText = "";
    let shown = 0;
    let streamDone = false;

    // Reveals buffered text at a human pace (faster when the backlog grows)
    const typer = new Promise<void>(resolve => {
      const tick = setInterval(() => {
        if (Date.now() - startedAt >= MIN_TYPING_MS && shown < fullText.length) {
          shown = Math.min(fullText.length, shown + Math.max(2, Math.ceil((fullText.length - shown) / 30)));
          updateReply(fullText.slice(0, shown));
        }
        if (streamDone && shown >= fullText.length && Date.now() - startedAt >= MIN_TYPING_MS) {
          clearInterval(tick);
          resolve();
        }
      }, 25);
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) throw new Error(`Chat request failed (${res.status})`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
      if (!fullText.trim()) fullText = FALLBACK_REPLY;
    } catch (err) {
      console.error("AI Concierge error:", err);
      fullText = FALLBACK_REPLY;
    } finally {
      streamDone = true;
      await typer;
      setIsLoading(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    import("@/app/actions/cms").then(m => {
      m.getSiteContentAction().then(res => {
        if (res.success && res.content && res.content['contact_phone']) {
          const rawPhone = res.content['contact_phone'].replace(/[^0-9]/g, '');
          setWaPhone(rawPhone.startsWith('0') ? `61${rawPhone.substring(1)}` : rawPhone);
        }
      });
    });
  }, []);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isDrawerOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen, isMobile]);

  useEffect(() => {
    (window as any).openAIConcierge = () => setIsDrawerOpen(true);
    return () => { delete (window as any).openAIConcierge; };
  }, []);

  return (
    <>
      {/* DESKTOP FLOATING MULTI-ACTION MENU (Hidden on Mobile) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        
        {/* Popover Menu */}
        {isPopoverOpen && !isDrawerOpen && (
          <div className="absolute bottom-20 right-0 w-64 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex flex-col gap-2 shadow-[0_0_40px_rgba(0,194,212,0.15)] animate-in slide-in-from-bottom-5 fade-in">
            <h4 className="text-white/50 text-xs font-heading font-bold uppercase tracking-widest text-center my-2">How can we help?</h4>
            
            <button 
              onClick={() => { setIsPopoverOpen(false); setIsDrawerOpen(true); }}
              className="w-full py-4 bg-white/5 hover:bg-electric-cyan hover:text-black rounded-2xl flex items-center justify-center gap-3 transition-colors text-white group"
            >
              <Sparkles size={18} className="text-electric-cyan group-hover:text-black" />
              <span className="text-xs font-bold uppercase tracking-widest">Ask AI Concierge</span>
            </button>
            
            <a 
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-white/5 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-colors text-white group"
            >
              <MessageCircle size={18} className="text-[#25D366] group-hover:text-white" />
              <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
            </a>
          </div>
        )}

        {/* Main Floating Button */}
        <button 
          onClick={() => isDrawerOpen ? setIsDrawerOpen(false) : setIsPopoverOpen(!isPopoverOpen)}
          className={`bg-[#050505]/80 backdrop-blur-md border border-white/10 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,194,212,0.15)] hover:shadow-[0_0_40px_rgba(0,194,212,0.4)] hover:border-electric-cyan hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 group relative ${isDrawerOpen ? 'bg-electric-cyan/20 border-electric-cyan' : ''}`}
          aria-label="Concierge Menu"
        >
          {isDrawerOpen || isPopoverOpen ? (
            <X size={24} className="text-white group-hover:text-electric-cyan transition-colors" />
          ) : (
            <Sparkles size={24} className="text-electric-cyan group-hover:text-white transition-colors" />
          )}
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full blur-md -z-10 transition-colors ${isDrawerOpen || isPopoverOpen ? 'bg-white/10' : 'bg-electric-cyan/20 group-hover:bg-electric-cyan/40'}`} />
        </button>
      </div>

      {/* OVERLAY & INTERFACE */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex md:justify-end">
          
          {/* BACKDROP: Full screen blur on mobile, subtle fade on desktop */}
          <div 
            className={`absolute inset-0 bg-[#050505]/80 transition-opacity duration-500 ${isMobile ? 'backdrop-blur-xl' : 'backdrop-blur-sm bg-transparent'}`}
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* CHAT INTERFACE */}
          <div className={`relative w-full h-full md:h-[calc(100vh-48px)] md:w-[400px] md:my-6 md:mr-28 bg-[#050505] md:bg-[#050505]/90 md:backdrop-blur-2xl border-white/10 md:border md:rounded-3xl shadow-[0_0_50px_rgba(0,194,212,0.1)] flex flex-col overflow-hidden animate-in ${isMobile ? 'fade-in zoom-in-95' : 'slide-in-from-right-8'}`}>
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center">
                  <Bot size={20} className="text-electric-cyan" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-bold uppercase tracking-widest text-sm">AI Concierge</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
                    <span className="text-[10px] font-mono text-electric-cyan/70 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar flex flex-col relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Sparkles size={120} />
              </div>
              
              {/* Initial Greeting */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-electric-cyan" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-white/80 font-sans leading-relaxed backdrop-blur-sm max-w-[85%] relative z-10">
                  Hello! I'm the Auto-Bath AI Concierge. Whether you need help choosing the right detailing package, or want to know more about our ceramic coatings, I'm here to assist you.
                </div>
              </div>

              {/* Dynamic Messages */}
              {messages.filter(m => m.content !== "").map(m => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${m.role === 'user' ? 'bg-cyber-orange/10 border border-cyber-orange/20' : 'bg-electric-cyan/10 border border-electric-cyan/20'}`}>
                    {m.role === 'user' ? (
                      <User size={14} className="text-cyber-orange" />
                    ) : (
                      <Bot size={14} className="text-electric-cyan" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 text-sm font-sans leading-relaxed backdrop-blur-sm max-w-[85%] relative z-10 ${m.role === 'user' ? 'bg-cyber-orange text-black rounded-tr-sm' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm'}`}>
                    {m.role === 'user' ? m.content : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-electric-cyan underline">{children}</a>,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-electric-cyan" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5 relative z-10" aria-label="Concierge is typing">
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="w-1.5 h-1.5 rounded-full bg-electric-cyan/70 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
              <form className="relative flex items-center" onSubmit={handleSubmit}>
                <input 
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about our services..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-electric-cyan text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="text-center mt-3">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Powered by Google Gemini</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
