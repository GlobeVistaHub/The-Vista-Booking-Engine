import { requireAdmin } from "@/utils/admin-auth";
import { getSiteContentAction, getServicesAction } from "@/app/actions/cms";
import CMSForm from "@/components/admin/cms/CMSForm";

export const metadata = {
  title: "CMS Manager - Auto-Bath OS",
};

export default async function CMSManagerPage() {
  // 1. Strict Auth Check
  await requireAdmin();

  // 2. Fetch all editable data
  const [contentRes, servicesRes] = await Promise.all([
    getSiteContentAction(),
    getServicesAction()
  ]);

  const initialContent = contentRes.success ? contentRes.content : {};
  const initialServices = servicesRes.success ? servicesRes.services : [];

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">CMS Manager</h1>
          <p className="text-white/50 text-sm">Strictly control the content, pricing, and links visible on the customer-facing website.</p>
        </header>

        <CMSForm initialContent={initialContent} initialServices={initialServices} />
      </div>
    </main>
  );
}
