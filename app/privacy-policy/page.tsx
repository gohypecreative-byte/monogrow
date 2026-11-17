"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileCheck, Eye, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";

export default function PrivacyPolicyPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState("Monagrow Bulk Commodities");

  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedCommodity(productName || "Monagrow Bulk Commodities");
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
              Corporate Governance &amp; Data Security
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#30241e] leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#554740] leading-relaxed max-w-2xl">
              Monagrow is committed to safeguarding the commercial confidentiality and personal data of our wholesale clients, prospective buyers, and site visitors. This policy outlines how information is gathered, managed, and protected.
            </p>
            <p className="mt-2 text-xs text-[#8a7a72]">
              Last updated: November 2026
            </p>
          </header>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <Lock className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Trade Confidentiality</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                Commercial contract volumes, pricing structures, and specifications are strictly confidential.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <Eye className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Zero Data Selling</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                We never monetize, rent, or trade your corporate information with external marketing brokers.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col gap-2">
              <FileCheck className="w-6 h-6 text-[#740707]" />
              <h3 className="font-bold text-[#30241e] text-base">Regulatory Compliance</h3>
              <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                Adherence to UAE international trade data protection regulations and applicable international standards.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#40342e]">
            {/* 1. Information Collection */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Shield className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">1. Information We Collect</h2>
              </div>
              <p>
                When you interact with the Monagrow website or request a commercial commodity quotation, we collect relevant information necessary to facilitate international trade:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#554740]">
                <li><strong>Commercial Contact Details:</strong> Name, corporate email address, business telephone number, company name, and country of registration.</li>
                <li><strong>Trade Inquiries &amp; Specifications:</strong> Commodity category of interest (Basmati Rice, Estate Coffee, Royal Dry Fruits, or Refined Sugar), required volumes (metric tons / containers), packaging preferences, and destination discharge ports.</li>
                <li><strong>Transaction Records:</strong> Proforma invoices, letters of credit (LC) records, bill of lading documentation, and commercial communication histories.</li>
                <li><strong>Technical Data:</strong> Anonymized browser information, device specifications, and standard web server traffic logs for security and performance optimization.</li>
              </ul>
            </section>

            {/* 2. How We Use Information */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <FileCheck className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">2. How We Use Your Commercial Data</h2>
              </div>
              <p>
                Collected data is used solely to execute and support wholesale commercial trade relationships:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#554740]">
                <li>Generating accurate, timely freight and commodity quotations (FOB, CIF, CFR).</li>
                <li>Fulfilling contracted export shipments and preparing shipping dossiers (Certificate of Origin, Phytosanitary, SGS/ISO COA).</li>
                <li>Communicating vessel tracking updates, pre-shipment inspection notices, and dispatch timelines.</li>
                <li>Maintaining compliance with international anti-money laundering (AML), sanctions screening, and customs documentation requirements.</li>
              </ul>
            </section>

            {/* 3. Data Protection & Storage */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Lock className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">3. Data Security &amp; Storage Protocols</h2>
              </div>
              <p>
                Monagrow employs enterprise-grade transport layer security (TLS/SSL encryption), restricted access controls, and audited cloud storage infrastructure to ensure all commercial client information is shielded from unauthorized access, alteration, or disclosure.
              </p>
            </section>

            {/* 4. Cookies & Web Tracking */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Eye className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">4. Functional Cookies</h2>
              </div>
              <p>
                Our website utilizes essential session cookies required for core navigation, quote modal forms, and interface responsiveness. We do not deploy intrusive third-party behavioural ad-tracking networks.
              </p>
            </section>

            {/* 5. Contacting Our Data Officer */}
            <section className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#740707]">
                <Mail className="w-5 h-5 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#30241e]">5. Data Rights &amp; Privacy Contact</h2>
              </div>
              <p>
                Commercial partners and website users have the right to request access to, rectification of, or deletion of their personal records held by Monagrow. For privacy inquiries or requests, contact our legal and compliance desk:
              </p>
              <div className="p-4 rounded-xl bg-[#FCF8F5] border border-[#e8e2d8] inline-block">
                <p className="font-bold text-[#30241e]">Monagrow Legal &amp; Compliance</p>
                <a
                  href="mailto:privacy@monagrow.com"
                  className="text-[#740707] font-semibold hover:underline"
                >
                  privacy@monagrow.com
                </a>
              </div>
            </section>
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
