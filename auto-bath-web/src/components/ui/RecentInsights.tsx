import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function RecentInsights({ insights }: { insights: any[] }) {
  if (!insights || insights.length === 0) return null;

  // Take the 3 most recent
  const recent = insights.slice(0, 3);

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-white tracking-tighter uppercase mb-4">
              Detailing <span className="text-electric-cyan">Insights</span>
            </h2>
            <p className="text-white/50 font-sans max-w-xl">
              Professional techniques, maintenance guides, and inside looks at our concourse-level restoration process.
            </p>
          </div>
          
          <Link 
            href="/insights" 
            className="group flex items-center gap-3 text-cyber-orange hover:text-white font-bold uppercase tracking-widest text-sm transition-colors whitespace-nowrap"
          >
            View All Articles 
            <span className="w-8 h-8 rounded-full border border-cyber-orange/30 group-hover:border-white/30 flex items-center justify-center transition-colors">
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recent.map((post) => (
            <Link 
              href={`/insights/${post.slug}`} 
              key={post.id}
              className="group relative flex flex-col bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,194,212,0.15)] transition-all duration-500 will-change-transform hover:-translate-y-2"
            >
              <div className="relative h-56 w-full overflow-hidden bg-black">
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
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              
              <div className="p-6 md:p-8 pt-4 flex flex-col flex-grow relative z-10 bg-[#111]">
                <div className="flex items-center gap-2 text-cyber-orange text-sm font-mono font-bold uppercase tracking-widest mb-3">
                  <Calendar size={16} />
                  {new Date(post.created_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-cyan transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-white/60 text-sm mb-6 flex-grow line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest group-hover:text-electric-cyan group-hover:translate-x-2 transition-all duration-300 mt-auto">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
