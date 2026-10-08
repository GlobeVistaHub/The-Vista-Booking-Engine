import { getInsightsAction } from "@/app/actions/insights";
import { getSiteContentAction } from "@/app/actions/cms";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Detailing Insights | Auto-Bath",
  description: "Expert tips, techniques, and news from Melbourne's premier luxury auto detailing facility.",
};

export default async function InsightsPage() {
  const [contentRes, insightsRes] = await Promise.all([
    getSiteContentAction(),
    getInsightsAction(false) // Only published
  ]);
  
  const content = contentRes.success ? contentRes.content : {};
  const insights = insightsRes.success ? insightsRes.insights : [];

  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden flex flex-col">
      <Navbar dynamicContent={content} />
      
      <div className="flex-grow pt-32 pb-24 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter uppercase mb-6">
              Detailing <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-cyber-orange">Insights</span>
            </h1>
            <p className="text-white/50 text-sm md:text-lg max-w-2xl font-sans">
              Expert tips, techniques, and industry news from Melbourne's premier luxury auto detailing facility. Elevate your automotive care knowledge.
            </p>
          </header>

          {insights.length === 0 ? (
            <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md">
              <p className="text-white/40 font-mono">No insights published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insights.map((post) => (
                <Link 
                  href={`/insights/${post.slug}`} 
                  key={post.id}
                  className="group relative flex flex-col bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,194,212,0.15)] transition-all duration-500 will-change-transform hover:-translate-y-2"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-black">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-6 md:p-8 pt-4 flex flex-col flex-grow relative z-10 bg-[#111]">
                    <div className="flex items-center gap-2 text-cyber-orange text-sm font-mono font-bold uppercase tracking-widest mb-3">
                      <Calendar size={16} />
                      {new Date(post.created_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-electric-cyan transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-white/60 text-sm mb-8 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-electric-cyan text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                      Read Insight <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer dynamicContent={content} />
    </main>
  );
}
