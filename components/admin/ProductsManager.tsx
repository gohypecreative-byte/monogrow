"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Scale,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
} from "lucide-react";
import { AdminProduct } from "@/lib/db";

interface ProductsManagerProps {
  products: AdminProduct[];
  onRefresh: () => void;
}

function safeImgSrc(src?: string): string {
  if (!src || !src.trim()) return "/assets/monagrow-rice-bag-cutout.png";
  const clean = src.trim();
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("/") ||
    clean.startsWith("data:")
  ) {
    return clean;
  }
  return `/${clean}`;
}

export default function ProductsManager({ products = [], onRefresh }: ProductsManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Status feedback toast
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  // Filter products safely
  const q = searchQuery.toLowerCase().trim();
  const filteredProducts = safeProducts.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.categoryKey === selectedCategory;
    if (!matchesCat) return false;
    if (!q) return true;

    const matchesName = (p.name || "").toLowerCase().includes(q);
    const matchesCategory = (p.category || "").toLowerCase().includes(q);
    const matchesOrigin = (p.originBadge || "").toLowerCase().includes(q);
    const matchesVariations = (p.variations || []).some(
      (v) =>
        (v.sku || "").toLowerCase().includes(q) ||
        (v.weight || "").toLowerCase().includes(q)
    );

    return matchesName || matchesCategory || matchesOrigin || matchesVariations;
  });

  const categories = [
    { key: "all", name: "All", count: safeProducts.length },
    { key: "rice", name: "Rice", count: safeProducts.filter((p) => p.categoryKey === "rice").length },
    { key: "coffee", name: "Coffee", count: safeProducts.filter((p) => p.categoryKey === "coffee").length },
    { key: "dry-fruits", name: "Dry Fruits", count: safeProducts.filter((p) => p.categoryKey === "dry-fruits").length },
    { key: "sugar", name: "Sugar", count: safeProducts.filter((p) => p.categoryKey === "sugar").length },
  ];

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all its weight variations.`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      showToast(`Product "${name}" deleted.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Quick toggle active / featured
  const handleToggleStatus = async (product: AdminProduct, field: "isActive" | "isFeatured") => {
    try {
      const updated = { ...product, [field]: !product[field] };
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
      showToast(`Updated ${product.name} ${field === "isActive" ? "status" : "featured flag"}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-sm font-medium border flex items-center justify-between shadow-xl transition-all ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Check size={16} className="shrink-0 text-emerald-600" />
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="opacity-70 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e2d7c9] shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#261c16] flex items-center gap-2.5">
            <Package size={22} className="text-[#740707]" />
            <span>Commodity Products</span>
          </h2>
        </div>

        <Link
          href="/admin/products/new"
          className="py-2.5 px-5 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#740707]/20 border border-[#a81414]/30 transition-all active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-[13.5px] font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.key
                  ? "bg-[#740707] text-white border-[#5e0606] shadow-md shadow-[#740707]/20"
                  : "bg-white text-[#6f6257] border-[#e8dfd3] hover:bg-[#f8f4ed] hover:text-[#261c16]"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  selectedCategory === cat.key ? "bg-white/20 text-white" : "bg-[#ede4d8] text-[#7d7064]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7064]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2d7c9] rounded-xl text-sm text-[#261c16] placeholder-[#9c8e82] focus:outline-none focus:border-[#740707]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#e2d7c9] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#faf6f0]/95 backdrop-blur-sm text-[#6f6257] border-b border-[#e2d7c9]">
              <tr>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Commodity</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Category</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Weight Variations</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd3]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#7d7064]">
                    <Package size={36} className="mx-auto mb-2 opacity-40 text-[#740707]" />
                    <p className="text-base font-bold text-[#261c16]">No products found</p>
                    <p className="text-sm text-[#6f6257] mt-1">Try adjusting your category filter or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#faf6f0]/60 transition-colors">
                    {/* 1. Commodity Name & Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="w-13 h-13 rounded-xl bg-[#faf6f0] border border-[#e2d7c9] p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative group hover:border-[#740707] transition-all shadow-xs"
                          title="Click to edit product"
                        >
                          <Image
                            src={safeImgSrc(product.packImg)}
                            alt={product.name || "Commodity"}
                            width={44}
                            height={44}
                            unoptimized
                            className="object-contain transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex items-center gap-2.5">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-bold text-[#261c16] text-[15px] sm:text-base leading-tight hover:text-[#740707] transition-colors"
                          >
                            <span>{product.name}</span>
                          </Link>
                          {product.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-bold tracking-wide">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Category Badge */}
                    <td className="py-4 px-5">
                      <span className="px-3 py-1.5 rounded-lg bg-[#ede4d8] border border-[#e2d7c9] text-[#261c16] text-xs font-semibold capitalize whitespace-nowrap">
                        {product.categoryKey}
                      </span>
                    </td>

                    {/* 3. Weight Variations */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf6f0] border border-[#e2d7c9] text-[#261c16] text-xs font-semibold">
                        <Scale size={14} className="text-[#740707]" />
                        <span>{product.variations?.length || 0} Variations</span>
                      </span>
                    </td>

                    {/* 4. Status Toggle */}
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleToggleStatus(product, "isActive")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                            : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                        }`}
                      >
                        {product.isActive ? "Published" : "Hidden"}
                      </button>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Edit Product & Weight Variations"
                          className="p-2 rounded-xl bg-[#ede4d8] border border-[#e2d7c9] hover:bg-[#740707] hover:text-white text-[#40332a] transition-all flex items-center justify-center shadow-xs"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          title="Delete Product"
                          className="p-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 transition-all flex items-center justify-center shadow-xs"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
