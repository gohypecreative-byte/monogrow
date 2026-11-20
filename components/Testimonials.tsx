"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Testimonials.module.css";

interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  category: string;
  avatar: string;
  rating?: number;
}

// Existing testimonial content retained from the previous layout.
const REVIEWS: ReviewItem[] = [
  {
    id: "tariq",
    author: "Tariq Al-Mansoor",
    role: "Corporate Buyer",
    location: "Dubai, UAE",
    category: "Basmati Rice 8.9mm",
    quote:
      "“We have imported over twelve 40ft containers of Monagrow 8.9mm basmati. Grain elongation after cooking exceeds 2.2x every time, and we have had zero broken-grain complaints from our supermarket clients across Dubai and Abu Dhabi.”",
    avatar: "/assets/testimonial-tariq.jpg",
    rating: 5,
  },
  {
    id: "elena",
    author: "Elena Rostova",
    role: "Roastmaster",
    location: "Oslo, Norway",
    category: "Specialty Estate Coffee",
    quote:
      "“The washed Arabica arrived in hermetic GrainPro liners with cupping scores that matched the samples. Acidity was balanced, batch consistency was excellent, and delivery to Rotterdam was on schedule.”",
    avatar: "/assets/testimonial-elena.jpg",
    rating: 5,
  },
  {
    id: "rajesh",
    author: "Rajesh Shrestha",
    role: "Retail Director",
    location: "Kathmandu, Nepal",
    category: "Royal Cashews W240",
    quote:
      "“Monagrow's direct wholesale packaging lifted our dry fruit and sugar shelves. The 5kg basmati packs and W240 cashew pouches are top tier in quality, shelf appeal, and repeat purchases.”",
    avatar: "/assets/testimonial-rajesh.jpg",
    rating: 5,
  },
  {
    id: "jeanluc",
    author: "Jean-Luc Mercier",
    role: "Sourcing Lead",
    location: "Marseille, France",
    category: "Refined Sugar ICUMSA 45",
    quote:
      "“Their refined plantation white sugar meets European ICUMSA 45 purity without fail. Batch inspection certificates, bills of lading, and moisture-barrier liners make clearance at European ports effortless.”",
    avatar: "/assets/testimonial-jeanluc.jpg",
    rating: 5,
  },
  {
    id: "marcus",
    author: "Marcus Vance",
    role: "Commodity Broker",
    location: "London, UK",
    category: "Container Freight",
    quote:
      "“Direct mill contracts with Monagrow removed three layers of brokerage markup. Port inspection reports and FOB schedules arrive like clockwork, so we have scaled allocations across European hubs with confidence.”",
    avatar: "/assets/hero-trade-director.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  const [slide, setSlide] = useState({ active: 0, previous: -1, direction: 1, sequence: 0 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useCallback((direction: number) => {
    setSlide(current => ({
      active: (current.active + direction + REVIEWS.length) % REVIEWS.length,
      previous: current.active,
      direction,
      sequence: current.sequence + 1,
    }));
  }, []);

  useEffect(() => {
    if (hovered || focused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const updateTimer = () => {
      clearInterval(timer);
      if (!reduced.matches && !document.hidden) timer = setInterval(() => navigate(1), 7000);
    };
    updateTimer();
    reduced.addEventListener("change", updateTimer);
    document.addEventListener("visibilitychange", updateTimer);
    return () => {
      clearInterval(timer);
      reduced.removeEventListener("change", updateTimer);
      document.removeEventListener("visibilitychange", updateTimer);
    };
  }, [hovered, focused, navigate, slide.sequence]);

  return (
    <section id="testimonials" className={styles.section} aria-labelledby="testimonials-heading" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="testimonials-heading">What people say</h2>
          <div className={styles.controls}>
            <button type="button" onClick={() => navigate(-1)} aria-label="Previous testimonial" aria-controls="testimonial-slide"><ChevronLeft size={21} aria-hidden="true" /></button>
            <button type="button" onClick={() => navigate(1)} aria-label="Next testimonial" aria-controls="testimonial-slide"><ChevronRight size={21} aria-hidden="true" /></button>
          </div>
        </header>
        <div id="testimonial-slide" className={styles.viewport} aria-live={hovered || focused ? "polite" : "off"} aria-atomic="true" style={{ "--slide-direction": slide.direction } as CSSProperties}>
          {[slide.previous, slide.active].filter(index => index >= 0).map(index => {
            const review = REVIEWS[index];
            const outgoing = index !== slide.active;
            return (
              <figure key={`${slide.sequence}-${review.id}`} className={`${styles.review} ${outgoing ? styles.outgoing : slide.sequence ? styles.incoming : ""}`} aria-hidden={outgoing}>
                <blockquote className={styles.quote}><p>{review.quote}</p></blockquote>
                <figcaption className={styles.author}>
                  <Image src={review.avatar} alt="" width={54} height={54} className={styles.avatar} />
                  <div><strong>{review.author}</strong><span>{review.role} · {review.location}</span></div>
                </figcaption>
              </figure>
            );
          })}
          <span className={styles.srOnly}>Testimonial {slide.active + 1} of {REVIEWS.length}</span>
        </div>
      </div>
    </section>
  );
}