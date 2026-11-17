"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones, Mail, Phone, Clock, MessageSquare, HelpCircle, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";

const FAQS = [
  {
    q: "What is Monagrow's Minimum Order Quantity (MOQ)?",
    a: "Our standard wholesale minimum order is a trial 20ft container (approx. 25 MT for rice and sugar, approx. 18-20 MT for green coffee beans, or mixed dry fruits pallet allocations). For established partners, we coordinate multi-container annual supply agreements with staggered monthly deliveries.",
  },
  {
    q: "Do you offer private labeling or custom packaging?",
    a: "Yes. In addition to our flagship Monagrow retail branding (1 kg, 2.5 kg, and 5 kg premium packaging), our origin packing facilities can provide customized buyer-branded BOPP, stand-up pouches, or 25 kg/50 kg bulk woven polypropylene bags per your specifications.",
  },
  {
    q: "What documentation is provided with wholesale orders?",
    a: "Every shipment includes a full shipping dossier: Certificate of Origin, Phytosanitary Certificate, SGS or ISO-certified Laboratory Certificate of Analysis (COA), Commercial Invoice, Packing List, and Clean on Board Ocean Bill of Lading.",
  },
  {
    q: "What payment terms does Monagrow accept?",
    a: "We accommodate standard international commodity trade instruments, including Irrevocable Letter of Credit (LC at Sight) issued by a prime international bank, or Telegraphic Transfer (TT: 30% advance deposit with balance upon presentation of shipping document copies).",
  },
  {
    q: "How can I request product samples before placing a commercial order?",
    a: "Qualified wholesale buyers and commercial procurement managers can request courier-delivered inspection samples (grain length, moisture, roast profile, or nut grade) by contacting our trade desk directly.",
  },
];

export default function CustomerSupportPage() {
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
              Commercial Trade Desk Support
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#30241e] leading-tight">
              Customer Support
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#554740] leading-relaxed max-w-2xl">
              We provide dedicated commercial support for importers, food manufacturers, distributors, and supermarket chains worldwide. Connect with our commodity desk or explore frequently asked questions.
            </p>
          </header>

          {/* Direct Support Channels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
            <div className="p-6 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#740707]/10 flex items-center justify-center text-[#740707]">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#30241e]">Direct Phone Line</h3>
                <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                  Call our trade desk directly for urgent spot inquiries and container updates.
                </p>
              </div>
              <a
                href="tel:+97153462527"
                className="text-sm font-bold text-[#740707] hover:underline inline-flex items-center gap-1"
              >
                +971 53 462 527 <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#740707]/10 flex items-center justify-center text-[#740707]">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#30241e]">Commercial Email</h3>
                <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                  Send requests for quotations (RFQ), specifications, and proforma inquiries.
                </p>
              </div>
              <a
                href="mailto:commercial@monagrow.com"
                className="text-sm font-bold text-[#740707] hover:underline inline-flex items-center gap-1"
              >
                commercial@monagrow.com <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#740707]/10 flex items-center justify-center text-[#740707]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#30241e]">Desk Hours</h3>
                <p className="text-xs sm:text-sm text-[#665750] leading-relaxed">
                  Sunday – Friday: 8:00 AM – 6:00 PM (GST, Gulf Standard Time).
                </p>
              </div>
              <span className="text-xs font-semibold text-[#8a7a72]">
                Dubai Global Trade Operations
              </span>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-14">
            <div className="flex items-center gap-2.5 mb-6 text-[#740707]">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#30241e]">
                Frequently Asked Trade Questions
              </h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-2"
                >
                  <h3 className="text-base sm:text-lg font-bold text-[#30241e]">
                    {faq.q}
                  </h3>
                  <p className="text-sm sm:text-base text-[#554740] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Action CTA Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#740707] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Need assistance with your commercial order?</h3>
              <p className="mt-2 text-white/80 text-sm max-w-md">
                Our assigned trade account specialists respond to new wholesale inquiries within 24 business hours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenQuoteModal("Commercial Account Support")}
                className="px-6 py-3 rounded-full bg-white text-[#740707] font-bold text-sm hover:bg-[#f5ece6] transition-colors shadow-md"
              >
                Request Support Quote
              </button>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Full Contact Page</span>
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
