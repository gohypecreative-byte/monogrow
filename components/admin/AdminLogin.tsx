"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
}

// Monagrow Admin Portal Login Component
export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-[#261c16]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3 select-none" aria-label="Monagrow Home">
            <Image
              src="/assets/monagrow-official-logo.png"
              alt="Monagrow Logo"
              width={260}
              height={130}
              priority
              unoptimized
              className="h-16 sm:h-20 w-auto mx-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#261c16] mb-1.5 font-sans">
            ADMIN PORTAL
          </h1>
          <p className="text-sm text-[#6f6257]">
            Wholesale Commodity &amp; Website Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-[#e2d7c9] rounded-2xl p-7 shadow-xl">
          <div className="mb-6 pb-4 border-b border-[#e8dfd3]">
            <h2 className="text-base font-semibold text-[#261c16]">Administrator Sign In</h2>
            <p className="text-xs text-[#7d7064]">Authorized personnel only</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-[#40332a] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7064]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="monagrow@gmail.com"
                  autoComplete="off"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf6f0] border border-[#ded3c4] rounded-xl text-sm text-[#261c16] placeholder-[#9c8e82] focus:outline-none focus:border-[#740707] focus:ring-1 focus:ring-[#740707] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40332a] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7064]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#faf6f0] border border-[#ded3c4] rounded-xl text-sm text-[#261c16] placeholder-[#9c8e82] focus:outline-none focus:border-[#740707] focus:ring-1 focus:ring-[#740707] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d7064] hover:text-[#261c16] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#740707] to-[#8f0b0b] hover:from-[#5e0606] hover:to-[#740707] text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#740707]/20 border border-[#5e0606] transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#e8dfd3] text-center">
            <p className="text-[11px] text-[#7d7064]">
              Monagrow International Wholesale Trading Portal &bull; Protected Route
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
