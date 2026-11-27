"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RiceHeroTransition from "@/components/RiceHeroTransition";
import RiceGuide from "@/components/RiceGuide";

import Footer from "@/components/Footer";
import VideoModal from "@/components/VideoModal";
import QuoteModal from "@/components/QuoteModal";
import {
  getRicePageProducts,
  CommodityProduct,
} from "@/data/commodityData";
import {
  CheckCircle2,
  X,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

export default function RicePageClient() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCommodityForQuote, setSelectedCommodityForQuote] = useState(
    "Premium Basmati Steam Rice"
  );
  const [selectedProductForDetails, setSelectedProductForDetails] =
    useState<CommodityProduct | null>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);


  const products = getRicePageProducts();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (motion.matches) return;
        const card = entry.target as HTMLElement;
        const index = Number(card.dataset.collectionCard);
        // The first pack arrives from the hero; its card stays stationary.
        if (index === 0) return;
        const animation = card.animate([
          { opacity: 0, transform: "translateX(-64px)" },
          { opacity: 1, transform: "translateX(0)" },
        ], {
          duration: 850,
          delay: (index % 3) * 100,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: .12 });
    section.querySelectorAll("[data-collection-card]").forEach(card => observer.observe(card));
    const cancel = () => {
      if (motion.matches) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    motion.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      motion.removeEventListener("change", cancel);
    };
  }, []);

  // Scroll entrance observer matching KRBL AOS fade-up transition
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedCommodityForQuote(productName || "Premium Basmati Steam Rice");
    setIsQuoteModalOpen(true);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-900 selection:bg-[#740707] selection:text-white">
      {/* 1. Top Navbar with immersiveHero (matches main page hero styling) */}
      <Navbar onOpenQuoteModal={handleOpenQuoteModal} immersiveHero />

      <main className="site-sections flex-1 relative">
        {/* Floating smooth pop-out transition from Hero to Basmati Product Card */}
        <RiceHeroTransition />

        {/* ========================================================
            2. HERO SECTION FROM MAIN PAGE
            Copied with all functionality, colors, animations,
            GSAP scrub, Lenis smooth scroll, particles & interactive scene
            ======================================================== */}
        <Hero
          filterProduct="rice"
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* ========================================================
            4. MONAGROW PORTFOLIO - BASMATI RANGE
            Layout matching KRBL Rice 3-column luxury catalogue grid
            with exact transition, hover scale, and entrance reveals
            ======================================================== */}
        <section
          id="rice-collection"
          ref={sectionRef}
          className="py-16 sm:py-24 bg-[#fcfbf7] border-b border-[#dfd5c6] scroll-mt-24"
        >
          <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header: THE MONAGROW RICE COLLECTION + Rice, chosen with care. in Playfair Display serif */}
            <div
              className={`text-center mb-12 sm:mb-16 transition-all duration-700 ease-out ${
                isSectionVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              <span className="block text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-[#740707] mb-2.5">
                THE MONAGROW RICE COLLECTION
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold text-[#262820] tracking-tight leading-tight">
                Rice, chosen with care.
              </h2>
            </div>

            {/* 3-Column Catalogue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  id={product.id}
                  data-collection-card={index}
                  className="group relative flex flex-col items-center justify-between text-center bg-white rounded-2xl p-6 sm:p-8 border border-[#dfd5c6] hover:border-[#740707] shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 h-full"
                >
                  {/* Visual Cutout Pack Image with Smooth Hover Scale */}
                  <div
                    className="relative w-full h-52 sm:h-60 flex items-center justify-center mb-5 cursor-pointer"
                    onClick={() => setSelectedProductForDetails(product)}
                    title={`Click to view ${product.name} specifications`}
                  >
                    <Image
                      id={index === 0 ? "rice-target-pack" : undefined}
                      src={product.packImg}
                      alt={product.packAlt || product.name}
                      width={240}
                      height={320}
                      unoptimized={Boolean(product.packImg?.startsWith("data:"))}
                      className="max-h-[190px] sm:max-h-[220px] w-auto object-contain drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-500 ease-out group-hover:scale-106"
                      sizes="(max-width: 768px) 180px, 240px"
                    />
                  </div>

                  {/* Content Block */}
                  <div className="flex-1 flex flex-col items-center justify-between w-full">
                    <div>
                      {/* Title in Elegant Bold Font */}
                      <h3
                        onClick={() => setSelectedProductForDetails(product)}
                        className="text-xl sm:text-2xl font-bold text-[#262820] group-hover:text-[#740707] transition-colors duration-300 tracking-tight leading-snug cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {/* Subtitle / Description */}
                      <p
                        title={product.tagline}
                        className="text-xs sm:text-sm text-[#6b5d52] leading-relaxed mt-2 max-w-[280px] sm:max-w-[320px] mx-auto font-normal"
                      >
                        {product.tagline}
                      </p>
                    </div>

                    {/* Action CTA: Request Quote */}
                    <div className="mt-6 pt-1 flex items-center justify-center w-full">
                      <button
                        type="button"
                        onClick={() => handleOpenQuoteModal(product.quoteName)}
                        className="px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#740707] hover:bg-[#5e0606] active:bg-[#4a0404] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. THE STORY, HERITAGE, VARIETIES & CRAFT OF RICE
            ======================================================== */}
        <RiceGuide

          onOpenQuoteModal={handleOpenQuoteModal}
        />


        {/* ========================================================
            7. DIRECT CONTAINER SOURCING CTA BANNER
            ======================================================== */}
        <section className="py-12 bg-gradient-to-r from-[#740707] to-[#520505] text-white">
          <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FAF9F6]/80">
                  Plan your next shipment
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Source Monagrow Rice Directly from Origin
                </h3>
                <p className="text-xs sm:text-sm text-neutral-200 font-normal">
                  Inquire about full container loads (FCL), palletized export,
                  custom retail bagging, and pre-shipment inspection requirements.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenQuoteModal(products[0]?.quoteName)}
                  className="px-6 py-3 rounded-full bg-white text-[#740707] hover:bg-neutral-100 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Request a quote</span>
                </button>

                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/25 transition-colors"
                >
                  Contact our team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Interactive Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Wholesale Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCommodity={selectedCommodityForQuote}
      />

      {/* Product Full Specifications Modal — Wide Floating Window (Full Screen, Not Edge-to-Edge) */}
      {selectedProductForDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedProductForDetails(null)}
        >
          <div
            className="relative w-full max-w-[95vw] lg:max-w-6xl xl:max-w-7xl bg-[#FAF9F6] rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-2xl p-5 sm:p-7 lg:p-8 max-h-[90vh] overflow-y-auto sm:overflow-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProductForDetails(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer z-10"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-neutral-200 shrink-0">
              <div className="w-24 h-28 sm:w-28 sm:h-34 md:w-32 md:h-38 relative shrink-0 flex items-center justify-center">
                <Image
                  src={selectedProductForDetails.packImg}
                  alt={selectedProductForDetails.packAlt}
                  width={150}
                  height={190}
                  unoptimized={Boolean(selectedProductForDetails.packImg?.startsWith("data:"))}
                  className="max-h-28 sm:max-h-34 md:max-h-38 w-auto object-contain drop-shadow-lg"
                />
              </div>
              <div className="text-center sm:text-left space-y-1.5 flex-1 pr-6 sm:pr-8">
                {selectedProductForDetails.kicker ? (
                  <span className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#740707] block">
                    {selectedProductForDetails.kicker}
                  </span>
                ) : null}
                <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-neutral-900 tracking-tight leading-tight">
                  {selectedProductForDetails.name}
                </h3>
                <p className="text-xs sm:text-[13.5px] md:text-sm text-neutral-600 leading-relaxed font-normal max-w-4xl">
                  {selectedProductForDetails.description}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-3.5 sm:py-5 space-y-3.5 sm:space-y-5 flex-1 min-h-0">
              {/* Verified Product Specifications */}
              <div>
                <h4 className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Product specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                  {selectedProductForDetails.specs.map((sp) => (
                    <div
                      key={sp.label}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs"
                    >
                      <p className="text-[10px] sm:text-[10.5px] uppercase tracking-wider text-neutral-500 font-medium truncate">
                        {sp.label}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-[14.5px] font-bold text-neutral-900 mt-0.5 truncate">
                        {sp.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Column Section: Retail Formats | Wholesale & Bulk | Sourcing Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {/* Retail Packaging */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-start">
                  <div>
                    <h4 className="text-xs sm:text-[12.5px] font-bold uppercase tracking-wider text-[#740707] flex items-center gap-1.5 mb-2.5">
                      <PackageCheck className="w-4 h-4 text-[#740707]" />
                      Retail Packaging Formats
                    </h4>
                    <ul className="text-xs sm:text-[13px] text-neutral-600 space-y-1.5">
                      {selectedProductForDetails.retailSizes.map((size) => (
                        <li key={size} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#740707]" />
                          <span>{size}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Wholesale & Bulk Export */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-start">
                  <div>
                    <h4 className="text-xs sm:text-[12.5px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#740707]" />
                      Wholesale &amp; Bulk Export
                    </h4>
                    <ul className="text-xs sm:text-[13px] text-neutral-600 space-y-1.5">
                      {selectedProductForDetails.bulkSizes.map((size) => (
                        <li key={size} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          <span>{size}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quality & Sourcing Highlights */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-start">
                  <div>
                    <h4 className="text-xs sm:text-[12.5px] font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                      Quality &amp; Sourcing Highlights
                    </h4>
                    <ul className="text-xs sm:text-[12.5px] text-neutral-600 space-y-1.5">
                      {selectedProductForDetails.keyHighlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#740707] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-3.5 sm:pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3.5 shrink-0">
              <span className="text-xs sm:text-sm text-neutral-500 text-center sm:text-left">
                Confirm current lot specifications, private labeling options, and shipping terms with our team.
              </span>
              <button
                type="button"
                onClick={() => {
                  const quoteName = selectedProductForDetails.quoteName;
                  setSelectedProductForDetails(null);
                  handleOpenQuoteModal(quoteName);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#740707] hover:bg-[#5e0606] shadow-md transition-all cursor-pointer hover:scale-[1.02] shrink-0"
              >
                Request Quote for this Variety
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
