"use client";

import { motion } from "framer-motion";

export function CodeSnippet({ code, language, title }: { code: string; language: string; title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_40px_rgba(0,194,212,0.1)] group relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/10 rounded-full blur-[50px] group-hover:bg-electric-cyan/20 transition-colors pointer-events-none" />
      
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#df1b41]/50" />
            <div className="w-3 h-3 rounded-full bg-cyber-orange/50" />
            <div className="w-3 h-3 rounded-full bg-[#25D366]/50" />
          </div>
          <span className="ml-2 text-xs font-mono text-white/50">{title}</span>
        </div>
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{language}</span>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-white/80 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
}
