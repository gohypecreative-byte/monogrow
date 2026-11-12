"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Headphones,
  Zap,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

interface ContactSectionProps {
  onOpenQuoteModal?: (productName?: string) => void;
}

const PRODUCTS_LIST = [
  "Basmati Rice (1121 Supreme Long Grain)",
  "Pure Refined Sugar (ICUMSA 45)",
  "Specialty Estate Coffee (Arabica Dark Roast)",
  "Royal Jumbo Cashews (W240 Whole)",
  "Royal Mixed Dry Fruits (4-in-1)",
  "Katarni Premium Fragrant Rice",
  "Mixed Container / Full Agro Portfolio",
  "Custom Commodity Sourcing Enquiry",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Germany",
  "Canada",
  "Australia",
  "Singapore",
  "Nepal",
  "India",
  "France",
  "Netherlands",
  "Italy",
  "Japan",
  "South Korea",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "South Africa",
  "Kenya",
  "Malaysia",
  "New Zealand",
  "Switzerland",
  "Belgium",
  "Spain",
  "Turkey",
  "Other International Market",
];

const INPUT_CLS =
  "w-full px-4 py-3 rounded-2xl border border-[#E8DDD4] bg-[#FDFAF7] hover:border-[#C9B8AD] focus:bg-white focus:border-[#740707] focus:ring-2 focus:ring-[#740707]/10 outline-none transition-all duration-200 text-[#1C1A16] placeholder:text-[#B5A99E] text-[13.5px] font-sans";

const SELECT_CLS =
  "w-full px-4 py-3 pr-11 rounded-2xl border border-[#E8DDD4] bg-[#FDFAF7] hover:border-[#C9B8AD] focus:bg-white focus:border-[#740707] focus:ring-2 focus:ring-[#740707]/10 outline-none transition-all duration-200 text-[#1C1A16] text-[13.5px] font-sans appearance-none cursor-pointer";

const LABEL_CLS = "block text-[12.5px] font-semibold text-[#4A3F38] mb-2 tracking-wide uppercase font-sans";

export default function ContactSection({ onOpenQuoteModal }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    country: "United States",
    product: PRODUCTS_LIST[0],
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <section
      id="contact-section"
      className="relative w-full bg-[#FBF7F3] pt-28 sm:pt-36 pb-24 sm:pb-32 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* ════════════════════════════════
          BACKGROUND DECORATIONS
          ════════════════════════════════ */}

      {/* Large ambient glow top-left */}
      <div className="absolute -top-32 -left-48 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(220,100,80,0.07)_0%,transparent_65%)] blur-3xl pointer-events-none" />
      {/* Right side warm glow */}
      <div className="absolute top-[25%] -right-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(230,190,170,0.18)_0%,transparent_65%)] blur-3xl pointer-events-none" />
      {/* Bottom warm glow */}
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(240,215,200,0.22)_0%,transparent_65%)] blur-3xl pointer-events-none" />

      {/* Decorative corner grain texture circles */}
      <div className="absolute top-20 right-[8%] w-56 h-56 rounded-full border border-[#E4D5C8]/50 opacity-60 pointer-events-none" />
      <div className="absolute top-24 right-[8.8%] w-40 h-40 rounded-full border border-[#E4D5C8]/30 opacity-50 pointer-events-none" />

      {/* Bottom-left blush wave */}
      <svg
        className="absolute bottom-0 left-0 w-[320px] sm:w-[480px] md:w-[600px] h-auto pointer-events-none select-none opacity-80"
        viewBox="0 0 600 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-60 280C40 195 160 250 270 170C360 103 460 148 540 90C570 72 590 42 620 0V280H-60Z"
          fill="url(#cw1)"
        />
        <path
          d="M-60 280C30 215 130 230 230 192C310 160 390 195 470 148C515 122 555 128 610 85V280H-60Z"
          fill="url(#cw2)"
        />
        <defs>
          <linearGradient id="cw1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C3B8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5E0D8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="cw2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0D0C5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FAF0EB" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* ════════════════════════════════
          CONTAINER
          ════════════════════════════════ */}
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── PAGE HEADER ── */}
        <div className="text-center max-w-[680px] mx-auto mb-16 sm:mb-20">
          <h1
            id="contact-heading"
            className="font-serif font-bold text-[clamp(36px,5vw,62px)] leading-[1.08] tracking-tight text-[#1C1A16] mb-4"
          >
            Get In Touch <span className="text-[#740707]">With Us</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#6B6059] leading-[1.7] font-sans">
            Fill in your details below. Our team will respond with certified lot metrics
            and pricing.
          </p>
        </div>

        {/* ── MAIN TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 xl:gap-16 items-start">

          {/* ══════════════════════════════════════
              LEFT PANEL — single cohesive flow, no stacked cards
              ══════════════════════════════════════ */}
          <div className="flex flex-col items-center lg:items-start gap-10">

            {/* 3D Visual — no card wrapper, floats directly on page bg */}
            <div className="relative w-[200px] sm:w-[240px] aspect-[624/648]">
              <Image
                src="/assets/contact-3d-visual-clean.png"
                alt="Contact Monagrow"
                fill
                priority
                className="object-contain drop-shadow-[0_28px_56px_rgba(116,7,7,0.12)]"
                sizes="240px"
              />
            </div>

            {/* Trust props — flat list, no card */}
            <div className="w-full space-y-6">
              {[
                { Icon: Headphones, title: "Need Help?", desc: "We're here to assist you" },
                { Icon: Zap, title: "Quick Response", desc: "Within 24 Hours" },
                { Icon: ShieldCheck, title: "Trusted Partner", desc: "For Your Business" },
              ].map(({ Icon, title, desc }, i, arr) => (
                <div
                  key={title}
                  className={`flex items-center gap-4${i < arr.length - 1 ? " pb-6 border-b border-[#EBE1D9]" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F5EDE7] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#740707]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-[14.5px] text-[#1C1A16]">{title}</h3>
                    <p className="font-sans text-[13px] text-[#8A7E76] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact details — flat, no card */}
            <div className="w-full space-y-5">
              <p className="text-[11px] font-bold tracking-[0.28em] text-[#740707] uppercase font-sans">
                Direct Trade Channels
              </p>
              {[
                { Icon: MapPin, label: "Origin Hub", value: "Kathmandu, Nepal · Dubai, UAE" },
                { Icon: Mail, label: "Trade Desk", value: "hello@monagrow.com", href: "mailto:hello@monagrow.com" },
                { Icon: Phone, label: "Enquiry Line", value: "+971 53 462 527", href: "tel:+97153462527" },
              ].map(({ Icon, label, value, href }) => {
                const Tag = href ? "a" : "div";
                return (
                  <Tag
                    key={label}
                    {...(href ? { href } : {})}
                    className="flex items-center gap-3.5 group"
                  >
                    <Icon className="w-4 h-4 text-[#9A8C83] shrink-0 group-hover:text-[#740707] transition-colors" strokeWidth={2} />
                    <div>
                      <p className="text-[11px] text-[#9A8C83] font-sans uppercase tracking-widest font-semibold">{label}</p>
                      <p className="text-[13.5px] text-[#1C1A16] font-sans font-medium group-hover:text-[#740707] transition-colors">{value}</p>
                    </div>
                  </Tag>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT PANEL — FORM CARD
              ══════════════════════════════════════ */}
          <div>
            <div className="bg-white rounded-[32px] border border-[#EDE0D4] shadow-[0_24px_72px_-16px_rgba(70,30,20,0.09),0_4px_16px_-4px_rgba(70,30,20,0.04)] overflow-hidden">
              {/* Card header bar */}
              <div className="bg-gradient-to-r from-[#FAF1EB] to-[#FDF8F5] border-b border-[#EDE0D4] px-8 sm:px-10 py-5 flex items-center justify-between">
                <div>
                  <p className="text-[11.5px] font-bold tracking-[0.22em] text-[#740707] uppercase font-sans">
                    Commodity Enquiry Form
                  </p>
                  <p className="text-[12.5px] text-[#8A7E76] font-sans mt-0.5">
                    Fields marked <span className="text-[#991B1B] font-semibold">*</span> are required
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#F5CABA]" />
                  <span className="w-3 h-3 rounded-full bg-[#F5DDB5]" />
                  <span className="w-3 h-3 rounded-full bg-[#C5D9B5]" />
                </div>
              </div>

              <div className="px-7 sm:px-10 py-8 sm:py-10">
                {isSubmitted ? (
                  /* ── SUCCESS STATE ── */
                  <div className="text-center py-10 px-4">
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="w-20 h-20 rounded-full bg-[#F0FAF2] flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-[#2D6A44]" strokeWidth={2} />
                      </div>
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#740707] text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <h3 className="font-serif font-bold text-[26px] text-[#1C1A16] mb-3">
                      Enquiry Received!
                    </h3>
                    <p className="text-[14.5px] text-[#6B6059] max-w-sm mx-auto leading-relaxed mb-2 font-sans">
                      Thank you, <strong className="text-[#1C1A16]">{formData.name}</strong>. Our specialist for
                    </p>
                    <p className="text-[13.5px] font-semibold text-[#740707] mb-4 font-sans">
                      {formData.product}
                    </p>
                    <p className="text-[13.5px] text-[#6B6059] font-sans mb-8">
                      will respond to <strong className="text-[#1C1A16]">{formData.email}</strong> within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13.5px] font-semibold text-[#740707] border-2 border-[#740707]/25 hover:border-[#740707]/50 hover:bg-[#740707]/5 transition-all cursor-pointer font-sans"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  /* ── MAIN FORM ── */
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Row 1: Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="contact-name" className={LABEL_CLS}>
                          Name <span className="text-[#991B1B] normal-case tracking-normal">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="e.g. Elena Rostova"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-company" className={LABEL_CLS}>
                          Company Name <span className="text-[#991B1B] normal-case tracking-normal">*</span>
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          required
                          placeholder="e.g. Continental Foodways Ltd"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="contact-email" className={LABEL_CLS}>
                          Business Email <span className="text-[#991B1B] normal-case tracking-normal">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="elena@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-country" className={LABEL_CLS}>
                          Country <span className="text-[#991B1B] normal-case tracking-normal">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="contact-country"
                            required
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className={SELECT_CLS}
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8C83] pointer-events-none" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Product */}
                    <div>
                      <label htmlFor="contact-product" className={LABEL_CLS}>
                        Product Interested In <span className="text-[#991B1B] normal-case tracking-normal">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-product"
                          required
                          value={formData.product}
                          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                          className={SELECT_CLS}
                        >
                          {PRODUCTS_LIST.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8C83] pointer-events-none" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <label htmlFor="contact-message" className={`${LABEL_CLS} mb-0`}>
                          Message
                        </label>
                        <span className="text-[11px] text-[#9A8C83] font-sans">Optional</span>
                      </div>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder="Specify target volume (e.g. 1×20ft FCL or 25 MT), preferred packaging (retail pouches / bulk sacks), target discharge port, or sample requests..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`${INPUT_CLS} resize-none leading-relaxed`}
                      />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#F0E8E0]" />

                    {/* Footer row: privacy note + submit */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between pt-1">
                      <p className="text-[11.5px] text-[#9A8C83] font-sans leading-relaxed max-w-[220px]">
                        Your data is handled with strict confidentiality. No spam, ever.
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative shrink-0 group overflow-hidden px-8 py-3.5 rounded-full bg-[#680615] hover:bg-[#550512] text-white font-semibold text-[14px] flex items-center gap-2.5 shadow-[0_6px_20px_rgba(104,6,21,0.28)] hover:shadow-[0_8px_28px_rgba(104,6,21,0.38)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                      >
                        {/* Shimmer on hover */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </span>
                        ) : (
                          <>
                            Submit Commodity Enquiry
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
