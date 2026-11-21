"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  Trash2,
  Scale,
  Package,
  Check,
  X,
  AlertCircle,
  Tag,
  Layers,
  Sparkles,
  Loader2,
  Eye,
  Upload,
} from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminProduct, ProductVariation } from "@/lib/db";

// Global Trade Currencies with Priority: NPR (Topmost), INR (2nd), USD (3rd), followed by others
export const PRIORITY_CURRENCIES = [
  { code: "NPR", symbol: "रू", name: "Nepalese Rupee", region: "Nepal Commercial Trade" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", region: "Origin Agricultural Belt" },
  { code: "USD", symbol: "$", name: "US Dollar", region: "Global Commodity Standard" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", region: "Monagrow UAE Headquarters" },
  { code: "EUR", symbol: "€", name: "Euro", region: "European Wholesale" },
  { code: "GBP", symbol: "£", name: "British Pound", region: "United Kingdom" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", region: "GCC & Middle East" },
];

export const OTHER_CURRENCIES = [
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar" },
  { code: "SGD", symbol: "SG$", name: "Singapore Dollar" },
  { code: "QAR", symbol: "QAR", name: "Qatari Riyal" },
  { code: "KWD", symbol: "KWD", name: "Kuwaiti Dinar" },
  { code: "OMR", symbol: "OMR", name: "Omani Rial" },
  { code: "BHD", symbol: "BHD", name: "Bahraini Dinar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export default function ProductEditPage({ isNewProp }: { isNewProp?: boolean }) {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center">Loading product editor…</div>}>
      <ProductEditContent isNewProp={isNewProp} />
    </Suspense>
  );
}

function ProductEditContent({ isNewProp }: { isNewProp?: boolean }) {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "";
  const isNew = isNewProp || !rawId || rawId === "new";
  const productId = isNew ? "" : decodeURIComponent(rawId);

  // Image sanitization helper
  const sanitizeImgSrc = (src?: string) => {
    if (!src || !src.trim()) return "";
    const clean = src.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
      return clean;
    }
    return `/${clean}`;
  };

  // Auth & Session
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [neonConnected, setNeonConnected] = useState(false);

  // Loading product
  const [loadingProduct, setLoadingProduct] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form State
  const [product, setProduct] = useState<AdminProduct>({
    id: isNew ? "" : productId,
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "",
    kicker: "",
    quoteName: "",
    tagline: "",
    description: "",
    originBadge: "",
    packImg: "/assets/monagrow-rice-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "",
    packAlt: "",
    specs: [
      { label: "Origin", value: "Direct Estate Mill" },
      { label: "Grade", value: "Export Grade 100% Sortex" },
      { label: "Harvest", value: "Current Season Reserve" },
    ],
    keyHighlights: [
      "Verified harvest provenance with single-estate lot tracking",
      "100% laser optical sortex cleaned for commercial purity",
      "Container-ready packaging for wholesale global distribution",
    ],
    variations: [
      {
        id: "var-init-1",
        weight: "1 kg",
        unit: "kg",
        price: 4.5,
        currency: "NPR",
        sku: "MNG-PROD-1KG",
        packageType: "Aroma-Lock Standup Pouch",
        inStock: true,
        minOrderQty: 1,
        sortOrder: 0,
      },
    ],
    isActive: true,
    isFeatured: false,
    updatedAt: "",
  });

  // Saving state & Toast
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Inline Weight Variation Form State
  const [showAddVariation, setShowAddVariation] = useState(false);
  const [newVarWeight, setNewVarWeight] = useState("");
  const [newVarUnit, setNewVarUnit] = useState("kg");
  const [newVarPrice, setNewVarPrice] = useState("");
  const [newVarCurrency, setNewVarCurrency] = useState("NPR");
  const [newVarSku, setNewVarSku] = useState("");
  const [newVarPkg, setNewVarPkg] = useState("Aroma-Lock Standup Pouch");
  const [newVarMoq, setNewVarMoq] = useState(1);
  const [newVarInStock, setNewVarInStock] = useState(true);

  // Image Upload & Drag-and-Drop state
  const packInputRef = useRef<HTMLInputElement | null>(null);
  const bowlInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPack, setIsUploadingPack] = useState(false);
  const [isUploadingBowl, setIsUploadingBowl] = useState(false);
  const [isDraggingPack, setIsDraggingPack] = useState(false);
  const [isDraggingBowl, setIsDraggingBowl] = useState(false);

  // Check Auth
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setSession(data.user);
          fetch("/api/admin/neon")
            .then((r) => r.json())
            .then((d) => setNeonConnected(Boolean(d?.status?.isConfigured)))
            .catch(() => {});
        } else {
          setSession(null);
        }
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch Product Data
  useEffect(() => {
    if (!session || isNew) {
      setLoadingProduct(false);
      return;
    }

    const loadProduct = async () => {
      setLoadingProduct(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/admin/products?id=${encodeURIComponent(productId)}`);
        if (!res.ok) throw new Error("Product not found or failed to load");
        const data = await res.json();
        if (data.product) {
          setProduct({
            ...data.product,
            variations: data.product.variations || [],
            specs: data.product.specs || [],
            keyHighlights: data.product.keyHighlights || [],
          });
        } else {
          throw new Error("Product data is empty");
        }
      } catch (err: any) {
        setLoadError(err.message || "Failed to load product");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [session, productId, isNew]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Image Upload Handlers
  const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB

  const handleFileUpload = async (
    file: File,
    targetField: "packImg" | "bowlImg",
    category: string
  ) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      showToast(`File size (${sizeMb} MB) exceeds the 20 MB limit.`, "error");
      return;
    }
    if (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(file.name)) {
      showToast("Invalid file format. Please upload an image file.", "error");
      return;
    }

    const isPack = targetField === "packImg";
    if (isPack) setIsUploadingPack(true);
    else setIsUploadingBowl(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setProduct((prev) => {
        const altField = isPack ? "packAlt" : "bowlAlt";
        const currentAlt = prev[altField];
        const defaultAlt = isPack
          ? `Monagrow ${prev.name} retail packaging`
          : `Monagrow ${prev.name} commodity presentation`;
        return {
          ...prev,
          [targetField]: data.url,
          [altField]: currentAlt && currentAlt.trim() ? currentAlt : defaultAlt,
        };
      });

      showToast(`Image uploaded successfully (${data.formattedSize})!`);
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      if (isPack) setIsUploadingPack(false);
      else setIsUploadingBowl(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, setDragging: (val: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent, setDragging: (val: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetField: "packImg" | "bowlImg",
    category: string,
    setDragging: (val: boolean) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileUpload(files[0], targetField, category);
  };

  // Handle Category Change
  const handleCategoryChange = (catKey: "rice" | "coffee" | "sugar" | "dry-fruits") => {
    const categoryNames: Record<string, string> = {
      rice: "Grains & Rice",
      coffee: "Specialty Coffee",
      "dry-fruits": "Select Dry Fruits",
      sugar: "Refined Sugar",
    };
    setProduct((prev) => ({
      ...prev,
      categoryKey: catKey,
      category: categoryNames[catKey] || prev.category,
    }));
  };

  // Specs helpers
  const handleAddSpec = () => {
    setProduct((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "New Spec", value: "Specification Value" }],
    }));
  };

  const handleUpdateSpec = (index: number, field: "label" | "value", val: string) => {
    setProduct((prev) => {
      const nextSpecs = [...prev.specs];
      nextSpecs[index] = { ...nextSpecs[index], [field]: val };
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleRemoveSpec = (index: number) => {
    setProduct((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  // Highlights helpers
  const handleAddHighlight = () => {
    setProduct((prev) => ({
      ...prev,
      keyHighlights: [...prev.keyHighlights, "New commercial grade highlight or specification standard"],
    }));
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    setProduct((prev) => {
      const nextHighlights = [...prev.keyHighlights];
      nextHighlights[index] = val;
      return { ...prev, keyHighlights: nextHighlights };
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      keyHighlights: prev.keyHighlights.filter((_, i) => i !== index),
    }));
  };

  // Weight Variations helpers
  const handleToggleStock = (varId: string) => {
    setProduct((prev) => ({
      ...prev,
      variations: prev.variations.map((v) => (v.id === varId ? { ...v, inStock: !v.inStock } : v)),
    }));
  };

  const handleDeleteVariation = (varId: string) => {
    if (product.variations.length <= 1) {
      if (!confirm("This product will have no weight variations configured. Continue?")) return;
    }
    setProduct((prev) => ({ ...prev, variations: prev.variations.filter((v) => v.id !== varId) }));
    showToast("Weight variation removed.");
  };

  const handleUpdateVariationField = (varId: string, field: keyof ProductVariation, value: any) => {
    setProduct((prev) => ({
      ...prev,
      variations: prev.variations.map((v) => (v.id === varId ? { ...v, [field]: value } : v)),
    }));
  };

  const handleAddVariationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarWeight.trim()) {
      showToast("Please enter a weight label (e.g., '1 kg' or '25 kg Sack')", "error");
      return;
    }

    const priceNum = parseFloat(newVarPrice) || 0;
    const generatedSku =
      newVarSku.trim() ||
      `MNG-${product.categoryKey.slice(0, 3).toUpperCase()}-${newVarWeight.replace(/\s+/g, "").toUpperCase()}`;

    const newVariation: ProductVariation = {
      id: `var-${product.id || "p"}-${newVarWeight.replace(/\s+/g, "").toLowerCase()}-${product.variations.length + 1}`,
      weight: newVarWeight.trim(),
      unit: newVarUnit.trim() || "kg",
      price: priceNum,
      currency: newVarCurrency || "NPR",
      sku: generatedSku,
      packageType: newVarPkg.trim() || "Commercial Packaging",
      inStock: newVarInStock,
      minOrderQty: Number(newVarMoq) || 1,
      sortOrder: product.variations.length,
    };

    setProduct((prev) => ({ ...prev, variations: [...prev.variations, newVariation] }));
    showToast(`Added weight variation: ${newVariation.weight}`);
    setNewVarWeight("");
    setNewVarPrice("");
    setNewVarSku("");
    setShowAddVariation(false);
  };

  const handleQuickAddPreset = (weightPreset: string, pkgPreset: string, priceEstimate: number) => {
    const defaultCurrency = product.variations[0]?.currency || newVarCurrency || "NPR";
    const skuCode = `MNG-${product.categoryKey.slice(0, 3).toUpperCase()}-${weightPreset.replace(/\s+/g, "").toUpperCase()}`;
    const newVariation: ProductVariation = {
      id: `var-${product.id || "p"}-${weightPreset.replace(/\s+/g, "").toLowerCase()}-${product.variations.length + 1}`,
      weight: weightPreset,
      unit: weightPreset.toLowerCase().includes("kg") ? "kg" : "g",
      price: priceEstimate,
      currency: defaultCurrency,
      sku: skuCode,
      packageType: pkgPreset,
      inStock: true,
      minOrderQty: 1,
      sortOrder: product.variations.length,
    };
    setProduct((prev) => ({ ...prev, variations: [...prev.variations, newVariation] }));
    showToast(`Quick added variation: ${weightPreset}`);
  };

  const handleApplyCurrencyToAll = (targetCurrency: string) => {
    setProduct((prev) => ({
      ...prev,
      variations: prev.variations.map((v) => ({ ...v, currency: targetCurrency })),
    }));
    setNewVarCurrency(targetCurrency);
    showToast(`Currency updated to ${targetCurrency} for all variations.`);
  };

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!product.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const finalId =
        product.id.trim() ||
        product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload: AdminProduct = {
        ...product,
        id: finalId,
        quoteName: product.quoteName.trim() || product.name,
        updatedAt: new Date().toISOString(),
      };

      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      showToast(`Product "${payload.name}" and all weight variations saved successfully!`);
      if (isNew) {
        setTimeout(() => router.push(`/admin/products/${finalId}`), 1200);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      alert("Product deleted.");
      router.push("/admin");
    } catch (err: any) {
      showToast(err.message || "Failed to delete product", "error");
    }
  };

  // ── Auth Checking Screen ──────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#740707] mx-auto" />
          <p className="text-xs text-[#6f6257] font-medium tracking-wide">
            Verifying Monagrow Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // ── Not Logged In ─────────────────────────────────────────────────────────
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => setSession(user)}
      />
    );
  }

  // ── Loading Product Data ──────────────────────────────────────────────────
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-transparent text-[#261c16]">
        <AdminHeader
          user={session}
          neonConnected={neonConnected}
          onSelectTab={() => router.push("/admin")}
          onLogout={() => { fetch("/api/admin/auth/logout", { method: "POST" }); setSession(null); }}
        />
        <div className="max-w-5xl mx-auto p-12 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#740707] mx-auto" />
          <p className="text-sm font-semibold text-[#261c16]">Loading product details...</p>
        </div>
      </div>
    );
  }

  // ── Error Loading Product ─────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="min-h-screen bg-transparent text-[#261c16]">
        <AdminHeader
          user={session}
          neonConnected={neonConnected}
          onSelectTab={() => router.push("/admin")}
          onLogout={() => { fetch("/api/admin/auth/logout", { method: "POST" }); setSession(null); }}
        />
        <div className="max-w-2xl mx-auto p-8 mt-12 bg-white border border-red-200 rounded-2xl text-center space-y-4 shadow-sm">
          <AlertCircle size={36} className="text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-[#261c16]">Product Not Found</h2>
          <p className="text-xs text-[#6f6257]">
            {loadError}. It may have been removed or the ID ({productId}) is invalid.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#740707] text-white text-xs font-semibold hover:bg-[#880a0a] transition-all"
            >
              <ArrowLeft size={14} />
              <span>Return to Products Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Editor ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#261c16]">
      {/* Header */}
      <AdminHeader
        user={session}
        neonConnected={neonConnected}
        onSelectTab={() => router.push("/admin")}
        onLogout={() => { fetch("/api/admin/auth/logout", { method: "POST" }); setSession(null); }}
      />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 animate-bounce-short">
          <div
            className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-3 shadow-2xl backdrop-blur-md ${
              toastMsg.type === "success"
                ? "bg-emerald-900/90 border-emerald-600 text-white"
                : "bg-red-900/90 border-red-600 text-white"
            }`}
          >
            {toastMsg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{toastMsg.text}</span>
            <button onClick={() => setToastMsg(null)} className="ml-2 opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2d7c9]">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#740707] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Back to Products Catalog</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#261c16]">
                {isNew ? "Add New Commodity Product" : `Edit Product: ${product.name}`}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  product.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.isActive ? "Published" : "Hidden"}
              </span>
            </div>
            <p className="text-xs text-[#6f6257]">
              ID: <span className="font-mono text-[#261c16]">{product.id || "auto-generated"}</span> &bull; Category:{" "}
              <span className="font-medium text-[#261c16] capitalize">{product.categoryKey}</span>
            </p>
          </div>

          {/* Action Buttons Top Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="py-2.5 px-4 rounded-xl bg-white border border-[#e2d7c9] hover:bg-[#ede4d8] text-xs font-semibold text-[#6f6257] transition-all"
            >
              Cancel
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={handleDeleteProduct}
                title="Delete this product"
                className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all text-xs font-semibold"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#740707]/20 border border-[#a81414]/30 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{isSaving ? "Saving..." : "Save Product & Variations"}</span>
            </button>
          </div>
        </div>

        {/* EDIT FORM */}
        <form onSubmit={handleSaveProduct} className="space-y-6">
          {/* ── CARD 1: BASIC INFORMATION ─────────────────────────────────── */}
          <section className="bg-white border border-[#e2d7c9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="border-b border-[#f0e7dc] pb-3">
              <h2 className="text-base font-bold text-[#261c16] flex items-center gap-2">
                <Package size={18} className="text-[#740707]" />
                <span>Commodity &amp; Commercial Details</span>
              </h2>
              <p className="text-xs text-[#6f6257]">
                Primary product designations, commercial commodity category, and public headings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#261c16] mb-1.5">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="e.g. 1121 Supreme Basmati Rice"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#261c16] mb-1.5">
                  Commodity Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={product.categoryKey}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707] font-medium"
                >
                  <option value="rice">Rice &amp; Grains</option>
                  <option value="coffee">Specialty Coffee</option>
                  <option value="dry-fruits">Royal Dry Fruits</option>
                  <option value="sugar">Refined Sugar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#261c16] mb-1.5">Eyebrow / Kicker</label>
                <input
                  type="text"
                  value={product.kicker}
                  onChange={(e) => setProduct({ ...product, kicker: e.target.value })}
                  placeholder="e.g. Extra Long Grain · Aged Two Full Seasons"
                  className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#261c16] mb-1.5">Quote Modal Name</label>
                <input
                  type="text"
                  value={product.quoteName}
                  onChange={(e) => setProduct({ ...product, quoteName: e.target.value })}
                  placeholder="e.g. Basmati Rice (1121 Supreme Long Grain)"
                  className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#261c16] mb-1.5">
                Tagline / Primary Commercial Headline
              </label>
              <input
                type="text"
                value={product.tagline}
                onChange={(e) => setProduct({ ...product, tagline: e.target.value })}
                placeholder="e.g. Unmatched Slender Length & Delicate Himalayan Aroma"
                className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#261c16] mb-1.5">
                Full Commercial Description
              </label>
              <textarea
                rows={4}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Describe crop origin, processing, grain/bean attributes, cooking specs, or export certifications..."
                className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#261c16] mb-1.5">Origin Badge Text</label>
              <input
                type="text"
                value={product.originBadge}
                onChange={(e) => setProduct({ ...product, originBadge: e.target.value })}
                placeholder="e.g. Himalayan Meltwater Fed · 100% Sortex Clean"
                className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
              />
            </div>
          </section>

          {/* ── CARD 2: MEDIA ASSETS ──────────────────────────────────────── */}
          <section className="bg-white border border-[#e2d7c9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="border-b border-[#f0e7dc] pb-3">
              <h2 className="text-base font-bold text-[#261c16] flex items-center gap-2">
                <Sparkles size={18} className="text-[#740707]" />
                <span>Media &amp; Packaging Visual Assets</span>
              </h2>
              <p className="text-xs text-[#6f6257]">
                Live image paths and alternative text for retail pouches and commodity displays
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ── Pack Image ── */}
              <div
                onDragOver={(e) => handleDragOver(e, setIsDraggingPack)}
                onDragEnter={(e) => handleDragOver(e, setIsDraggingPack)}
                onDragLeave={(e) => handleDragLeave(e, setIsDraggingPack)}
                onDrop={(e) => handleDrop(e, "packImg", "Product Packaging", setIsDraggingPack)}
                className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                  isDraggingPack
                    ? "bg-[#740707]/10 border-2 border-dashed border-[#740707] shadow-md scale-[1.01]"
                    : "bg-[#faf6f0] border-[#e2d7c9]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261c16]">Retail / Pack Image</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#740707] font-semibold bg-[#740707]/10 px-1.5 py-0.5 rounded">
                      Max 20 MB
                    </span>
                    <span className="text-[10px] text-[#7d7064] font-mono">Transparent cutout</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => packInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl bg-white border border-[#e2d7c9] p-2 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner cursor-pointer group hover:border-[#740707] transition-all"
                    title="Click or drag image here to upload (Max 20 MB)"
                  >
                    {isUploadingPack ? (
                      <div className="flex flex-col items-center justify-center gap-1 text-[#740707]">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-[9px] font-bold">Uploading</span>
                      </div>
                    ) : sanitizeImgSrc(product.packImg) ? (
                      <>
                        <Image
                          src={sanitizeImgSrc(product.packImg)}
                          alt="Preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="object-contain max-h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#a89d91] group-hover:text-[#740707]">
                        <Upload size={20} />
                        <span className="text-[9px] mt-0.5 font-medium">Upload</span>
                      </div>
                    )}
                  </div>

                  {/* Inputs + Upload Button */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={product.packImg}
                        onChange={(e) => setProduct({ ...product, packImg: e.target.value })}
                        placeholder="/assets/monagrow-rice-bag-cutout.png or /uploads/..."
                        className="flex-1 min-w-0 px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs font-mono text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                      <button
                        type="button"
                        disabled={isUploadingPack}
                        onClick={() => packInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                        title="Upload image from your device (Max 20 MB)"
                      >
                        {isUploadingPack ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={13} />
                            <span>Upload Image</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={product.packAlt}
                      onChange={(e) => setProduct({ ...product, packAlt: e.target.value })}
                      placeholder="Alt text e.g. Monagrow Basmati Rice 5kg Standup Box Bag"
                      className="w-full px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>

                {/* Drag & Drop Hint */}
                <div className="text-[10px] text-[#7d7064] flex items-center justify-between pt-1 border-t border-[#e8dfd3]">
                  <span>💡 Drag &amp; drop image here or click Upload</span>
                  <span>Max file size: <strong className="text-[#261c16]">20 MB</strong></span>
                </div>

                <input
                  ref={packInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "packImg", "Product Packaging");
                    e.target.value = "";
                  }}
                />
              </div>

              {/* ── Bowl Image ── */}
              <div
                onDragOver={(e) => handleDragOver(e, setIsDraggingBowl)}
                onDragEnter={(e) => handleDragOver(e, setIsDraggingBowl)}
                onDragLeave={(e) => handleDragLeave(e, setIsDraggingBowl)}
                onDrop={(e) => handleDrop(e, "bowlImg", "Hero Bowls", setIsDraggingBowl)}
                className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                  isDraggingBowl
                    ? "bg-[#740707]/10 border-2 border-dashed border-[#740707] shadow-md scale-[1.01]"
                    : "bg-[#faf6f0] border-[#e2d7c9]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261c16]">Commodity Display / Bowl Image</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#740707] font-semibold bg-[#740707]/10 px-1.5 py-0.5 rounded">
                      Max 20 MB
                    </span>
                    <span className="text-[10px] text-[#7d7064] font-mono">Hero graphic</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => bowlInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl bg-white border border-[#e2d7c9] p-2 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner cursor-pointer group hover:border-[#740707] transition-all"
                    title="Click or drag image here to upload (Max 20 MB)"
                  >
                    {isUploadingBowl ? (
                      <div className="flex flex-col items-center justify-center gap-1 text-[#740707]">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-[9px] font-bold">Uploading</span>
                      </div>
                    ) : sanitizeImgSrc(product.bowlImg) ? (
                      <>
                        <Image
                          src={sanitizeImgSrc(product.bowlImg)}
                          alt="Preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="object-contain max-h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#a89d91] group-hover:text-[#740707]">
                        <Upload size={20} />
                        <span className="text-[9px] mt-0.5 font-medium">Upload</span>
                      </div>
                    )}
                  </div>

                  {/* Inputs + Upload Button */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={product.bowlImg}
                        onChange={(e) => setProduct({ ...product, bowlImg: e.target.value })}
                        placeholder="/assets/hero-center-rice.png or /uploads/..."
                        className="flex-1 min-w-0 px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs font-mono text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                      <button
                        type="button"
                        disabled={isUploadingBowl}
                        onClick={() => bowlInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                        title="Upload image from your device (Max 20 MB)"
                      >
                        {isUploadingBowl ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={13} />
                            <span>Upload Image</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={product.bowlAlt}
                      onChange={(e) => setProduct({ ...product, bowlAlt: e.target.value })}
                      placeholder="Alt text e.g. Ceramic bowl of aged Basmati rice grains"
                      className="w-full px-3 py-1.5 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>

                {/* Drag & Drop Hint */}
                <div className="text-[10px] text-[#7d7064] flex items-center justify-between pt-1 border-t border-[#e8dfd3]">
                  <span>💡 Drag &amp; drop image here or click Upload</span>
                  <span>Max file size: <strong className="text-[#261c16]">20 MB</strong></span>
                </div>

                <input
                  ref={bowlInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "bowlImg", "Hero Bowls");
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── CARD 3: WEIGHT VARIATIONS ─────────────────────────────────── */}
          <section className="bg-white border-2 border-[#740707]/30 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0e7dc] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#261c16] flex items-center gap-2">
                  <Scale size={19} className="text-[#740707]" />
                  <span>Weight Variations &amp; Packaging Sizes</span>
                </h2>
                <p className="text-xs text-[#6f6257]">
                  Manage retail weights (250g, 500g, 1kg, 5kg) and commercial bulk sacks (10kg, 25kg, 50kg) directly
                  inline on this product page
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Global Currency Selector */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs">
                  <span className="text-[#6f6257] font-semibold text-[11px] whitespace-nowrap">Currency:</span>
                  <select
                    value={product.variations[0]?.currency || newVarCurrency || "NPR"}
                    onChange={(e) => handleApplyCurrencyToAll(e.target.value)}
                    className="bg-transparent font-bold text-[#740707] focus:outline-none cursor-pointer text-xs"
                    title="Set currency for all variations"
                  >
                    <optgroup label="⭐ Priority Currencies">
                      {PRIORITY_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.name})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Global Currencies">
                      {OTHER_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.name})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <span className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#740707]/10 text-[#740707] border border-[#740707]/20">
                  {product.variations.length}{" "}
                  {product.variations.length === 1 ? "Variation" : "Variations"} Configured
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddVariation(!showAddVariation)}
                  className="py-1.5 px-3 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={14} />
                  <span>{showAddVariation ? "Hide Form" : "Add Variation"}</span>
                </button>
              </div>
            </div>

            {/* Quick Add Presets Bar */}
            <div className="p-3 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#6f6257] font-semibold flex items-center gap-1 text-[11px]">
                <Tag size={12} className="text-[#740707]" />
                <span>Quick Add Presets:</span>
              </span>
              {[
                { label: "+ 500 g Pouch", w: "500 g", pkg: "Aroma-Lock Foil Pouch", p: 2.75 },
                { label: "+ 1 kg Bag", w: "1 kg", pkg: "Aroma-Lock Standup Box Bag", p: 4.95 },
                { label: "+ 5 kg Bag", w: "5 kg", pkg: "Heavy Handle Zipper Bag", p: 19.5 },
                { label: "+ 10 kg Sack", w: "10 kg", pkg: "Multi-layer Moisture Sack", p: 36.0 },
                { label: "+ 25 kg Bulk", w: "25 kg", pkg: "Export BOPP Woven Sack", p: 75.0 },
                { label: "+ 50 kg Bulk", w: "50 kg", pkg: "Commercial Container Sack", p: 145.0 },
              ].map(({ label, w, pkg, p }) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleQuickAddPreset(w, pkg, p)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#e2d7c9] hover:border-[#740707] hover:text-[#740707] text-[#261c16] text-[11px] font-medium transition-all"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Inline Add Variation Form */}
            {showAddVariation && (
              <div className="p-4 bg-[#f8f4ed] border-2 border-dashed border-[#740707]/40 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261c16] flex items-center gap-1.5">
                    <Plus size={14} className="text-[#740707]" />
                    <span>Configure New Weight Variation</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddVariation(false)}
                    className="text-xs text-[#7d7064] hover:text-[#261c16]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6f6257] mb-1">Weight Label *</label>
                    <input
                      type="text"
                      value={newVarWeight}
                      onChange={(e) => setNewVarWeight(e.target.value)}
                      placeholder="e.g. 1 kg, 5 kg, 25 kg"
                      className="w-full px-3 py-2 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6f6257] mb-1">
                      Unit Price &amp; Currency *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={newVarCurrency}
                        onChange={(e) => setNewVarCurrency(e.target.value)}
                        className="px-2.5 py-2 bg-white border border-[#e2d7c9] rounded-lg text-xs font-bold text-[#261c16] focus:outline-none focus:border-[#740707] cursor-pointer shrink-0"
                      >
                        <optgroup label="⭐ Priority Currencies">
                          {PRIORITY_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Other Currencies">
                          {OTHER_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </optgroup>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={newVarPrice}
                        onChange={(e) => setNewVarPrice(e.target.value)}
                        placeholder="e.g. 18.50"
                        className="w-full px-3 py-2 bg-white border border-[#e2d7c9] rounded-lg text-xs font-bold text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6f6257] mb-1">SKU Code (optional)</label>
                    <input
                      type="text"
                      value={newVarSku}
                      onChange={(e) => setNewVarSku(e.target.value)}
                      placeholder="Auto-generated if blank"
                      className="w-full px-3 py-2 bg-white border border-[#e2d7c9] rounded-lg text-xs font-mono text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6f6257] mb-1">Packaging Format</label>
                    <input
                      type="text"
                      value={newVarPkg}
                      onChange={(e) => setNewVarPkg(e.target.value)}
                      placeholder="e.g. Aroma-Lock Standup Box Bag, BOPP Woven Sack"
                      className="w-full px-3 py-2 bg-white border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6f6257] mb-1">
                      Min Order Quantity (Units)
                    </label>
                    <div className="inline-flex items-center bg-white border border-[#e2d7c9] rounded-lg p-1">
                      {newVarMoq > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewVarMoq(Math.max(1, newVarMoq - 1))}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#740707] hover:bg-[#faf6f0] transition-all shrink-0"
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>
                      )}
                      <input
                        type="number"
                        min={1}
                        value={newVarMoq}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value);
                          setNewVarMoq(isNaN(parsed) || parsed < 1 ? 1 : parsed);
                        }}
                        className={`w-10 text-center bg-transparent border-0 font-bold text-xs text-[#261c16] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none${newVarMoq <= 1 ? " pl-2" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setNewVarMoq(newVarMoq + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#740707] hover:bg-[#faf6f0] transition-all shrink-0"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-[#40332a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newVarInStock}
                      onChange={(e) => setNewVarInStock(e.target.checked)}
                      className="rounded bg-white border-[#e2d7c9] text-[#740707] focus:ring-0"
                    />
                    <span>Mark variation as currently in stock</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariationSubmit}
                    className="py-2 px-5 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    Add This Variation
                  </button>
                </div>
              </div>
            )}

            {/* Existing Variations Table */}
            <div className="border border-[#e2d7c9] rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf6f0] text-[#6f6257] font-semibold border-b border-[#e2d7c9]">
                    <tr>
                      <th className="py-3 px-3.5">Weight / Size</th>
                      <th className="py-3 px-3.5">Packaging Format</th>
                      <th className="py-3 px-3.5">SKU Identifier</th>
                      <th className="py-3 px-3.5">Unit Price &amp; Currency</th>
                      <th className="py-3 px-3.5">Min Order</th>
                      <th className="py-3 px-3.5 text-center">Stock Status</th>
                      <th className="py-3 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfd3]">
                    {product.variations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#7d7064]">
                          <Scale size={24} className="mx-auto mb-1 opacity-40 text-[#740707]" />
                          <p className="font-semibold text-[#261c16]">No weight variations configured.</p>
                          <p className="text-[11px] text-[#6f6257]">
                            Click &quot;Add Variation&quot; or choose a quick preset above.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      product.variations.map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-[#faf6f0]/60 transition-colors">
                          {/* Weight */}
                          <td className="py-2.5 px-3.5 font-bold text-[#261c16]">
                            <div className="flex items-center gap-1.5">
                              <Tag size={13} className="text-[#740707] shrink-0" />
                              <input
                                type="text"
                                value={v.weight}
                                onChange={(e) => handleUpdateVariationField(v.id, "weight", e.target.value)}
                                className="px-2 py-1 bg-[#faf6f0] border border-[#e2d7c9] rounded text-xs font-bold text-[#261c16] w-24 focus:bg-white focus:border-[#740707]"
                              />
                            </div>
                          </td>

                          {/* Packaging */}
                          <td className="py-2.5 px-3.5 text-[#40332a]">
                            <input
                              type="text"
                              value={v.packageType}
                              onChange={(e) => handleUpdateVariationField(v.id, "packageType", e.target.value)}
                              className="px-2 py-1 bg-[#faf6f0] border border-[#e2d7c9] rounded text-xs text-[#40332a] w-full min-w-[160px] focus:bg-white focus:border-[#740707]"
                            />
                          </td>

                          {/* SKU */}
                          <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#6f6257]">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleUpdateVariationField(v.id, "sku", e.target.value)}
                              className="px-2 py-1 bg-[#faf6f0] border border-[#e2d7c9] rounded text-xs font-mono text-[#6f6257] w-full min-w-[130px] focus:bg-white focus:border-[#740707]"
                            />
                          </td>

                          {/* Price */}
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-1.5 font-semibold text-[#261c16]">
                              <select
                                value={v.currency || "NPR"}
                                onChange={(e) => handleUpdateVariationField(v.id, "currency", e.target.value)}
                                className="px-2 py-1 bg-[#faf6f0] border border-[#e2d7c9] rounded text-xs font-bold text-[#261c16] focus:bg-white focus:border-[#740707] cursor-pointer"
                              >
                                <optgroup label="⭐ Priority Currencies">
                                  {PRIORITY_CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Other Currencies">
                                  {OTHER_CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                  ))}
                                </optgroup>
                              </select>
                              <input
                                type="number"
                                step="0.01"
                                value={v.price}
                                onChange={(e) =>
                                  handleUpdateVariationField(v.id, "price", parseFloat(e.target.value) || 0)
                                }
                                className="px-2 py-1 bg-[#faf6f0] border border-[#e2d7c9] rounded text-xs font-bold text-[#261c16] w-20 focus:bg-white focus:border-[#740707]"
                              />
                            </div>
                          </td>

                          {/* MOQ Stepper */}
                          <td className="py-2.5 px-3.5">
                            <div className="inline-flex items-center justify-center bg-[#faf6f0] border border-[#e2d7c9] rounded-lg p-0.5">
                              {(v.minOrderQty || 1) > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateVariationField(
                                      v.id,
                                      "minOrderQty",
                                      Math.max(1, (v.minOrderQty || 1) - 1)
                                    )
                                  }
                                  className="w-5 h-5 rounded flex items-center justify-center text-[#740707] hover:bg-[#ede4d8] transition-all shrink-0"
                                >
                                  <Minus size={11} strokeWidth={2.5} />
                                </button>
                              )}
                              <input
                                type="number"
                                min={1}
                                value={v.minOrderQty || 1}
                                onChange={(e) => {
                                  const parsed = parseInt(e.target.value);
                                  handleUpdateVariationField(
                                    v.id,
                                    "minOrderQty",
                                    isNaN(parsed) || parsed < 1 ? 1 : parsed
                                  );
                                }}
                                className={`w-8 text-center bg-transparent border-0 font-bold text-xs text-[#261c16] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none${(v.minOrderQty || 1) <= 1 ? " pl-2" : ""}`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateVariationField(v.id, "minOrderQty", (v.minOrderQty || 1) + 1)
                                }
                                className="w-5 h-5 rounded flex items-center justify-center text-[#740707] hover:bg-[#ede4d8] transition-all shrink-0"
                              >
                                <Plus size={11} strokeWidth={2.5} />
                              </button>
                            </div>
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-2.5 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(v.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                v.inStock
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                              }`}
                            >
                              {v.inStock ? "In Stock" : "Out of Stock"}
                            </button>
                          </td>

                          {/* Delete */}
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteVariation(v.id)}
                              title="Delete variation"
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
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
            </div>
          </section>

          {/* ── CARD 4: SPECIFICATIONS & HIGHLIGHTS ───────────────────────── */}
          <section className="bg-white border border-[#e2d7c9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="border-b border-[#f0e7dc] pb-3">
              <h2 className="text-base font-bold text-[#261c16] flex items-center gap-2">
                <Layers size={18} className="text-[#740707]" />
                <span>Technical Specifications &amp; Quality Highlights</span>
              </h2>
              <p className="text-xs text-[#6f6257]">
                Origin metrics, harvest grades, purity certifications, and commercial sales points
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261c16]">Specification Attributes</span>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-semibold text-[#740707] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Row</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {product.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpec(sIdx, "label", e.target.value)}
                        placeholder="Label (e.g. Origin)"
                        className="w-1/3 px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs font-medium text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(sIdx, "value", e.target.value)}
                        placeholder="Value (e.g. 100% Sortex)"
                        className="flex-1 px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(sIdx)}
                        className="p-1.5 rounded-lg text-[#7d7064] hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261c16]">Commercial Key Highlights</span>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-xs font-semibold text-[#740707] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Highlight</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {product.keyHighlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                        placeholder="e.g. Verified harvest provenance with single-estate lot tracking"
                        className="flex-1 px-3 py-1.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-lg text-xs text-[#261c16] focus:outline-none focus:border-[#740707]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        className="p-1.5 rounded-lg text-[#7d7064] hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CARD 5: PUBLICATION & VISIBILITY ─────────────────────────── */}
          <section className="bg-white border border-[#e2d7c9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#f0e7dc] pb-3">
              <h2 className="text-base font-bold text-[#261c16] flex items-center gap-2">
                <Eye size={18} className="text-[#740707]" />
                <span>Publication &amp; Storefront Visibility</span>
              </h2>
              <p className="text-xs text-[#6f6257]">
                Control whether this product and its variations are active and featured on the homepage
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <label className="flex items-start gap-3 p-3.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl cursor-pointer hover:border-[#740707] transition-all">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
                  className="mt-0.5 rounded bg-white border-[#e2d7c9] text-[#740707] focus:ring-0"
                />
                <div>
                  <span className="block text-xs font-bold text-[#261c16]">
                    Product is Active &amp; Published
                  </span>
                  <span className="block text-[11px] text-[#6f6257]">
                    When checked, product and variations appear across the public commodity catalog.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl cursor-pointer hover:border-[#740707] transition-all">
                <input
                  type="checkbox"
                  checked={product.isFeatured}
                  onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                  className="mt-0.5 rounded bg-white border-[#e2d7c9] text-[#740707] focus:ring-0"
                />
                <div>
                  <span className="block text-xs font-bold text-[#261c16]">Featured on Homepage Carousel</span>
                  <span className="block text-[11px] text-[#6f6257]">
                    Promotes this commodity to the main homepage featured products spotlight.
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* ── BOTTOM STICKY SAVE BAR ────────────────────────────────────── */}
          <div className="sticky bottom-4 z-30 p-4 bg-white/95 backdrop-blur-md border border-[#e2d7c9] rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="py-2.5 px-4 rounded-xl bg-[#faf6f0] hover:bg-[#ede4d8] border border-[#e2d7c9] text-xs font-semibold text-[#6f6257] transition-all"
              >
                Back to Catalog
              </Link>
              <span className="hidden sm:inline text-xs text-[#7d7064]">
                Editing{" "}
                <span className="font-semibold text-[#261c16]">{product.name || "New Commodity"}</span> with{" "}
                <span className="font-semibold text-[#740707]">{product.variations.length}</span> weight options
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#740707]/30 border border-[#a81414]/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{isSaving ? "Saving..." : "Save Product Details & Weight Variations"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
