import { requireAdmin } from "@/utils/admin-auth";
import { getInsightsAction } from "@/app/actions/insights";
import InsightsClient from "@/components/admin/insights/InsightsClient";

export const metadata = {
  title: "Insights Editor - Auto-Bath OS",
};

export default async function InsightsManagerPage() {
  await requireAdmin();

  // Fetch all insights including drafts
  const res = await getInsightsAction(true);
  const insights = res.success ? res.insights : [];

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Detailing Insights</h1>
          <p className="text-white/50 text-sm">Write, edit, and publish SEO-optimized articles to position yourself as the premium authority in Melbourne.</p>
        </header>

        <InsightsClient initialInsights={insights} />
      </div>
    </main>
  );
}
