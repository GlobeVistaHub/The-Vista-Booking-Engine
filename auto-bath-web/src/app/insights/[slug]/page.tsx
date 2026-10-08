import { getInsightBySlugAction, getInsightsAction } from "@/app/actions/insights";
import { getSiteContentAction } from "@/app/actions/cms";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import ReactMarkdown from 'react-markdown';
import ShareButtons from "@/components/ui/ShareButtons";

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js dynamic SEO generation
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await getInsightBySlugAction(resolvedParams.slug, false);
  
  if (!res.success || !res.insight) {
    return { title: 'Not Found | Auto-Bath' };
  }

  const { title, excerpt, cover_image } = res.insight;

  return {
    title: `${title} | Detailing Insights | Auto-Bath`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: cover_image ? [
        {
          url: cover_image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: excerpt,
      images: cover_image ? [cover_image] : [],
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const resolvedParams = await params;
  
  const [contentRes, insightRes, allInsightsRes] = await Promise.all([
    getSiteContentAction(),
    getInsightBySlugAction(resolvedParams.slug, false),
    getInsightsAction(false)
  ]);
  
  if (!insightRes.success || !insightRes.insight) {
    notFound();
  }

  const content = contentRes.success ? contentRes.content : {};
  const post = insightRes.insight;
  const allInsights = allInsightsRes.success ? allInsightsRes.insights : [];
  
  const currentIndex = allInsights.findIndex((i: any) => i.slug === post.slug);
  const nextPost = currentIndex > 0 ? allInsights[currentIndex - 1] : null;
  const prevPost = currentIndex < allInsights.length - 1 ? allInsights[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden flex flex-col">
      <Navbar dynamicContent={content} />
      
      <article className="flex-grow pt-24 md:pt-32 pb-24 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/insights" className="inline-flex items-center gap-2 text-white/50 hover:text-electric-cyan transition-colors mb-10 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Insights
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 text-cyber-orange text-sm font-mono font-bold uppercase tracking-widest mb-6">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <h1 className="font-heading font-black text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter uppercase leading-tight mb-8">
              {post.title}
            </h1>
          </header>

          {post.cover_image && (
            <div className="w-full h-64 md:h-[500px] rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-[0_0_50px_rgba(0,194,212,0.1)]">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-electric-cyan hover:prose-a:text-white transition-colors prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
            {/* Simple Markdown Rendering */}
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <ShareButtons title={post.title} />

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-8">
            {prevPost ? (
              <Link href={`/insights/${prevPost.slug}`} className="group flex flex-col items-start text-left flex-1">
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-electric-cyan transition-colors">← Previous Article</span>
                <span className="text-white font-bold text-lg group-hover:text-electric-cyan transition-colors line-clamp-2">{prevPost.title}</span>
              </Link>
            ) : <div className="flex-1" />}
            
            {nextPost ? (
              <Link href={`/insights/${nextPost.slug}`} className="group flex flex-col items-end text-right flex-1">
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-electric-cyan transition-colors">Next Article →</span>
                <span className="text-white font-bold text-lg group-hover:text-electric-cyan transition-colors line-clamp-2">{nextPost.title}</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>

          <div className="mt-16 text-center">
            <Link href="/insights" className="inline-flex items-center justify-center bg-[#111] hover:bg-[#1a1a1a] border border-white/10 hover:border-electric-cyan/50 px-8 py-4 rounded text-white text-sm font-bold uppercase tracking-widest transition-all duration-300">
              View All Insights
            </Link>
          </div>

        </div>
      </article>

      <Footer dynamicContent={content} />
    </main>
  );
}


