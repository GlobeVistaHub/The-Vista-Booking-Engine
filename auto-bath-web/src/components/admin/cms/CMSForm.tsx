"use client";

import { useState } from "react";
import { updateSiteContentAction, updateServicePriceAction } from "@/app/actions/cms";
import { formatPrice } from "@/lib/schedule";
import { createClient } from "@/utils/supabase/client";

interface CMSFormProps {
  initialContent: Record<string, string>;
  initialServices: any[];
}

export default function CMSForm({ initialContent, initialServices }: CMSFormProps) {
  const [activeTab, setActiveTab] = useState<"content" | "pricing" | "media" | "seo">("content");
  
  // Content State
  const [content, setContent] = useState(initialContent);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentStatus, setContentStatus] = useState("");

  // Pricing State
  const [services, setServices] = useState(initialServices);
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);

  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    setContentStatus("");
    
    const res = await updateSiteContentAction(content);
    
    if (res.success) {
      setContentStatus("Saved successfully!");
      setTimeout(() => setContentStatus(""), 3000);
    } else {
      setContentStatus("Failed to save.");
    }
    
    setIsSavingContent(false);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setContentStatus(`Uploading image...`);
    setIsSavingContent(true);

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${key}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('public-assets')
      .upload(fileName, file);

    if (error) {
      setContentStatus(`Upload failed: ${error.message}`);
      setIsSavingContent(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('public-assets')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Immediately save it to the DB so it persists
    const res = await updateSiteContentAction({ ...content, [key]: publicUrl });
    if (res.success) {
      setContent(prev => ({ ...prev, [key]: publicUrl }));
      setContentStatus(`Image uploaded successfully!`);
    } else {
      setContentStatus("Failed to save URL.");
    }
    
    setIsSavingContent(false);
    setTimeout(() => setContentStatus(""), 3000);
  };

  const handleSavePrice = async (id: string, newPriceCents: number) => {
    setSavingServiceId(id);
    const res = await updateServicePriceAction(id, newPriceCents);
    
    if (res.success) {
      // update local state
      setServices(prev => prev.map(s => s.id === id ? { ...s, base_price: newPriceCents } : s));
    } else {
      alert("Failed to update price.");
    }
    setSavingServiceId(null);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab("content")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'content' ? 'text-[#00C2D4] border-b-2 border-[#00C2D4]' : 'text-white/50 hover:text-white'}`}
        >
          Site Content
        </button>
        <button 
          onClick={() => setActiveTab("pricing")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'pricing' ? 'text-[#00C2D4] border-b-2 border-[#00C2D4]' : 'text-white/50 hover:text-white'}`}
        >
          Service Pricing
        </button>
        <button 
          onClick={() => setActiveTab("media")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'media' ? 'text-[#00C2D4] border-b-2 border-[#00C2D4]' : 'text-white/50 hover:text-white'}`}
        >
          Media & Assets
        </button>
        <button 
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'seo' ? 'text-[#00C2D4] border-b-2 border-[#00C2D4]' : 'text-white/50 hover:text-white'}`}
        >
          SEO & Tracking
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "content" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <section>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Main Headline</label>
                  <input 
                    type="text" 
                    value={content['hero_headline'] || ''} 
                    onChange={e => handleContentChange('hero_headline', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Subheadline</label>
                  <textarea 
                    rows={2}
                    value={content['hero_subheadline'] || ''} 
                    onChange={e => handleContentChange('hero_subheadline', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Contact & Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email Address</label>
                  <input 
                    type="text" 
                    value={content['contact_email'] || ''} 
                    onChange={e => handleContentChange('contact_email', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={content['contact_phone'] || ''} 
                    onChange={e => handleContentChange('contact_phone', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Instagram URL</label>
                  <input 
                    type="text" 
                    value={content['social_instagram'] || ''} 
                    onChange={e => handleContentChange('social_instagram', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Facebook URL</label>
                  <input 
                    type="text" 
                    value={content['social_facebook'] || ''} 
                    onChange={e => handleContentChange('social_facebook', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">TikTok URL</label>
                  <input 
                    type="text" 
                    value={content['social_tiktok'] || ''} 
                    onChange={e => handleContentChange('social_tiktok', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* SERVICES SECTION & DESCRIPTIONS */}
            <section className="border-t border-white/10 pt-6 space-y-6">
              <div>
                <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Services Section & Descriptions</h3>
                <p className="text-white/40 text-xs mb-4">Edit the text and bullet features for all 4 packages displayed in the Pricing & Services Grid.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Services Section Headline</label>
                  <input 
                    type="text" 
                    placeholder="Uncompromising Detail"
                    value={content['services_headline'] || ''} 
                    onChange={e => handleContentChange('services_headline', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Services Section Subtitle</label>
                  <input 
                    type="text" 
                    placeholder="Melbourne's finest automotive rejuvenation services..."
                    value={content['services_subheadline'] || ''} 
                    onChange={e => handleContentChange('services_subheadline', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
              </div>

              {/* Package 1: Wash */}
              <div className="bg-[#111] border border-white/10 p-4 rounded-lg space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#00C2D4]">1. Premium Hand Wash</h4>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Package Description</label>
                  <textarea 
                    rows={2}
                    placeholder="Meticulous two-bucket exterior wash, wheel face & barrel cleaning, and streak-free glass."
                    value={content['service_desc_wash'] || ''} 
                    onChange={e => handleContentChange('service_desc_wash', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Features / Inclusions (One bullet per line)</label>
                  <textarea 
                    rows={3}
                    placeholder={"PH-Neutral Foam\nMicrofiber Drying\nTire Dressing\nInterior Vacuum"}
                    value={content['service_features_wash'] || ''} 
                    onChange={e => handleContentChange('service_features_wash', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
              </div>

              {/* Package 2: Interior */}
              <div className="bg-[#111] border border-white/10 p-4 rounded-lg space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#00C2D4]">2. Interior Detailing</h4>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Package Description</label>
                  <textarea 
                    rows={2}
                    placeholder="Deep extraction, steam cleaning, and UV protection for all interior surfaces."
                    value={content['service_desc_interior'] || ''} 
                    onChange={e => handleContentChange('service_desc_interior', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Features / Inclusions (One bullet per line)</label>
                  <textarea 
                    rows={3}
                    placeholder={"Steam Sterilization\nLeather Conditioning\nStain Removal\nOdor Neutralization"}
                    value={content['service_features_interior'] || ''} 
                    onChange={e => handleContentChange('service_features_interior', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
              </div>

              {/* Package 3: Paint Correction */}
              <div className="bg-[#111] border border-white/10 p-4 rounded-lg space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#00C2D4]">3. Paint Correction</h4>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Package Description</label>
                  <textarea 
                    rows={2}
                    placeholder="Multi-stage machine polishing to remove swirls, scratches, and oxidation."
                    value={content['service_desc_paint'] || ''} 
                    onChange={e => handleContentChange('service_desc_paint', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Features / Inclusions (One bullet per line)</label>
                  <textarea 
                    rows={3}
                    placeholder={"Clay Bar Treatment\nSwirl Removal\nGloss Enhancement\nPanel Wipe Prep"}
                    value={content['service_features_paint'] || ''} 
                    onChange={e => handleContentChange('service_features_paint', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
              </div>

              {/* Package 4: Ceramic Coating */}
              <div className="bg-[#111] border border-white/10 p-4 rounded-lg space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#00C2D4]">4. Ceramic Coating</h4>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Package Description</label>
                  <textarea 
                    rows={2}
                    placeholder="9H hardness liquid quartz coating offering years of extreme gloss and protection."
                    value={content['service_desc_ceramic'] || ''} 
                    onChange={e => handleContentChange('service_desc_ceramic', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Features / Inclusions (One bullet per line)</label>
                  <textarea 
                    rows={3}
                    placeholder={"5-Year Protection\nExtreme Hydrophobics\nSelf-Cleaning\nChemical Resistance"}
                    value={content['service_features_ceramic'] || ''} 
                    onChange={e => handleContentChange('service_features_ceramic', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C2D4]"
                  />
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className={`text-sm ${contentStatus.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {contentStatus}
              </span>
              <button 
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="bg-[#00C2D4] hover:bg-[#00a8b8] text-[#050505] font-bold px-8 py-3 rounded transition-colors disabled:opacity-50"
              >
                {isSavingContent ? 'SAVING...' : 'SAVE CONTENT'}
              </button>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-white/50 text-sm mb-4">Update the base prices for your services. These changes will reflect immediately on the booking widget and Stripe checkout.</p>
            
            {services.map((service) => (
              <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between bg-[#111] border border-white/10 p-4 rounded gap-4">
                <div>
                  <h4 className="text-white font-bold text-lg">{service.name}</h4>
                  <p className="text-white/40 text-sm">Current Price: {formatPrice(service.base_price)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                    <input 
                      type="number" 
                      defaultValue={service.base_price / 100}
                      id={`price-${service.id}`}
                      className="w-32 bg-[#050505] border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const input = document.getElementById(`price-${service.id}`) as HTMLInputElement;
                      if (input && input.value) {
                        handleSavePrice(service.id, Math.round(parseFloat(input.value) * 100));
                      }
                    }}
                    disabled={savingServiceId === service.id}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {savingServiceId === service.id ? 'UPDATING' : 'UPDATE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <p className="text-white/50 text-sm mb-4">Upload background images for the interactive slider in The Vault, and manage your master Logo.</p>
            
            <section className="bg-[#111] border border-white/10 p-6 rounded space-y-6">
              <div>
                <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Master Site Logo</label>
                <p className="text-white/40 text-xs mb-4">Recommended: 600x200px (Transparent PNG). Displays in Navbar and Footer.</p>
                <div className="flex items-center gap-4">
                  {content['site_logo'] && (
                    <img src={content['site_logo']} alt="Logo" className="w-24 h-16 object-contain bg-black/50 rounded border border-white/20 p-2" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleUploadImage(e, 'site_logo')}
                    disabled={isSavingContent}
                    className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[#00C2D4] file:text-[#050505] hover:file:bg-[#00a8b8] transition-all"
                  />
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div>
                <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">The Vault Background Image</label>
                <p className="text-white/40 text-xs mb-4">Recommended: 1920x1080px (16:9). Upload ONE stunning photo of a finished, clean car. The system will automatically generate the "Dirty" Before version using CSS magic!</p>
                <div className="flex items-center gap-4">
                  {content['vault_image'] && (
                    <img src={content['vault_image']} alt="Vault" className="w-24 h-16 object-cover rounded border border-white/20" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleUploadImage(e, 'vault_image')}
                    disabled={isSavingContent}
                    className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[#00C2D4] file:text-[#050505] hover:file:bg-[#00a8b8] transition-all"
                  />
                </div>
              </div>
            </section>
            
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className={`text-sm ${contentStatus.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {contentStatus}
              </span>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Tracking Pixels</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Google Analytics (GA4) Measurement ID</label>
                  <input 
                    type="text" 
                    value={content['tracking_ga4'] || ''} 
                    onChange={e => handleContentChange('tracking_ga4', e.target.value)}
                    placeholder="e.g., G-XXXXXXXXXX"
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Facebook Pixel ID</label>
                  <input 
                    type="text" 
                    value={content['tracking_fbpixel'] || ''} 
                    onChange={e => handleContentChange('tracking_fbpixel', e.target.value)}
                    placeholder="e.g., 123456789012345"
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors font-mono"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Local Business Info (For Google Schema)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Business Name</label>
                  <input 
                    type="text" 
                    value={content['business_name'] || ''} 
                    onChange={e => handleContentChange('business_name', e.target.value)}
                    placeholder="Auto-Bath Luxury Detailing"
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Full Address</label>
                  <input 
                    type="text" 
                    value={content['business_address'] || ''} 
                    onChange={e => handleContentChange('business_address', e.target.value)}
                    placeholder="64 Bulla Rd, Strathmore, VIC 3041"
                    className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                  />
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className={`text-sm ${contentStatus.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {contentStatus}
              </span>
              <button 
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="bg-[#00C2D4] hover:bg-[#00a8b8] text-[#050505] font-bold px-8 py-3 rounded transition-colors disabled:opacity-50"
              >
                {isSavingContent ? 'SAVING...' : 'SAVE SEO'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
