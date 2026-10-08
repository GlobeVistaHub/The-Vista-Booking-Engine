"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div className="flex items-center gap-4 py-8 border-t border-b border-white/10 my-12">
      <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Share Insight</span>
      <div className="flex gap-2">
        <button 
          onClick={handleShare}
          className="p-3 bg-white/5 hover:bg-electric-cyan/20 text-white hover:text-electric-cyan rounded-full transition-colors relative"
          title="Share Mobile"
        >
          <Share2 size={18} />
        </button>

        <button 
          onClick={handleCopy}
          className="p-3 bg-white/5 hover:bg-electric-cyan/20 text-white hover:text-electric-cyan rounded-full transition-colors relative"
          title="Copy Link"
        >
          <LinkIcon size={18} />
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#00C2D4] text-[#050505] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </button>

        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white/5 hover:bg-blue-500/20 text-white hover:text-blue-500 rounded-full transition-colors"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>

        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Share on X"
        >
          <TwitterIcon />
        </a>
      </div>
    </div>
  );
}
