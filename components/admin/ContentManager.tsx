"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FileText, Save, Check, X, Sparkles, Layers, Info, Image as ImageIcon } from "lucide-react";
import { SiteContent } from "@/lib/db";

interface ContentManagerProps {
  initialContent: SiteContent;
  onRefresh: () => void;
}

export default function ContentManager({ initialContent, onRefresh }: ContentManagerProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "philosophy" | "announcement">("about");
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleSaveSection = async (section: keyof SiteContent, data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update content");
      showToast(`Saved ${section} section successfully.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between shadow-xl transition-all ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Check size={14} className="shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2d7c9]">
        <div>
          <h2 className="text-lg font-bold text-[#261c16] flex items-center gap-2">
            <FileText size={19} className="text-[#a81414]" />
            <span>Website Copy &amp; Section Content</span>
          </h2>
          <p className="text-xs text-[#6f6257]">
            Update headlines, narrative copy, card wordmarks, and announcements without writing code
          </p>
        </div>
      </div>

      {/* Section Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-[#e2d7c9] pb-3">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "about"
              ? "bg-[#740707] text-white shadow-md shadow-[#740707]/30"
              : "bg-[#ede4d8] text-[#6f6257] hover:text-[#261c16]"
          }`}
        >
          About Monagrow (4 Cards)
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "hero"
              ? "bg-[#740707] text-white shadow-md shadow-[#740707]/30"
              : "bg-[#ede4d8] text-[#6f6257] hover:text-[#261c16]"
          }`}
        >
          Hero Introduction
        </button>

        <button
          onClick={() => setActiveTab("philosophy")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "philosophy"
              ? "bg-[#740707] text-white shadow-md shadow-[#740707]/30"
              : "bg-[#ede4d8] text-[#6f6257] hover:text-[#261c16]"
          }`}
        >
          Philosophy Pillars
        </button>

        <button
          onClick={() => setActiveTab("announcement")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "announcement"
              ? "bg-[#740707] text-white shadow-md shadow-[#740707]/30"
              : "bg-[#ede4d8] text-[#6f6257] hover:text-[#261c16]"
          }`}
        >
          Trade Notice Banner
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. ABOUT MONAGROW 4 STACKING CARDS MANAGER                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "about" && (
        <div className="space-y-6">
          {/* Card Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {content.about.cards.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedCardIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  selectedCardIdx === idx
                    ? "bg-[#740707] text-white border-[#a81414] shadow-lg shadow-[#740707]/20"
                    : "bg-white text-[#6f6257] border-[#e8dfd3] hover:text-[#261c16]"
                }`}
              >
                <span>{c.stepTag.split("/")[0].trim()}</span>
                <span className="font-sans tracking-wide">{c.wordmark}</span>
              </button>
            ))}
          </div>

          {/* Active Card Form */}
          {(() => {
            const card = content.about.cards[selectedCardIdx];
            return (
              <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e2d7c9] gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-[#a81414] font-semibold">{card.stepTag}</span>
                    <h3 className="text-base font-bold text-[#261c16]">
                      Card: {card.wordmark} &mdash; {card.headline}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleSaveSection("about", content.about)}
                    disabled={isSaving}
                    className="py-2 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#740707]/30 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{isSaving ? "Saving..." : "Save Card Content"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                      Card Wordmark (Heading Label)
                    </label>
                    <input
                      type="text"
                      value={card.wordmark}
                      onChange={(e) => {
                        const updated = [...content.about.cards];
                        updated[selectedCardIdx] = { ...card, wordmark: e.target.value };
                        setContent({ ...content, about: { ...content.about, cards: updated } });
                      }}
                      className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] font-bold text-sm tracking-wide focus:outline-none focus:border-[#740707]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                      Step / Chapter Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={card.stepTag}
                      onChange={(e) => {
                        const updated = [...content.about.cards];
                        updated[selectedCardIdx] = { ...card, stepTag: e.target.value };
                        setContent({ ...content, about: { ...content.about, cards: updated } });
                      }}
                      className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] font-mono text-xs focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={card.headline}
                    onChange={(e) => {
                      const updated = [...content.about.cards];
                      updated[selectedCardIdx] = { ...card, headline: e.target.value };
                      setContent({ ...content, about: { ...content.about, cards: updated } });
                    }}
                    className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-sm font-semibold focus:outline-none focus:border-[#740707]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                    Narrative Copy Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={card.copy}
                    onChange={(e) => {
                      const updated = [...content.about.cards];
                      updated[selectedCardIdx] = { ...card, copy: e.target.value };
                      setContent({ ...content, about: { ...content.about, cards: updated } });
                    }}
                    className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-xs leading-relaxed focus:outline-none focus:border-[#740707]"
                  />
                </div>

                {/* 3 Specifications Bullets */}
                <div>
                  <label className="block text-xs font-medium text-[#40332a] mb-2">
                    Key Specifications Checklist (3 Bullets)
                  </label>
                  <div className="space-y-2">
                    {card.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#740707]/30 text-[#ff8080] flex items-center justify-center text-[10px] font-bold">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => {
                            const newSpecs = [...card.specs];
                            newSpecs[sIdx] = e.target.value;
                            const updated = [...content.about.cards];
                            updated[selectedCardIdx] = { ...card, specs: newSpecs };
                            setContent({ ...content, about: { ...content.about, cards: updated } });
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Visual & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                      Card Image URL / Asset Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={card.image}
                        onChange={(e) => {
                          const updated = [...content.about.cards];
                          updated[selectedCardIdx] = { ...card, image: e.target.value };
                          setContent({ ...content, about: { ...content.about, cards: updated } });
                        }}
                        className="flex-1 px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                    </div>
                    <span className="text-[11px] text-[#7d7064] mt-1 block">
                      Local asset or HTTPS image link
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#40332a] mb-1.5">
                      Location Tag
                    </label>
                    <input
                      type="text"
                      value={card.location}
                      onChange={(e) => {
                        const updated = [...content.about.cards];
                        updated[selectedCardIdx] = { ...card, location: e.target.value };
                        setContent({ ...content, about: { ...content.about, cards: updated } });
                      }}
                      className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>

                {/* Image Live Preview */}
                <div className="p-4 bg-[#faf6f0] border border-[#e8dfd3] rounded-xl flex items-center gap-4">
                  <div className="w-28 h-18 rounded-lg overflow-hidden border border-[#e2d7c9] bg-black relative shrink-0">
                    <img
                      src={card.image.split("?")[0]}
                      alt={card.headline}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-[#261c16] block">Current Card Visual Preview</span>
                    <span className="text-[11px] text-[#6f6257] block line-clamp-1">{card.image}</span>
                    <span className="text-[10px] text-emerald-400 mt-0.5 block">&bull; Renders at 16:9 ratio in About Section</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION MANAGER                                       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "hero" && (
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2d7c9]">
            <div>
              <h3 className="text-base font-bold text-[#261c16]">Hero Introduction Copy</h3>
              <p className="text-xs text-[#6f6257]">Manage the top title, kicker, and value proposition</p>
            </div>
            <button
              onClick={() => handleSaveSection("hero", content.hero)}
              disabled={isSaving}
              className="py-2 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#740707]/30 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Hero Content"}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#40332a] mb-1.5">Kicker / Eyebrow</label>
            <input
              type="text"
              value={content.hero.kicker}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, kicker: e.target.value } })}
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-xs font-mono focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#40332a] mb-1.5">Heading Line 1</label>
              <input
                type="text"
                value={content.hero.headingLine1}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, headingLine1: e.target.value } })}
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-sm focus:outline-none focus:border-[#740707]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#40332a] mb-1.5">Italic Emphasized Word</label>
              <input
                type="text"
                value={content.hero.headingItalic}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, headingItalic: e.target.value } })}
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#740707] italic text-sm font-serif focus:outline-none focus:border-[#740707]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#40332a] mb-1.5">Heading Line 2</label>
              <input
                type="text"
                value={content.hero.headingLine2}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, headingLine2: e.target.value } })}
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-sm focus:outline-none focus:border-[#740707]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#40332a] mb-1.5">Subheading Description</label>
            <textarea
              rows={3}
              value={content.hero.subheading}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheading: e.target.value } })}
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-xs leading-relaxed focus:outline-none focus:border-[#740707]"
            />
          </div>

          {/* Visual Preview */}
          <div className="p-4 bg-[#faf6f0] border border-[#e8dfd3] rounded-xl">
            <span className="text-[10px] text-[#6f6257] uppercase font-mono block mb-1">Live Headline Preview</span>
            <div className="text-xl font-bold text-[#261c16]">
              {content.hero.headingLine1}{" "}
              <span className="text-[#a81414] italic font-serif">{content.hero.headingItalic}</span>{" "}
              {content.hero.headingLine2}
            </div>
            <p className="text-xs text-[#6f6257] mt-1 max-w-xl">{content.hero.subheading}</p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PHILOSOPHY PILLARS MANAGER                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "philosophy" && (
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2d7c9]">
            <div>
              <h3 className="text-base font-bold text-[#261c16]">Company Philosophy &amp; Sourcing Pillars</h3>
              <p className="text-xs text-[#6f6257]">Manage the 3 pillars of Monagrow procurement</p>
            </div>
            <button
              onClick={() => handleSaveSection("philosophy", content.philosophy)}
              disabled={isSaving}
              className="py-2 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#740707]/30 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Philosophy"}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#40332a] mb-1.5">Section Title</label>
            <input
              type="text"
              value={content.philosophy.title}
              onChange={(e) => setContent({ ...content, philosophy: { ...content.philosophy, title: e.target.value } })}
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-sm font-semibold focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div className="space-y-4 pt-2">
            {content.philosophy.pillars.map((pillar, pIdx) => (
              <div key={pIdx} className="p-4 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#740707] uppercase">
                    Pillar 0{pIdx + 1}: {pillar.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#6f6257] mb-1">Pillar Headline</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const newPillars = [...content.philosophy.pillars];
                        newPillars[pIdx] = { ...pillar, title: e.target.value };
                        setContent({ ...content, philosophy: { ...content.philosophy, pillars: newPillars } });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6f6257] mb-1">Pillar Name Tag</label>
                    <input
                      type="text"
                      value={pillar.name}
                      onChange={(e) => {
                        const newPillars = [...content.philosophy.pillars];
                        newPillars[pIdx] = { ...pillar, name: e.target.value };
                        setContent({ ...content, philosophy: { ...content.philosophy, pillars: newPillars } });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">Pillar Copy</label>
                  <textarea
                    rows={2}
                    value={pillar.copy}
                    onChange={(e) => {
                      const newPillars = [...content.philosophy.pillars];
                      newPillars[pIdx] = { ...pillar, copy: e.target.value };
                      setContent({ ...content, philosophy: { ...content.philosophy, pillars: newPillars } });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. ANNOUNCEMENT BANNER MANAGER                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "announcement" && (
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2d7c9]">
            <div>
              <h3 className="text-base font-bold text-[#261c16]">Global Trade Notice Banner</h3>
              <p className="text-xs text-[#6f6257]">Manage top notification message and target link</p>
            </div>
            <button
              onClick={() => handleSaveSection("announcement", content.announcement)}
              disabled={isSaving}
              className="py-2 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#740707]/30 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Announcement"}</span>
            </button>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={content.announcement.enabled}
              onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, enabled: e.target.checked } })}
              className="rounded bg-[#faf6f0] border-[#e2d7c9] text-[#740707]"
            />
            <span className="text-sm font-medium text-[#261c16]">Show Announcement Banner on Website</span>
          </label>

          <div>
            <label className="block text-xs font-medium text-[#40332a] mb-1.5">Banner Notice Text</label>
            <input
              type="text"
              value={content.announcement.text}
              onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, text: e.target.value } })}
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-xs focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#40332a] mb-1.5">Action Link URL</label>
            <input
              type="text"
              value={content.announcement.link}
              onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, link: e.target.value } })}
              placeholder="/contact or https://..."
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-[#261c16] text-xs focus:outline-none focus:border-[#740707]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
