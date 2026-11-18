"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Database, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  user: { email: string; name: string; role: string };
  neonConnected: boolean;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export default function AdminHeader({ user, neonConnected, onSelectTab, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf7]/95 backdrop-blur-md border-b border-[#e2d7c9] px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Brand & Direct Route Indicator */}
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center select-none group" title="Return to Monagrow homepage">
          <Image
            src="/assets/monagrow-official-logo.png"
            alt="Monagrow"
            width={160}
            height={80}
            priority
            unoptimized
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
        <div className="flex items-center gap-2 pl-2 border-l border-[#e2d7c9]">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#740707] text-white tracking-wider">
            ADMIN
          </span>
          <span className="hidden sm:inline text-[11px] text-[#7d7064] font-mono">/admin portal</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Neon Status Badge */}
        <button
          onClick={() => onSelectTab("neon")}
          title="Click to manage Neon DB settings"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            neonConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
          }`}
        >
          <Database size={13} />
          <span>{neonConnected ? "Neon DB: Connected" : "Neon DB: Standby"}</span>
          <span className={`w-2 h-2 rounded-full ${neonConnected ? "bg-emerald-600 animate-pulse" : "bg-amber-500"}`} />
        </button>

        {/* View Live Website Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6f6257] bg-white border border-[#e2d7c9] hover:bg-[#ede4d8] hover:text-[#261c16] transition-all shadow-sm"
        >
          <span>View Site</span>
          <ExternalLink size={12} />
        </Link>

        {/* User Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2d7c9] text-xs shadow-sm">
          <div className="w-5 h-5 rounded-full bg-[#740707] flex items-center justify-center text-[10px] font-bold text-white">
            S
          </div>
          <span className="text-[#261c16] font-medium">{user.email}</span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all shadow-sm"
          title="Sign out of Admin Dashboard"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
