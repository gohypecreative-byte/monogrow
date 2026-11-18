"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { loadHeroMotion } from "./heroMotion";
import styles from "./AboutMonagrow.module.css";

interface AboutMonagrowProps {
  onOpenQuoteModal?: (productName?: string) => void;
}

interface StackingCard {
  id: string;
  wordmark: string;
  headline: string;
  copy: string;
  specs: string[];
  storyLinkText: string;
  storyLinkHref: string;
  image: string;
  imageAlt: string;
  stepTag?: string;
  quoteProduct?: string;
  quoteBtnText?: string;
  location?: string;
  subCaption?: string;
}

const CARDS: StackingCard[] = [
  {
    id: "origin",
    wordmark: "ORIGIN",
    stepTag: "01 / PROVENANCE AT SOURCE",
    headline: "Direct connection to origin mills and growers",
    copy: "Our sourcing conversations begin directly with registered origin mills and farming estates. By eliminating intermediaries and verifying crop provenance at source, we ensure authentic lot identity, consistent commercial grade specifications, and dependable availability.",
    specs: [
      "Verified harvest provenance and single-estate lot identity",
      "Basmati Rice (1121 Supreme) & Estate Single-Origin Coffee",
      "Agronomist field audits and pre-harvest crop sampling",
    ],
    quoteProduct: "Basmati Rice (1121 Supreme)",
    quoteBtnText: "Request Basmati & Coffee quote",
    storyLinkText: "Read origin report",
    storyLinkHref: "/about-us#sourcing-philosophy",
    image: "/assets/about-harvest-origin.jpg",
    imageAlt: "Golden agricultural grain harvest field at sunrise with morning sunbeams across rolling crops",
    location: "Origin farm estates · Harvest procurement",
    subCaption: "Direct grower partnerships & verified agricultural harvest provenance",
  },
  {
    id: "purity",
    wordmark: "PURITY",
    stepTag: "02 / LABORATORY ANALYSIS",
    headline: "Scientific testing and laser Sortex grading",
    copy: "Every consignment undergoes rigorous multi-stage quality verification—from grain moisture testing and laser Sortex optical cleaning to ISO-certified laboratory checks and origin phytosanitary documentation before dispatch.",
    specs: [
      "Laser Sortex optical purity cleaning (99.8%+ purity)",
      "Moisture controlled under 11.5% for grains, under 4.5% for dry fruits",
      "Independent SGS & ISO accredited laboratory analysis certificates",
    ],
    quoteProduct: "Refined Sugar (ICUMSA 45)",
    quoteBtnText: "Request Sugar & Dry Fruits quote",
    storyLinkText: "View quality standards",
    storyLinkHref: "/about-us#quality-standards",
    image: "/assets/monagrow-product-testing-lab.jpg",
    imageAlt: "Food science laboratory quality testing and grain purity inspection",
    location: "Food science laboratory · Quality testing",
    subCaption: "Moisture testing, Sortex purity analysis & certified lab specs",
  },
  {
    id: "logistics",
    wordmark: "LOGISTICS",
    stepTag: "03 / MARITIME EXECUTION",
    headline: "Coordinated container dispatch to world ports",
    copy: "Whether procuring trial batches (25 MT container) or ongoing multi-container annual supply contracts, our trade desk coordinates custom packaging, deepwater port scheduling, and ocean freight on FOB, CIF, or CFR terms.",
    specs: [
      "20ft (approx. 25 MT) & 40ft containerized cargo allocations",
      "FOB, CIF, CFR & EXW quotation terms across all major routes",
      "Heavy-duty barrier packaging from 5 kg retail to 50 kg bulk PP bags",
    ],
    quoteProduct: "Specialty Estate Coffee",
    quoteBtnText: "Plan a freight shipment",
    storyLinkText: "Review export routes",
    storyLinkHref: "/about-us#global-reach",
    image: "/assets/about-shipping-vessel.jpg",
    imageAlt: "International ocean freight container ship at deepwater port terminal",
    location: "Deepwater port terminal · International freight",
    subCaption: "Multi-port container shipping to Middle East, Europe, UK & Americas",
  },
  {
    id: "partnership",
    wordmark: "PARTNERSHIP",
    stepTag: "04 / WHOLESALE TRADE DESK",
    headline: "Clarity and accountability beyond the contract",
    copy: "A dependable wholesale partnership extends far beyond initial pricing. We provide real-time vessel tracking, standardized lot traceability, proactive regulatory compliance, and a dedicated trade specialist for your commercial orders.",
    specs: [
      "Dedicated trade account specialist & fast quotation turnaround",
      "Pre-shipment inspection reports & digital bill of lading tracking",
      "Commercial contract flexibility for spot loads and annual supplies",
    ],
    quoteProduct: "Royal Mixed Dry Fruits",
    quoteBtnText: "Connect with a trade director",
    storyLinkText: "Explore company story",
    storyLinkHref: "/about-us#mission",
    image: "/assets/about-partnership-handshake.jpg",
    imageAlt: "Close-up of two hands shaking in commercial business agreement and wholesale partnership",
    location: "Wholesale trade desk · Strategic partnership",
    subCaption: "Long-term commercial contracts & dedicated account director support",
  },
];

export default function AboutMonagrow({ onOpenQuoteModal }: AboutMonagrowProps = {}) {
  const wrapperRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    let cancelled = false;

    // Refresh ScrollTrigger so subsequent pinned sections (e.g. CategorySection)
    // recalculate their trigger start offsets based on the updated card stack runway.
    loadHeroMotion().then(({ ScrollTrigger }) => {
      if (cancelled || !ScrollTrigger) return;
      ScrollTrigger.refresh();
    });

    const updateCardVisuals = () => {
      if (typeof window === "undefined") return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        cardRefs.current.forEach((cardEl) => {
          if (cardEl) {
            cardEl.style.filter = "none";
            cardEl.style.opacity = "1";
            cardEl.style.transform = "scale(1)";
          }
        });
        return;
      }

      const isMobile = window.innerWidth <= 767;
      const targetTop = isMobile ? 64 : (window.innerWidth <= 1024 ? 82 : 90);
      const transitionRange = isMobile ? 200 : 320;

      for (let i = 0; i < CARDS.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        // The very last card is in the front and never overlaid
        if (i === CARDS.length - 1) {
          cardEl.style.filter = "none";
          cardEl.style.opacity = "1";
          cardEl.style.transform = "scale(1)";
          cardEl.style.visibility = "visible";
          cardEl.style.pointerEvents = "auto";
          continue;
        }

        const nextWrapper = wrapperRefs.current[i + 1];
        if (!nextWrapper) continue;

        const nextRect = nextWrapper.getBoundingClientRect();

        // Fade buffer: ensure underlying card is completely faded out before next card reaches targetTop
        const fadeBuffer = isMobile ? 60 : 120;
        const distance = nextRect.top - (targetTop + fadeBuffer);

        // Progress goes from 0 (when next card is transitionRange away) to 1 (when next card arrives within fadeBuffer)
        const progress = Math.min(1, Math.max(0, 1 - distance / transitionRange));

        const blur = progress * 6; // 0px -> 6px blur
        const opacity = Math.max(0, 1 - progress); // 1.0 -> 0.0
        const scale = 1 - progress * 0.04;

        if (progress >= 0.96) {
          // Completely hidden once next card appears - no ghost/blurred card visible in background
          cardEl.style.opacity = "0";
          cardEl.style.visibility = "hidden";
          cardEl.style.pointerEvents = "none";
          cardEl.style.filter = "none";
          cardEl.style.transform = `scale(${scale.toFixed(3)})`;
        } else {
          cardEl.style.visibility = "visible";
          cardEl.style.pointerEvents = "auto";
          if (blur > 0.08) {
            cardEl.style.filter = `blur(${blur.toFixed(1)}px)`;
          } else {
            cardEl.style.filter = "none";
          }
          cardEl.style.opacity = opacity.toFixed(2);
          cardEl.style.transform = `scale(${scale.toFixed(3)})`;
        }
      }
    };

    const handleScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCardVisuals);
    };

    const handleResize = () => {
      handleScroll();
      loadHeroMotion().then(({ ScrollTrigger }) => {
        if (!cancelled && ScrollTrigger) ScrollTrigger.refresh();
      });
    };

    updateCardVisuals();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="about-us"
      className={styles.section}
      aria-labelledby="about-heading"
      suppressHydrationWarning
    >
      <div className={styles.container}>
        {/* 1. Section Header matching site architecture */}
        <header className={styles.header}>
          <div className={styles.kickerBadge}>
            <div className={styles.kickerRow}>
              <svg
                className={styles.wheatIcon}
                viewBox="0 0 52 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="13" y1="14" x2="52" y2="14" />
                <path d="M 2,14 C 2,10.5 8,9.5 13,14 C 8,18.5 2,17.5 2,14 Z" />
                <path d="M 13,14 C 11.5,8 16.5,3.5 21,3.5 C 22.5,7.5 19,12.5 13,14 Z" />
                <path d="M 24,14 C 22.5,8 27.5,3.5 32,3.5 C 33.5,7.5 30,12.5 24,14 Z" />
                <path d="M 35,14 C 33.5,8 38.5,3.5 43,3.5 C 44.5,7.5 41,12.5 35,14 Z" />
                <path d="M 13,14 C 11.5,20 16.5,24.5 21,24.5 C 22.5,20.5 19,15.5 13,14 Z" />
                <path d="M 24,14 C 22.5,20 27.5,24.5 32,24.5 C 33.5,20.5 30,15.5 24,14 Z" />
                <path d="M 35,14 C 33.5,20 38.5,24.5 43,24.5 C 44.5,20.5 41,15.5 35,14 Z" />
              </svg>
              <span className={styles.kicker}>ABOUT MONAGROW</span>
              <svg
                className={`${styles.wheatIcon} ${styles.wheatIconRight}`}
                viewBox="0 0 52 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="13" y1="14" x2="52" y2="14" />
                <path d="M 2,14 C 2,10.5 8,9.5 13,14 C 8,18.5 2,17.5 2,14 Z" />
                <path d="M 13,14 C 11.5,8 16.5,3.5 21,3.5 C 22.5,7.5 19,12.5 13,14 Z" />
                <path d="M 24,14 C 22.5,8 27.5,3.5 32,3.5 C 33.5,7.5 30,12.5 24,14 Z" />
                <path d="M 35,14 C 33.5,8 38.5,3.5 43,3.5 C 44.5,7.5 41,12.5 35,14 Z" />
                <path d="M 13,14 C 11.5,20 16.5,24.5 21,24.5 C 22.5,20.5 19,15.5 13,14 Z" />
                <path d="M 24,14 C 22.5,20 27.5,24.5 32,24.5 C 33.5,20.5 30,15.5 24,14 Z" />
                <path d="M 35,14 C 33.5,20 38.5,24.5 43,24.5 C 44.5,20.5 41,15.5 35,14 Z" />
              </svg>
            </div>
          </div>
          <h2 id="about-heading" className={styles.mainTitle}>
            Good ingredients, <em>Lasting</em> partnerships.
          </h2>
          <div className={styles.introduction}>
            <p>
              From the first sourcing conversation to the next shipment, we make the details of wholesale trade easier to navigate.
              <br className="hidden md:inline" />{" "}
              Monagrow is an agricultural commodity wholesaler and exporter connecting origin mills and growers with businesses around the world.
            </p>
          </div>
        </header>

        {/* 2. Stacking Cards Track (Overlay on scroll with progressive blur & dimming) */}
        <div className={styles.stackTrack}>
          {CARDS.map((card, idx) => (
            <article
              key={card.id}
              ref={(el) => {
                wrapperRefs.current[idx] = el;
              }}
              className={styles.cardWrapper}
              style={{
                zIndex: idx + 1,
              }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={styles.card}
              >
                {/* Left Content Column */}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeaderArea}>
                    <h3 className={styles.wordmark}>{card.wordmark}</h3>
                  </div>
                  <h4 className={styles.headline}>{card.headline}</h4>
                  <p className={styles.copy}>{card.copy}</p>

                  <ul
                    className={styles.specs}
                    aria-label={`${card.wordmark} key specifications`}
                  >
                    {card.specs.map((spec, sIdx) => (
                      <li key={sIdx} className={styles.specItem}>
                        <Check size={14} className={styles.specCheck} aria-hidden="true" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.actions}>
                    <Link href={card.storyLinkHref} className={styles.storyLink}>
                      <span>{card.storyLinkText}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Right Visual Column (Photographic visual with origin details) */}
                <div className={styles.cardVisual}>
                  <div className={styles.imageWrapper} style={{ position: "relative" }}>
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 620px"
                      className={styles.panelImage}
                      priority={idx === 0}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
