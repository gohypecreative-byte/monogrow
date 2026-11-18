"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Scale,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  Layers,
  Sparkles,
  AlertCircle,
  Tag,
  DollarSign,
  ChevronRight,
  Filter,
} from "lucide-react";
import { AdminProduct, ProductVariation } from "@/lib/db";

interface ProductsManagerProps {
  products: AdminProduct[];
  onRefresh: () => void;
}

export default function ProductsManager({ products, onRefresh }: ProductsManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [selectedProductForVariations, setSelectedProductForVariations] = useState<AdminProduct | null>(null);

  // Status feedback toast
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.categoryKey === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kicker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variations.some((v) => v.sku.toLowerCase().includes(searchQuery.toLowerCase()) || v.weight.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = [
    { key: "all", name: "All Commodities", count: products.length },
    { key: "rice", name: "Rice & Grains", count: products.filter((p) => p.categoryKey === "rice").length },
    { key: "coffee", name: "Specialty Coffee", count: products.filter((p) => p.categoryKey === "coffee").length },
    { key: "dry-fruits", name: "Royal Dry Fruits", count: products.filter((p) => p.categoryKey === "dry-fruits").length },
    { key: "sugar", name: "Refined Sugar", count: products.filter((p) => p.categoryKey === "sugar").length },
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
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between shadow-xl transition-all ${
            statusMsg.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border-red-500/30 text-red-300"
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

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2d7c9]">
        <div>
          <h2 className="text-lg font-bold text-[#261c16] flex items-center gap-2">
            <Package size={19} className="text-[#a81414]" />
            <span>Product Catalog &amp; Weight Variations</span>
          </h2>
          <p className="text-xs text-[#6f6257]">
            Manage products, bulk commodities, packaging formats, and multi-weight pricing without code
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsCreatingProduct(true);
          }}
          className="py-2.5 px-4 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-[#740707]/20 border border-[#a81414]/30 transition-all active:scale-95"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
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
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.key ? "bg-white/20 text-white" : "bg-[#ede4d8] text-[#7d7064]"
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7064]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, kicker, or SKU..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#e2d7c9] rounded-xl text-xs text-white placeholder-[#9c8e82] focus:outline-none focus:border-[#740707]"
          />
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white border border-[#e2d7c9] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f0] text-[#6f6257] font-medium border-b border-[#e2d7c9]">
              <tr>
                <th className="py-3 px-4">Commodity / Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Origin / Grade</th>
                <th className="py-3 px-4">Weight Variations</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd3]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7d7064]">
                    <Package size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-[#6f6257]">No products found</p>
                    <p className="text-xs">Try adjusting your category filter or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Product Name & Visual */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#faf6f0] border border-[#e2d7c9] p-1 flex items-center justify-center shrink-0 overflow-hidden relative">
                          <Image
                            src={product.packImg || "/assets/monagrow-rice-bag-cutout.png"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#261c16] text-sm leading-tight flex items-center gap-1.5">
                            <span>{product.name}</span>
                            {product.isFeatured && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#6f6257] line-clamp-1 mt-0.5">{product.kicker}</p>
                          <span className="text-[10px] text-[#606777] font-mono">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#ede4d8] border border-[#e2d7c9] text-[#261c16] text-[11px] font-medium capitalize">
                        {product.categoryKey}
                      </span>
                    </td>

                    {/* Origin Badge */}
                    <td className="py-3.5 px-4">
                      <span className="text-[#40332a] text-xs line-clamp-2 max-w-[200px]">
                        {product.originBadge || "Direct Origin Mill"}
                      </span>
                    </td>

                    {/* Weight Variations Pill / Manager Trigger */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedProductForVariations(product)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f4ede4] border border-[#e2d7c9] hover:border-[#740707] hover:bg-[#740707]/15 transition-all text-left"
                        title="Click to manage weight variations for this product"
                      >
                        <Scale size={14} className="text-[#ff7b7b] shrink-0" />
                        <div>
                          <div className="text-[#261c16] font-medium flex items-center gap-1">
                            <span>{product.variations?.length || 0} Variations</span>
                            <ChevronRight size={12} className="text-[#6f6257] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-[10px] text-[#6f6257] line-clamp-1">
                            {product.variations?.map((v) => v.weight).join(", ") || "No variations set"}
                          </div>
                        </div>
                      </button>
                    </td>

                    {/* Active Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(product, "isActive")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                          product.isActive
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProductForVariations(product)}
                          title="Manage Weight Variations"
                          className="p-1.5 rounded-lg bg-[#ede4d8] border border-[#e2d7c9] hover:bg-[#740707] text-[#40332a] hover:text-[#261c16] transition-all"
                        >
                          <Scale size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsCreatingProduct(false);
                          }}
                          title="Edit Product Details"
                          className="p-1.5 rounded-lg bg-[#ede4d8] border border-[#e2d7c9] hover:bg-white/15 text-[#40332a] hover:text-[#261c16] transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 size={14} />
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

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: WEIGHT VARIATIONS MANAGER                            */}
      {/* ------------------------------------------------------------- */}
      {selectedProductForVariations && (
        <WeightVariationsModal
          product={selectedProductForVariations}
          onClose={() => setSelectedProductForVariations(null)}
          onSaved={() => {
            onRefresh();
            // keep modal updated with refreshed product
            const updated = products.find((p) => p.id === selectedProductForVariations.id);
            if (updated) setSelectedProductForVariations(updated);
          }}
          showToast={showToast}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: PRODUCT DETAILS EDITOR                               */}
      {/* ------------------------------------------------------------- */}
      {(editingProduct || isCreatingProduct) && (
        <ProductEditorModal
          product={editingProduct}
          isNew={isCreatingProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
          onSaved={() => {
            onRefresh();
            setEditingProduct(null);
            setIsCreatingProduct(false);
            showToast("Product details saved successfully.");
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ====================================================================
// SUB-COMPONENT: WEIGHT VARIATIONS MODAL
// ====================================================================
interface WeightVariationsModalProps {
  product: AdminProduct;
  onClose: () => void;
  onSaved: () => void;
  showToast: (text: string, type?: "success" | "error") => void;
}

function WeightVariationsModal({ product, onClose, onSaved, showToast }: WeightVariationsModalProps) {
  const [variations, setVariations] = useState<ProductVariation[]>(product.variations || []);
  const [isAdding, setIsAdding] = useState(false);

  // New variation form state
  const [weight, setWeight] = useState("1 kg");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("18.50");
  const [currency, setCurrency] = useState("USD");
  const [sku, setSku] = useState(`MNG-${product.categoryKey.slice(0, 3).toUpperCase()}-1KG`);
  const [packageType, setPackageType] = useState("Aroma-Lock Standup Bag");
  const [minOrderQty, setMinOrderQty] = useState(1);
  const [inStock, setInStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save changes to product variations
  const persistVariations = async (updatedVars: ProductVariation[]) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, variations: updatedVars }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update variations");
      setVariations(updatedVars);
      onSaved();
      showToast("Weight variations updated successfully.");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const newVar: ProductVariation = {
      id: `var-${product.id}-${Date.now()}`,
      weight,
      unit,
      price: parseFloat(price) || 0,
      currency,
      sku: sku || `MNG-${Date.now()}`,
      packageType,
      inStock,
      minOrderQty: Number(minOrderQty) || 1,
      sortOrder: variations.length,
    };

    const updated = [...variations, newVar];
    await persistVariations(updated);
    setIsAdding(false);
    // Reset form
    setWeight("");
    setPrice("");
    setSku("");
  };

  const handleDeleteVariation = async (varId: string) => {
    if (!confirm("Are you sure you want to remove this weight variation?")) return;
    const updated = variations.filter((v) => v.id !== varId);
    await persistVariations(updated);
  };

  const handleToggleStock = async (varId: string) => {
    const updated = variations.map((v) => (v.id === varId ? { ...v, inStock: !v.inStock } : v));
    await persistVariations(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#e2d7c9] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#e2d7c9] flex items-center justify-between bg-[#f8f4ed]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#740707]/20 border border-[#740707]/40 flex items-center justify-center text-[#ff7b7b]">
              <Scale size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#261c16] leading-tight">
                Manage Weight Variations
              </h3>
              <p className="text-xs text-[#6f6257]">
                Product: <span className="text-[#261c16] font-medium">{product.name}</span> ({product.category})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#ede4d8] hover:bg-[#ede4d8] flex items-center justify-center text-[#6f6257] hover:text-[#261c16] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Top Info Banner */}
          <div className="p-3.5 rounded-xl bg-[#f4ede4]/60 border border-[#e8dfd3] text-xs text-[#40332a] flex items-start gap-2.5">
            <AlertCircle size={16} className="text-[#a81414] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#261c16] mb-0.5">Custom Weight &amp; Bulk Package Options</p>
              <p className="text-[#6f6257]">
                Add retail pouches (250g, 500g, 1kg, 5kg) or commercial bulk export sacks (10kg, 25kg, 50kg, 60kg) with unique SKUs and prices. These variations render automatically on product cards and the wholesale quote modal.
              </p>
            </div>
          </div>

          {/* Existing Variations Table */}
          <div className="border border-[#e2d7c9] rounded-xl overflow-hidden bg-[#faf6f0]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-[#6f6257] font-medium border-b border-[#e2d7c9]">
                <tr>
                  <th className="py-2.5 px-3.5">Weight / Unit</th>
                  <th className="py-2.5 px-3.5">Package Type</th>
                  <th className="py-2.5 px-3.5">SKU Code</th>
                  <th className="py-2.5 px-3.5">Unit Price</th>
                  <th className="py-2.5 px-3.5">Stock Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfd3]">
                {variations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#7d7064]">
                      No weight variations added yet. Click &quot;Add Weight Option&quot; below.
                    </td>
                  </tr>
                ) : (
                  variations.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3.5 font-bold text-[#261c16] flex items-center gap-1.5">
                        <Tag size={13} className="text-[#ff7b7b]" />
                        <span>{v.weight}</span>
                      </td>
                      <td className="py-3 px-3.5 text-[#40332a]">{v.packageType}</td>
                      <td className="py-3 px-3.5 font-mono text-[11px] text-[#6f6257]">{v.sku}</td>
                      <td className="py-3 px-3.5 font-semibold text-[#261c16]">
                        {v.currency} ${v.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => handleToggleStock(v.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                            v.inStock
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-red-500/10 text-red-300 border-red-500/30"
                          }`}
                        >
                          {v.inStock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => handleDeleteVariation(v.id)}
                          title="Delete variation"
                          className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Variation Form / Button */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#d8ccbc] hover:border-[#740707] hover:bg-[#740707]/10 text-xs font-semibold text-[#261c16] flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={14} />
              <span>Add Another Weight Variation</span>
            </button>
          ) : (
            <form onSubmit={handleAddVariation} className="p-4 rounded-xl bg-[#f8f4ed] border border-[#e2d7c9] space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#261c16]">New Weight Specification</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-[#6f6257] hover:text-[#261c16]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">Weight Label</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 1 kg, 500 g, 50 kg"
                    required
                    className="w-full px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-white focus:outline-none focus:border-[#740707]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 18.50"
                    required
                    className="w-full px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-white focus:outline-none focus:border-[#740707]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. MNG-BAS-5KG"
                    className="w-full px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-white focus:outline-none focus:border-[#740707]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">Packaging Format</label>
                  <input
                    type="text"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    placeholder="e.g. Standup Zipper Box Bag, BOPP Sack"
                    className="w-full px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-white focus:outline-none focus:border-[#740707]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6f6257] mb-1">Min Order Qty</label>
                  <input
                    type="number"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-white focus:outline-none focus:border-[#740707]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-[#40332a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded bg-[#faf6f0] border-[#e2d7c9] text-[#740707] focus:ring-0"
                  />
                  <span>Mark as currently in stock</span>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1.5 px-4 rounded-lg bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  Save Variation
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2d7c9] bg-[#f8f4ed] flex items-center justify-between">
          <span className="text-[11px] text-[#7d7064]">
            Total {variations.length} weight variations configured
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#ede4d8] hover:bg-[#e2d7c9] text-[#261c16] text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SUB-COMPONENT: PRODUCT DETAILS EDITOR MODAL
// ====================================================================
interface ProductEditorModalProps {
  product: AdminProduct | null;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
  showToast: (text: string, type?: "success" | "error") => void;
}

function ProductEditorModal({ product, isNew, onClose, onSaved, showToast }: ProductEditorModalProps) {
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    id: product?.id || "",
    name: product?.name || "",
    categoryKey: product?.categoryKey || "rice",
    category: product?.category || "Grains & Rice",
    kicker: product?.kicker || "",
    tagline: product?.tagline || "",
    description: product?.description || "",
    originBadge: product?.originBadge || "",
    packImg: product?.packImg || "/assets/monagrow-rice-bag-cutout.png",
    bowlImg: product?.bowlImg || "/assets/hero-center-rice.png",
    bowlAlt: product?.bowlAlt || "",
    packAlt: product?.packAlt || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    specs: product?.specs || [
      { label: "Origin", value: "Direct Estate Mill" },
      { label: "Grade", value: "Export Grade 100% Sortex" },
    ],
    keyHighlights: product?.keyHighlights || [
      "Verified harvest provenance with single-estate lot tracking",
      "100% laser optical sortex cleaned for maximum commercial purity",
    ],
    variations: product?.variations || [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      onSaved();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#e2d7c9] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#e2d7c9] flex items-center justify-between bg-[#f8f4ed]">
          <h3 className="text-base font-bold text-[#261c16]">
            {isNew ? "Add New Commodity Product" : `Edit Product: ${product?.name}`}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#ede4d8] hover:bg-[#ede4d8] flex items-center justify-center text-[#6f6257] hover:text-[#261c16] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              />
            </div>

            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Category *</label>
              <select
                value={formData.categoryKey}
                onChange={(e) => {
                  const key = e.target.value as any;
                  const catMap: Record<string, string> = {
                    rice: "Grains & Rice",
                    coffee: "Specialty Estate",
                    "dry-fruits": "Select Dry Fruits",
                    sugar: "Refined Sugar",
                  };
                  setFormData({ ...formData, categoryKey: key, category: catMap[key] || "Commodity" });
                }}
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              >
                <option value="rice">Rice &amp; Grains</option>
                <option value="coffee">Specialty Coffee</option>
                <option value="dry-fruits">Dry Fruits</option>
                <option value="sugar">Refined Sugar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#6f6257] mb-1 font-medium">Kicker / Eyebrow</label>
            <input
              type="text"
              value={formData.kicker}
              onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
              placeholder="e.g. Extra Long Grain · 2 Seasons Aged"
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div>
            <label className="block text-[#6f6257] mb-1 font-medium">Tagline / Headline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Pure Himalayan Meltwater-Fed Extra Long Basmati"
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div>
            <label className="block text-[#6f6257] mb-1 font-medium">Full Commercial Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Origin Badge</label>
              <input
                type="text"
                value={formData.originBadge}
                onChange={(e) => setFormData({ ...formData, originBadge: e.target.value })}
                placeholder="e.g. Himalayan Meltwater · Alluvial Belt"
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              />
            </div>
            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Pack Image Asset Path</label>
              <input
                type="text"
                value={formData.packImg}
                onChange={(e) => setFormData({ ...formData, packImg: e.target.value })}
                placeholder="/assets/monagrow-rice-bag-cutout.png"
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Bowl Image Asset Path</label>
              <input
                type="text"
                value={formData.bowlImg}
                onChange={(e) => setFormData({ ...formData, bowlImg: e.target.value })}
                placeholder="/assets/hero-center-rice.png"
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              />
            </div>
            <div>
              <label className="block text-[#6f6257] mb-1 font-medium">Bowl Alt Text</label>
              <input
                type="text"
                value={formData.bowlAlt}
                onChange={(e) => setFormData({ ...formData, bowlAlt: e.target.value })}
                placeholder="Full ceramic wooden bowl of Basmati rice"
                className="w-full px-3 py-2 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-white focus:outline-none focus:border-[#740707]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded bg-[#faf6f0] border-[#e2d7c9] text-[#740707]"
              />
              <span className="text-[#261c16] font-medium">Product is Active &amp; Published</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded bg-[#faf6f0] border-[#e2d7c9] text-[#740707]"
              />
              <span className="text-[#261c16] font-medium">Display on Home Featured Carousel</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#e2d7c9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-[#ede4d8] hover:bg-[#ede4d8] text-[#6f6257] hover:text-[#261c16]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="py-2 px-5 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-[#261c16] font-semibold flex items-center gap-1.5 shadow-lg shadow-[#740707]/30"
            >
              <Check size={14} />
              <span>{isSaving ? "Saving..." : "Save Product Details"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
