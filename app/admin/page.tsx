"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsManager from "@/components/admin/ProductsManager";
import ContentManager from "@/components/admin/ContentManager";
import MediaManager from "@/components/admin/MediaManager";
import NeonDbManager from "@/components/admin/NeonDbManager";
import { Package, FileText, Image as ImageIcon, Database, Shield, Loader2, Sparkles } from "lucide-react";
import { AdminProduct, SiteContent, MediaAsset } from "@/lib/db";

export default function AdminPage() {
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"products" | "content" | "media" | "neon" | "account">("products");

  // Data states
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [neonStatus, setNeonStatus] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Load all data
  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [prodRes, contentRes, mediaRes, neonRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/content"),
        fetch("/api/admin/media"),
        fetch("/api/admin/neon"),
      ]);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData.products || []);
      }
      if (contentRes.ok) {
        const cData = await contentRes.json();
        setContent(cData.content);
      }
      if (mediaRes.ok) {
        const mData = await mediaRes.json();
        setMedia(mData.registered || []);
      }
      if (neonRes.ok) {
        const nData = await neonRes.json();
        setNeonStatus(nData.status);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Check auth on load
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setSession(data.user);
          loadAllData();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setSession(null);
  };

  // Loading spinner while verifying authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6efe6]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#740707] mx-auto" />
          <p className="text-xs text-[#6f6257] font-medium tracking-wide">
            Verifying Monagrow Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in -> Render login form
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setSession(user);
          loadAllData();
        }}
      />
    );
  }

  // Logged in -> Render Admin Dashboard
  const navTabs = [
    { key: "products", label: "Products & Variations", icon: Package, badge: products.length },
    { key: "content", label: "Website Content", icon: FileText, badge: "Live" },
    { key: "media", label: "Images & Media", icon: ImageIcon, badge: media.length },
    {
      key: "neon",
      label: "Neon Database",
      icon: Database,
      badge: neonStatus?.isConfigured ? "Connected" : "Standby",
      badgeColor: neonStatus?.isConfigured ? "emerald" : "amber",
    },
    { key: "account", label: "Security & Account", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f6efe6] text-[#261c16]">
      {/* 1. Header */}
      <AdminHeader
        user={session}
        neonConnected={Boolean(neonStatus?.isConfigured)}
        onSelectTab={(tab) => setActiveTab(tab as any)}
        onLogout={handleLogout}
      />

      {/* 2. Main Body with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          <div className="p-3 bg-white border border-[#e2d7c9] shadow-sm rounded-2xl mb-4">
            <span className="text-[11px] font-mono text-[#7d7064] uppercase block mb-1">Signed In As</span>
            <span className="text-xs font-bold text-[#261c16] block truncate">{session.email}</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Full Access &bull; Super Admin</span>
            </span>
          </div>

          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? "bg-[#740707] text-white border-[#5e0606] shadow-md shadow-[#740707]/20"
                      : "bg-white text-[#6f6257] border-[#e2d7c9] hover:bg-[#ede4d8] hover:text-[#261c16]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-white" : "text-[#7d7064]"} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : tab.badgeColor === "emerald"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : tab.badgeColor === "amber"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-[#ede4d8] text-[#6f6257]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Tab Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === "products" && (
            <ProductsManager
              products={products}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "content" && content && (
            <ContentManager
              initialContent={content}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "media" && (
            <MediaManager
              media={media}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "neon" && (
            <NeonDbManager />
          )}

          {activeTab === "account" && (
            <div className="bg-white border border-[#e2d7c9] shadow-sm rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#261c16] mb-1">Administrator Profile &amp; Security</h2>
                <p className="text-xs text-[#6f6257]">Credentials and direct portal access settings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#f8f4ed] border border-[#e8dfd3] rounded-xl space-y-1">
                  <span className="text-[#7d7064] block text-[11px]">Primary Email</span>
                  <span className="font-semibold text-[#261c16] text-sm">{session.email}</span>
                </div>

                <div className="p-4 bg-[#f8f4ed] border border-[#e8dfd3] rounded-xl space-y-1">
                  <span className="text-[#7d7064] block text-[11px]">Role</span>
                  <span className="font-semibold text-emerald-700 text-sm">Super Administrator</span>
                </div>

                <div className="p-4 bg-[#f8f4ed] border border-[#e8dfd3] rounded-xl space-y-1">
                  <span className="text-[#7d7064] block text-[11px]">Direct Route</span>
                  <span className="font-mono text-[#740707] font-semibold text-sm">/admin</span>
                </div>

                <div className="p-4 bg-[#f8f4ed] border border-[#e8dfd3] rounded-xl space-y-1">
                  <span className="text-[#7d7064] block text-[11px]">Public Website Buttons</span>
                  <span className="font-semibold text-amber-800 text-sm">Hidden (Direct Access Only)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2d7c9] flex justify-end">
                <button
                  onClick={handleLogout}
                  className="py-2.5 px-5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold transition-all"
                >
                  Sign Out from Session
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
