"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ship, Package, ShieldCheck, Clock, FileText, RefreshCw, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";

export default function ShippingReturnsPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState("Monagrow Bulk Freight");

  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedCommodity(productName || "Monagrow Bulk Freight");
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF8F5] text-[#30241e] selection:bg-[#740707] selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar onOpenQuoteModal={handleOpenQuoteModal} immersiveHero={false} />

      {/* 2. Main Content */}
      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#740707] hover:text-[#500505] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          {/* Page Header */}
          <header className="mb-12 border-b border-[#e5ddd3] pb-8">
            <p className="text-xs sm:text-sm font-bold tracking-widest text-[#740707] uppercase mb-3">
              Trade Logistics &amp; Commercial Terms
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#30241e] leading-tight">
              Shipping &amp; Returns Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#554740] leading-relaxed max-w-2xl">
              Monagrow manages maritime container dispatch and bulk freight for international agricultural trade. Here is a clear overview of our commercial shipment procedures, delivery terms, and quality resolution protocols.
            </p>
          </header>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <Ship className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Global Port Freight</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                20ft (~25 MT) &amp; 40ft (~27 MT) FCL container dispatch on FOB, CIF, or CFR terms.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <ShieldCheck className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Pre-Dispatch Inspection</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                Third-party SGS or ISO accredited pre-shipment COA and phytosanitary certificate verified.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <RefreshCw className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Claims &amp; Settlement</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                Standardized 14-day destination port arrival inspection and dispute resolution procedures.
              </p>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#40342e]">
            {/* 1. International Shipping & Delivery Terms */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Package className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">1. International Shipping Terms</h2>
              </div>
              <p>
                All wholesale agricultural commodities (Basmati Rice, Estate Coffee, Royal Mixed Dry Fruits, and Refined Sugar) are packed at origin and dispatched through designated deepwater container ports.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#554740]">
                <li><strong>FOB (Free on Board):</strong> Monagrow manages origin transport, port clearance, export customs documentation, and container loading onto the vessel.</li>
                <li><strong>CIF (Cost, Insurance &amp; Freight):</strong> Monagrow covers ocean freight to your destination port, along with comprehensive marine cargo insurance.</li>
                <li><strong>CFR (Cost &amp; Freight):</strong> Ocean freight is coordinated to the buyer&apos;s specified discharge port.</li>
                <li><strong>Lead Times:</strong> Standard container stuffing and vessel dispatch occur within 10 to 18 business days from commercial contract confirmation and letter of credit (LC) validation.</li>
              </ul>
            </section>

            {/* 2. Packaging & Lot Traceability */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <FileText className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">2. Commercial Packaging &amp; Lot Documentation</h2>
              </div>
              <p>
                Each consignment is packaged according to your trade specification and labeled with standardized batch and harvest lot numbers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#554740]">
                <li><strong>Retail Packaging:</strong> 1 kg, 2.5 kg, and 5 kg multi-barrier stand-up pouches and nitrogen-flushed BOPP bags.</li>
                <li><strong>Bulk Wholesale:</strong> 20 kg, 25 kg, and 50 kg heavy-duty woven polypropylene (PP) sacks with moisture barriers.</li>
                <li><strong>Shipping Dossier:</strong> Every shipment is accompanied by a Digital Bill of Lading, Certificate of Origin, Phytosanitary Certificate, Commercial Invoice, Packing List, and certified Lab Analysis Report.</li>
              </ul>
            </section>

            {/* 3. Return & Discrepancy Claims Policy */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <RefreshCw className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">3. Quality Claims &amp; Dispute Resolution</h2>
              </div>
              <p>
                Due to the biological and perishable nature of agricultural food commodities, physical returns of containerized ocean cargo to origin are generally impractical. In the rare event of quality discrepancy, we enforce a transparent commercial resolution policy:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#554740]">
                <li><strong>Notice Window:</strong> Written notification of any specification discrepancy (e.g., moisture deviation, broken grain percentage) must be lodged within <strong>14 calendar days</strong> of vessel discharge at the destination port.</li>
                <li><strong>Joint Inspection:</strong> A report from an internationally recognized independent surveyor (such as SGS, Bureau Veritas, or Intertek) at the destination port must verify the variance against contract specifications.</li>
                <li><strong>Resolution Options:</strong> Upon verified surveyor findings, Monagrow will provide a negotiated credit note, replacement container dispatch, or appropriate commercial settlement per standard GAFTA / international commodity trade rules.</li>
              </ul>
            </section>

            {/* 4. Tracking & Support Desk */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Clock className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">4. Real-Time Tracking &amp; Vessel Coordination</h2>
              </div>
              <p>
                Our Dubai and origin logistics desk provides ongoing container status updates and automated digital bill of lading tracking until cargo arrives safely at your port of destination.
              </p>
            </section>
          </div>

          {/* Action CTA Block */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-[#740707] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Have a shipment question?</h3>
              <p className="mt-2 text-white/80 text-sm max-w-md">
                Contact our commercial logistics desk or request an all-inclusive FOB/CIF freight quote for your target port.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenQuoteModal("Commercial Freight & Quote")}
                className="px-6 py-3 rounded-full bg-white text-[#740707] font-bold text-sm hover:bg-[#f5ece6] transition-colors shadow-md"
              >
                Request a Quote
              </button>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Contact Logistics</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Global Footer */}
      <Footer onOpenQuoteModal={handleOpenQuoteModal} />

      {/* 4. Interactive Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCommodity={selectedCommodity}
      />
    </div>
  );
}
