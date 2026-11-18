"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, Copy, Check, ExternalLink, Plus, Filter, Search, Sparkles, X, ArrowUpRight } from "lucide-react";
import { MediaAsset } from "@/lib/db";

interface MediaManagerProps {
  media: MediaAsset[];
  onRefresh: () => void;
}

export default function MediaManager({ media, onRefresh }: MediaManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // New asset form
  const [fileName, setFileName] = useState("");
  const [assetPath, setAssetPath] = useState("");
  const [category, setCategory] = useState("Hero Bowls");
  const [altText, setAltText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    { key: "all", name: "All Assets", count: media.length },
    { key: "Hero Bowls", name: "Hero Bowls", count: media.filter((m) => m.category === "Hero Bowls").length },
    { key: "About Section", name: "About Section", count: media.filter((m) => m.category === "About Section").length },
    { key: "Product Packaging", name: "Packaging Cutouts", count: media.filter((m) => m.category === "Product Packaging").length },
  ];

  const filteredMedia = media.filter((m) => {
    const matchesCat = selectedCategory === "all" || m.category === selectedCategory;
    const matchesSearch =
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.altText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyPath = (pathStr: string, id: string) => {
    navigator.clipboard.writeText(pathStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetPath || !fileName) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, path: assetPath, category, altText }),
      });
      if (!res.ok) throw new Error("Failed to register asset");
      onRefresh();
      setIsRegistering(false);
      setFileName("");
      setAssetPath("");
      setAltText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2d7c9]">
        <div>
          <h2 className="text-lg font-bold text-[#261c16] flex items-center gap-2">
            <ImageIcon size={19} className="text-[#a81414]" />
            <span>Images &amp; Media Management</span>
          </h2>
          <p className="text-xs text-[#6f6257]">
            Browse, preview, and manage site visual assets including Hero wooden bowls, About cards, and packaging cutouts
          </p>
        </div>

        <button
          onClick={() => setIsRegistering(true)}
          className="py-2.5 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-[#740707]/20 border border-[#a81414]/30 transition-all"
        >
          <Plus size={15} />
          <span>Register Image Asset</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat.key
                  ? "bg-[#740707] text-white border-[#9b1313] shadow-md shadow-[#740707]/20"
                  : "bg-white text-[#6f6257] border-[#e8dfd3] hover:bg-[#f8f4ed] hover:text-[#261c16]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="ml-1.5 text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7064]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by name or path..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#e2d7c9] rounded-xl text-xs text-white placeholder-[#9c8e82] focus:outline-none focus:border-[#740707]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-[#e2d7c9] rounded-2xl overflow-hidden hover:border-[#740707]/50 transition-all flex flex-col group shadow-lg"
          >
            {/* Visual Thumbnail */}
            <div className="h-44 bg-[#f6efe6] relative overflow-hidden flex items-center justify-center p-3">
              <img
                src={asset.path.split("?")[0]}
                alt={asset.altText}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-[#261c16] border border-[#e2d7c9]">
                {asset.category}
              </span>
            </div>

            {/* Info */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 border-t border-[#e8dfd3]">
              <div>
                <h4 className="font-semibold text-[#261c16] text-xs truncate" title={asset.fileName}>
                  {asset.fileName}
                </h4>
                <p className="text-[11px] text-[#6f6257] line-clamp-2 mt-0.5" title={asset.altText}>
                  {asset.altText}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e8dfd3] flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-[#7d7064] truncate max-w-[130px]" title={asset.path}>
                  {asset.path}
                </span>

                <button
                  onClick={() => handleCopyPath(asset.path, asset.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all border ${
                    copiedId === asset.id
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-[#ede4d8] text-[#40332a] border-[#e2d7c9] hover:bg-[#ede4d8] hover:text-[#261c16]"
                  }`}
                  title="Copy asset path to clipboard"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check size={11} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy Path</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Asset Modal */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#e2d7c9] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#e2d7c9] flex items-center justify-between bg-[#f8f4ed]">
              <h3 className="text-sm font-bold text-[#261c16]">Register Media Asset</h3>
              <button
                onClick={() => setIsRegistering(false)}
                className="text-[#6f6257] hover:text-[#261c16]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6f6257] mb-1 font-medium">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. hero-harvest.jpg"
                  required
                  className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
                />
              </div>

              <div>
                <label className="block text-[#6f6257] mb-1 font-medium">Path or Image URL</label>
                <input
                  type="text"
                  value={assetPath}
                  onChange={(e) => setAssetPath(e.target.value)}
                  placeholder="e.g. /assets/hero-harvest.jpg or https://..."
                  required
                  className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
                />
              </div>

              <div>
                <label className="block text-[#6f6257] mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
                >
                  <option value="Hero Bowls">Hero Bowls</option>
                  <option value="About Section">About Section</option>
                  <option value="Product Packaging">Product Packaging</option>
                  <option value="Banners">Banners &amp; Posters</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6f6257] mb-1 font-medium">Alt Description</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive caption for screen readers"
                  className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
                />
              </div>

              <div className="pt-3 border-t border-[#e2d7c9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="py-1.5 px-3 rounded-lg text-[#6f6257] hover:text-[#261c16]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-1.5 px-4 rounded-lg bg-[#740707] hover:bg-[#880a0a] text-[#261c16] font-semibold shadow-md shadow-[#740707]/30"
                >
                  {isSaving ? "Saving..." : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
