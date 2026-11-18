"use client";

import React, { useState, useEffect } from "react";
import { Database, CheckCircle, AlertTriangle, RefreshCw, Zap, Server, Shield, Copy, Check, Terminal, Play } from "lucide-react";

export default function NeonDbManager() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customConnStr, setCustomConnStr] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/neon");
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      console.error("Neon status error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const addLog = (msg: string) => {
    setActionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const handleTestConnection = async () => {
    setActiveAction("test");
    addLog("Pinging Neon Database via serverless HTTP proxy...");
    try {
      const res = await fetch("/api/admin/neon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", connectionString: customConnStr || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`SUCCESS: ${data.message} (Server Time: ${data.serverTime})`);
      } else {
        addLog(`FAILED: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    } finally {
      setActiveAction(null);
      fetchStatus();
    }
  };

  const handleMigrateSchema = async () => {
    if (!confirm("Run DDL migration to create 'monagrow_products', 'monagrow_weight_variations', 'monagrow_site_content', and 'monagrow_media' tables in Neon?")) return;

    setActiveAction("migrate");
    addLog("Executing DDL Schema Migration in Neon DB...");
    try {
      const res = await fetch("/api/admin/neon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "migrate", connectionString: customConnStr || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        addLog("SUCCESS: All 4 tables created/verified successfully in Neon!");
      } else {
        addLog(`FAILED: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    } finally {
      setActiveAction(null);
      fetchStatus();
    }
  };

  const handleSyncToNeon = async () => {
    setActiveAction("sync");
    addLog("Syncing all 18 products, weight variations, and site content into Neon DB...");
    try {
      const res = await fetch("/api/admin/neon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", connectionString: customConnStr || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`SUCCESS: Synced ${data.syncedProducts} products and ${data.syncedContentSections} content sections to Neon!`);
      } else {
        addLog(`FAILED: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    } finally {
      setActiveAction(null);
      fetchStatus();
    }
  };

  const sampleEnvText = `DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"`;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(sampleEnvText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2d7c9]">
        <div>
          <h2 className="text-lg font-bold text-[#261c16] flex items-center gap-2">
            <Database size={19} className="text-[#a81414]" />
            <span>Neon Database Integration &amp; Cloud Sync</span>
          </h2>
          <p className="text-xs text-[#6f6257]">
            Serverless PostgreSQL architecture powered by Neon for instant scaling, branching, and real-time syncing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStatus}
            className="p-2.5 rounded-xl bg-[#ede4d8] hover:bg-[#ede4d8] text-[#40332a] hover:text-[#261c16] transition-colors"
            title="Refresh status"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Grid: Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Connection State */}
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6f6257] font-medium">Connection State</span>
            <Server size={16} className="text-[#6f6257]" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status?.isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-sm font-bold text-[#261c16]">
              {status?.isConfigured ? "Live Neon DB" : "Standby (Local Store)"}
            </span>
          </div>
          <p className="text-[11px] text-[#7d7064]">
            {status?.isConfigured
              ? `Host: ${status?.host}`
              : "Zero-dependency local persistence active. Add DATABASE_URL to connect."}
          </p>
        </div>

        {/* Card 2: Tables Status */}
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6f6257] font-medium">Database Schema</span>
            <Shield size={16} className="text-[#6f6257]" />
          </div>
          <div className="text-sm font-bold text-[#261c16] flex items-center gap-1.5">
            {status?.tablesInitialized ? (
              <>
                <CheckCircle size={15} className="text-emerald-400" />
                <span>4 Tables Verified</span>
              </>
            ) : (
              <>
                <AlertTriangle size={15} className="text-amber-400" />
                <span>Ready to Migrate</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#7d7064]">
            products, variations, site_content, media
          </p>
        </div>

        {/* Card 3: Products Synced */}
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6f6257] font-medium">Commodity Records</span>
            <Zap size={16} className="text-[#6f6257]" />
          </div>
          <div className="text-sm font-bold text-[#261c16]">
            {status?.localProductsCount || 18} Products Tracked
          </div>
          <p className="text-[11px] text-[#7d7064]">
            {status?.localMediaCount || 12} Registered Media Assets
          </p>
        </div>

        {/* Card 4: Last Sync */}
        <div className="bg-white border border-[#e2d7c9] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6f6257] font-medium">Last Cloud Sync</span>
            <RefreshCw size={16} className="text-[#6f6257]" />
          </div>
          <div className="text-sm font-bold text-[#261c16] truncate">
            {status?.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleTimeString() : "Pending First Sync"}
          </div>
          <p className="text-[11px] text-[#7d7064]">
            Automatic 2-way sync enabled
          </p>
        </div>
      </div>

      {/* Action Center */}
      <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#261c16] mb-1">Neon Database Controls</h3>
          <p className="text-xs text-[#6f6257]">
            You can test the connection, run schema migrations, and sync all products to Neon directly from here.
          </p>
        </div>

        {/* Custom Connection String Input (Optional override) */}
        <div>
          <label className="block text-xs font-medium text-[#40332a] mb-1.5">
            Neon Connection String (or set in <code className="text-[#ff8080]">.env.local</code> as <code className="text-[#ff8080]">DATABASE_URL</code>)
          </label>
          <input
            type="password"
            value={customConnStr}
            onChange={(e) => setCustomConnStr(e.target.value)}
            placeholder="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"
            className="w-full px-3.5 py-2.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl text-xs text-white font-mono placeholder-[#9c8e82] focus:outline-none focus:border-[#740707]"
          />
          <span className="text-[11px] text-[#7d7064] mt-1 block">
            Leave blank to use the active <code className="text-[#40332a]">process.env.DATABASE_URL</code>, or paste your connection string here to test.
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleTestConnection}
            disabled={activeAction !== null}
            className="py-2.5 px-4 rounded-xl bg-[#ede4d8] hover:bg-[#e2d7c9] text-[#261c16] text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play size={13} className="text-emerald-400" />
            <span>{activeAction === "test" ? "Testing..." : "1. Test Connection"}</span>
          </button>

          <button
            onClick={handleMigrateSchema}
            disabled={activeAction !== null}
            className="py-2.5 px-4 rounded-xl bg-[#ede4d8] hover:bg-[#e2d7c9] text-[#261c16] text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Shield size={13} className="text-sky-400" />
            <span>{activeAction === "migrate" ? "Migrating..." : "2. Initialize Tables in Neon"}</span>
          </button>

          <button
            onClick={handleSyncToNeon}
            disabled={activeAction !== null}
            className="py-2.5 px-5 rounded-xl bg-[#740707] hover:bg-[#880a0a] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#740707]/30 transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={activeAction === "sync" ? "animate-spin" : ""} />
            <span>{activeAction === "sync" ? "Syncing..." : "3. Sync All Data to Neon"}</span>
          </button>
        </div>

        {/* Activity & Execution Console */}
        <div className="p-4 bg-[#f6efe6] border border-[#e2d7c9] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6f6257] border-b border-[#e8dfd3] pb-2">
            <span className="flex items-center gap-1.5 font-mono">
              <Terminal size={14} className="text-[#a81414]" />
              <span>Neon DB Execution Console</span>
            </span>
            <span className="text-[10px]">Real-time query output</span>
          </div>

          <div className="font-mono text-xs text-[#a0a6b5] space-y-1 max-h-40 overflow-y-auto">
            {actionLog.length === 0 ? (
              <p className="text-[#9c8e82] italic">Ready. Click &quot;Test Connection&quot; or &quot;Sync All Data to Neon&quot; to begin.</p>
            ) : (
              actionLog.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Guide: How to connect Neon DB */}
      <div className="bg-white border border-[#e2d7c9] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#261c16] flex items-center gap-2">
          <Database size={16} className="text-[#ff8080]" />
          <span>How to obtain your free Neon Database URL</span>
        </h3>

        <ol className="text-xs text-[#6f6257] space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            Visit <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-[#ff8080] hover:underline">neon.tech</a> and sign up or log in.
          </li>
          <li>
            Create a new project (e.g. named <code className="text-[#261c16]">monagrow-db</code>) in your preferred AWS region.
          </li>
          <li>
            On your Neon project dashboard, copy the <strong>Connection String</strong> (looks like <code className="text-[#261c16]">postgresql://alex:...@ep-....neon.tech/neondb?sslmode=require</code>).
          </li>
          <li>
            Add it to your <code className="text-[#261c16] font-mono">.env.local</code> file in this project root:
          </li>
        </ol>

        <div className="relative p-3.5 bg-[#faf6f0] border border-[#e2d7c9] rounded-xl font-mono text-xs text-[#e1e4ea] flex items-center justify-between">
          <span className="truncate pr-4">{sampleEnvText}</span>
          <button
            onClick={copyEnvSnippet}
            className="p-1.5 rounded-lg bg-[#ede4d8] hover:bg-[#e2d7c9] text-[#40332a] hover:text-[#261c16] shrink-0 transition-colors"
            title="Copy environment variable snippet"
          >
            {copiedEnv ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
