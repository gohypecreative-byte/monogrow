"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { loadHeroMotion } from "./heroMotion";
import styles from "./Hero.module.css";

interface HeroProps {
  onOpenVideoModal?: () => void;
  onOpenQuoteModal: (productName?: string) => void;
  filterProduct?: "rice" | "coffee" | "sugar" | "dry-fruits";
}

const PRODUCTS = [
  { name: "Basmati Rice", short: "Rice", title: ["Every grain.", "Exceptional."], image: "/assets/monagrow-rice-bag-cutout.png", colour: "#b9cdef", glow: "#315a9c", note: "STEAM & SELLA BASMATI", description: "Carefully steam-processed to support better grain separation and consistent cooking results.", detail: "Steam & Sella", size: "5 kg", ingredient: "rice", atlas: "0% 0%" },
  { name: "Estate Coffee", short: "Coffee", title: ["Deep roots.", "Deeper flavour."], image: "/assets/monagrow-coffee-bag-cutout.png", colour: "#e7ad76", glow: "#aa633c", note: "SPECIALTY ESTATE COFFEE", description: "Rich, aromatic Arabica. Carefully sourced from the estate, for a cup with a character all its own.", detail: "Dark roast Arabica", size: "2.5 kg", ingredient: "coffee", atlas: "100% 0%" },
  { name: "Royal Dry Fruits", short: "Dry Fruits", title: ["Naturally rich.", "Royally good."], image: "/assets/monagrow-mix-dryfruits-packaging.png", colour: "#e5c5f0", glow: "#78328d", note: "WHOLE & SELECTED MIX", description: "A royal harvest of selected cashews, California almonds, rich walnuts, and crunchy pistachios.", detail: "Four-nut mix", size: "2.5 kg", ingredient: "dryfruit", atlas: "0% 100%" },
  { name: "Sugar", short: "Sugar", title: ["Pure sweetness.", "Sweet simplicity."], image: "/assets/monagrow-sugar-bag-cutout.png", colour: "#d1db94", glow: "#7e994c", note: "REFINED SUGAR · ICUMSA 45", description: "Sparkling crystals. Consistent purity. Refined sugar, ready for everything you create.", detail: "ICUMSA 45", size: "1 kg", ingredient: "sugar", atlas: "100% 100%" },
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: ((i * 137.508) % 100), y: 14 + ((i * 31.71) % 73),
  rotation: (i * 67) % 360, size: i % 9 === 0 ? 74 : 12 + (i % 5) * 7,
  depth: i % 3,
}));
const DRYFRUIT_PARTICLES = [
  "/assets/dryfruit-cashew-1.png",
  "/assets/dryfruit-almond-1.png",
  "/assets/dryfruit-walnut-1.png",
  "/assets/dryfruit-pistachio-1.png",
  "/assets/dryfruit-cashew-2.png",
  "/assets/dryfruit-almond-2.png",
  "/assets/dryfruit-walnut-2.png",
  "/assets/dryfruit-pistachio-2.png",
];
const COFFEE_PARTICLES = [
  "/assets/coffee-particle-1.png",
  "/assets/coffee-particle-2.png",
  "/assets/coffee-particle-3.png",
];
const QUOTE_NAMES = ["Premium Basmati Steam Rice", "Specialty Estate Coffee", "Royal Mixed Dry Fruits", "Refined Sugar (ICUMSA 45)"];
const BACKGROUNDS = ["#142e61", "#754832", "#3e164f", "#516b3b"];
function blendColour(from: string, to: string, progress: number) {
  const channels = [1, 3, 5].map(offset => {
    const start = parseInt(from.slice(offset, offset + 2), 16);
    return Math.round(start + (parseInt(to.slice(offset, offset + 2), 16) - start) * progress);
  });
  return `rgb(${channels.join(",")})`;
}

export default function Hero({ onOpenQuoteModal, filterProduct }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const isSingleProduct = Boolean(filterProduct);
  const productIndex = filterProduct ? (({ rice: 0, coffee: 1, "dry-fruits": 2, dryfruits: 2, sugar: 3 } as Record<string, number>)[filterProduct] ?? 0) : 0;
  const activeProducts = useMemo(() => isSingleProduct ? [PRODUCTS[productIndex]] : PRODUCTS, [isSingleProduct, productIndex]);
  const activeBackgrounds = useMemo(() => isSingleProduct ? [BACKGROUNDS[productIndex]] : BACKGROUNDS, [isSingleProduct, productIndex]);
  const activeQuoteNames = isSingleProduct ? [QUOTE_NAMES[productIndex]] : QUOTE_NAMES;

  useEffect(() => {
    const firstScene = stage.current?.querySelector<HTMLElement>("[data-scene]");
    if (!firstScene) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bowl = firstScene.querySelector<HTMLElement>(`.${styles.ingredientEntrance}`);
    const pack = firstScene.querySelector<HTMLElement>(`.${styles.packEntrance}`);
    const animations: Animation[] = [];
    let cancelled = false;
    const stop = () => animations.forEach(animation => animation.cancel());
    const images = [bowl, pack].map(element => element?.querySelector("img"));

    // Start together after both images decode, including images from cache.
    Promise.all(images.map(image => image?.decode().catch(() => undefined))).then(() => {
      if (cancelled || motion.matches || window.scrollY > window.innerHeight * .25) return;
      if (bowl) animations.push(bowl.animate([
        { opacity: 0, transform: "translateY(55px) scale(.82) rotate(-7deg)" },
        { opacity: 1, transform: "translateY(-5px) scale(1.025) rotate(1deg)", offset: .72 },
        { opacity: 1, transform: "translateY(0) scale(1) rotate(0)" },
      ], { duration: 1150, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" }));
      if (pack) animations.push(pack.animate([
        { opacity: 0, transform: "translateY(65px) scale(.88)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], { duration: 950, delay: 160, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" }));
    });
    motion.addEventListener("change", stop);
    return () => { cancelled = true; stop(); motion.removeEventListener("change", stop); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    // Static product scenes are the default for reduced motion,
    // JavaScript/CDN failure, and the server-rendered page.
    loadHeroMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current || !stage.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current!;
        const viewport = stage.current!;
        const scenes = Array.from(viewport.querySelectorAll<HTMLElement>("[data-scene]"));
        const layers = scenes.map(scene => ({
          pack: scene.querySelector<HTMLElement>("[data-pack]")!,
          orbit: scene.querySelector<HTMLElement>("[data-orbit]")!,
          particles: Array.from(scene.querySelectorAll<HTMLElement | SVGElement>("[data-particle]")),
          sides: Array.from(scene.querySelectorAll<HTMLElement>("[data-side]")),
        }));
        section.dataset.enhanced = "true";
        const driver = { value: 0 };
        const paint = () => {
          if (isSingleProduct) {
            viewport.style.setProperty("--glow", activeProducts[0].glow);
            viewport.style.setProperty("--backdrop", activeBackgrounds[0]);
            viewport.style.setProperty("--accent", activeProducts[0].colour);
            scenes[0].style.opacity = "1";
            scenes[0].style.visibility = "visible";
            scenes[0].inert = false;
            scenes[0].removeAttribute("aria-hidden");
            const p = driver.value;
            // A small bowl flourish leads the bag's journey into the details.
            const bowlProgress = Math.min(1, p / .22);
            const bowlEase = bowlProgress * bowlProgress * (3 - 2 * bowlProgress);
            layers[0].pack.style.transform = `rotate(${-bowlEase * 22}deg) scale(${1 + bowlEase * .08})`;
            layers[0].orbit.style.transform = `rotate(${p * 180}deg)`;
            layers[0].particles.forEach((particle, j) => {
              const part = PARTICLES[j];
              particle.style.transform = `translate3d(0, ${-p * (60 + part.depth * 80)}px, 0) rotate(${part.rotation + p * 60}deg)`;
            });
            return;
          }
          const index = Math.min(3, Math.round(driver.value));
          const from = Math.max(0, Math.min(3, Math.floor(driver.value)));
          const to = Math.min(3, from + 1);
          const blend = Math.max(0, Math.min(1, driver.value - from));
          viewport.style.setProperty("--glow", blendColour(PRODUCTS[from].glow, PRODUCTS[to].glow, blend));
          viewport.style.setProperty("--backdrop", blendColour(BACKGROUNDS[from], BACKGROUNDS[to], blend));
          viewport.style.setProperty("--accent", blendColour(PRODUCTS[from].colour, PRODUCTS[to].colour, blend));
          scenes.forEach((scene, i) => {
            const distance = i - driver.value;
            const amount = Math.min(1, Math.abs(distance));
            scene.style.opacity = String(1 - amount * amount * (3 - 2 * amount));
            scene.style.visibility = amount < 1 ? "visible" : "hidden";
            scene.inert = i !== index;
            scene.setAttribute("aria-hidden", String(i !== index));
            if (amount >= 1) return;
            layers[i].pack.style.transform = `rotate(${-distance * 135}deg) scale(${1 - amount * .12})`;
            layers[i].orbit.style.transform = `rotate(${driver.value * 240}deg)`;
            layers[i].sides.forEach(side => {
              // Arc through the resting position: enter from the lower right,
              // then curve back toward the upper right without spinning.
              const arcX = distance * distance * viewport.clientWidth * .18;
              const arcY = distance * viewport.clientHeight * .65;
              side.style.transform = `translate(${arcX}px, ${arcY}px) rotate(12deg)`;
            });
            layers[i].particles.forEach((particle, j) => {
              const p = PARTICLES[j];
              particle.style.transform = `translate3d(${(p.x - 50) * amount * 10}px,${-amount * (100 + p.depth * 150)}px,0) rotate(${p.rotation + distance * 150}deg)`;
            });
          });
        };
        paint();
        const tween = gsap.to(driver, {
          value: isSingleProduct ? 1 : 3,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: {
            trigger: section,
            pin: isSingleProduct ? false : viewport,
            start: "top top",
            end: () => isSingleProduct ? "bottom top" : `+=${viewport.clientHeight * 3.3}`,
            scrub: .8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        const pointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          viewport.style.setProperty("--mouse-x", `${(event.clientX / window.innerWidth - .5) * 22}px`);
          viewport.style.setProperty("--mouse-y", `${(event.clientY / window.innerHeight - .5) * 18}px`);
        };
        const resetPointer = () => { viewport.style.setProperty("--mouse-x", "0px"); viewport.style.setProperty("--mouse-y", "0px"); };
        viewport.addEventListener("pointermove", pointer);
        viewport.addEventListener("pointerleave", resetPointer);
        ScrollTrigger.refresh();
        return () => {
          viewport.removeEventListener("pointermove", pointer);
          viewport.removeEventListener("pointerleave", resetPointer);
          tween.kill();
          delete section.dataset.enhanced;
          viewport.removeAttribute("style");
          scenes.forEach(scene => {
            scene.style.removeProperty("opacity"); scene.style.removeProperty("visibility");
            scene.removeAttribute("aria-hidden"); scene.inert = false;
            scene.querySelectorAll<HTMLElement>("[data-pack], [data-orbit], [data-side]").forEach(el => el.removeAttribute("style"));
            scene.querySelectorAll<HTMLElement | SVGElement>("[data-particle]").forEach((el, j) => { el.style.transform = `rotate(${PARTICLES[j].rotation}deg)`; });
          });
        };
      });
      dispose = () => media.revert();
    }).catch(() => { /* The fully visible static scenes are the fallback. */ });
    return () => { cancelled = true; dispose?.(); };
  }, [activeProducts, activeBackgrounds, isSingleProduct]);

  return (
    <section id="home" ref={root} className={styles.hero} style={{ "--glow": activeProducts[0].glow, "--backdrop": activeBackgrounds[0], "--accent": activeProducts[0].colour, background: activeBackgrounds[0] } as CSSProperties} aria-label="Discover Monagrow commodities">
      <svg className={styles.definitions} aria-hidden="true"><defs>
        <radialGradient id="mg-bean" cx="32%" cy="25%"><stop stopColor="#b6814d"/><stop offset=".45" stopColor="#6b351c"/><stop offset="1" stopColor="#261107"/></radialGradient>
        <linearGradient id="mg-grain" x2="1" y2="1"><stop stopColor="#fff7d9"/><stop offset="1" stopColor="#c9ad79"/></linearGradient>
        <linearGradient id="mg-rice-grain" x2="1" y2="1"><stop stopColor="#f8f1e4"/><stop offset="1" stopColor="#dac9ab"/></linearGradient>
        <radialGradient id="mg-cashew-body" cx="42%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#fff8eb"/>
          <stop offset="42%" stopColor="#f4deb3"/>
          <stop offset="78%" stopColor="#dda85a"/>
          <stop offset="100%" stopColor="#b47828"/>
        </radialGradient>
        <linearGradient id="mg-cashew-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#f4deb3" stopOpacity="0"/>
        </linearGradient>
        <symbol id="mg-coffee" viewBox="0 0 60 60"><ellipse cx="30" cy="30" rx="20" ry="27" fill="url(#mg-bean)" transform="rotate(30 30 30)"/><path d="M42 8C17 24 43 34 17 52" stroke="#241005" strokeWidth="4" fill="none"/><path d="M38 9C20 22 38 36 17 49" stroke="#ca9256" strokeWidth="1.2" fill="none"/><path d="M20 14Q9 25 12 35" fill="none" stroke="#e0b083" strokeWidth="2" opacity=".4"/></symbol>
        <symbol id="mg-rice" viewBox="0 0 60 60"><ellipse cx="30" cy="30" rx="7" ry="27" fill="url(#mg-rice-grain)" transform="rotate(25 30 30)"/><path d="M39 8L21 51" stroke="#f5ede0" opacity=".6"/></symbol>
        <symbol id="mg-cashew" viewBox="0 0 60 60">
          <path d="M37 7 C51 12, 57 28, 48 44 C41 55, 20 56, 11 47 C4 39, 6 28, 16 25 C23 23, 26 16, 37 7 Z" fill="url(#mg-cashew-body)" stroke="#caa056" strokeWidth="0.8"/>
          <path d="M35 10 C46 15, 52 28, 45 41" fill="none" stroke="url(#mg-cashew-shine)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13 36 C16 29, 21 27, 26 23" fill="none" stroke="#9c6e26" strokeWidth="1.2" strokeLinecap="round" opacity=".55"/>
          <image href="/assets/cashew-particle.png" xlinkHref="/assets/cashew-particle.png" x="2" y="2" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
        </symbol>
        <symbol id="mg-dryfruit" viewBox="0 0 60 60">
          <path d="M37 7 C51 12, 57 28, 48 44 C41 55, 20 56, 11 47 C4 39, 6 28, 16 25 C23 23, 26 16, 37 7 Z" fill="url(#mg-cashew-body)" stroke="#caa056" strokeWidth="0.8"/>
          <path d="M35 10 C46 15, 52 28, 45 41" fill="none" stroke="url(#mg-cashew-shine)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13 36 C16 29, 21 27, 26 23" fill="none" stroke="#9c6e26" strokeWidth="1.2" strokeLinecap="round" opacity=".55"/>
          <image href="/assets/cashew-particle.png" xlinkHref="/assets/cashew-particle.png" x="2" y="2" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
        </symbol>
        <symbol id="mg-sugar" viewBox="0 0 60 60"><path d="M13 14L39 7L51 24L44 49L17 52L7 33Z" fill="#eee8d6" fillOpacity=".75" stroke="#fff8e1"/><path d="M13 14L26 29L51 24M26 29L17 52M26 29L39 7" stroke="#fff" opacity=".6" fill="none"/></symbol>
      </defs></svg>
      <div ref={stage} className={styles.stage}>
        <div className={styles.grain} aria-hidden="true" />
        <h1 className="sr-only">{filterProduct ? `Monagrow ${activeProducts[0].name}` : "Monagrow — the taste of purity"}</h1>
        {activeProducts.map((product, index) => (
          <article id={`hero-product-${index}`} key={product.name} data-scene className={styles.scene} style={{ "--scene-accent": product.colour, "--scene-glow": product.glow, "--scene-backdrop": activeBackgrounds[index] } as CSSProperties} aria-label={product.name}>
            <div className={styles.atmosphere} aria-hidden="true" />
            <div className={styles.wordmark} aria-hidden="true" style={{ "--name-size": `${Math.min(18, 146 / product.name.length)}vw` } as CSSProperties}>{product.name}</div>
            <div className={styles.particles} aria-hidden="true">
              {PARTICLES.map((particle, i) => {
                if (product.ingredient === "dryfruit") {
                  return (
                    <img
                      key={i}
                      data-particle
                      src={DRYFRUIT_PARTICLES[i % DRYFRUIT_PARTICLES.length]}
                      alt=""
                      className={styles.particle}
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.depth === 0 ? 0.35 : 0.88,
                        filter: `blur(${particle.depth === 0 ? 2 : particle.size > 60 ? 1 : 0}px) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28))`,
                        transform: `rotate(${particle.rotation}deg)`,
                        objectFit: "contain",
                        pointerEvents: "none",
                      }}
                    />
                  );
                }
                if (product.ingredient === "coffee") {
                  return (
                    <img
                      key={i}
                      data-particle
                      src={COFFEE_PARTICLES[i % COFFEE_PARTICLES.length]}
                      alt=""
                      className={styles.particle}
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.depth === 0 ? 0.35 : 0.88,
                        filter: `blur(${particle.depth === 0 ? 2 : particle.size > 60 ? 1 : 0}px) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.32))`,
                        transform: `rotate(${particle.rotation}deg)`,
                        objectFit: "contain",
                        pointerEvents: "none",
                      }}
                    />
                  );
                }
                return (
                  <svg
                    key={i}
                    data-particle
                    className={styles.particle}
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: particle.size,
                      height: particle.size,
                      opacity: particle.depth === 0 ? 0.25 : 0.7,
                      filter: `blur(${particle.depth === 0 ? 3 : particle.size > 60 ? 2 : 0}px)`,
                      transform: `rotate(${particle.rotation}deg)`,
                    }}
                  >
                    <use href={`#mg-${product.ingredient}`} />
                  </svg>
                );
              })}
            </div>
            <div className={styles.copy}>
              <p className={styles.eyebrow}><span /> THE TASTE OF PURITY</p>
              <h2>{product.title[0]}<br/><em>{product.title[1]}</em></h2>
              {/* Description removed as requested */}
              <button className={styles.quote} onClick={() => onOpenQuoteModal(activeQuoteNames[index])} onPointerMove={event => {
                if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .12}px, ${(event.clientY - bounds.top - bounds.height / 2) * .18}px)`;
              }} onPointerLeave={event => { event.currentTarget.style.transform = ""; }}>Get a Quote</button>
            </div>
            <div className={styles.productStage}>
              <div className={styles.halo} aria-hidden="true" />
              <svg data-orbit className={styles.orbit} viewBox="0 0 500 500" aria-hidden="true"><defs><path id={`mg-orbit-${index}`} d="M250,250 m-220,0 a220,220 0 1,1 440,0 a220,220 0 1,1 -440,0"/></defs><text><textPath href={`#mg-orbit-${index}`} textLength="1382">PACKED AT ORIGIN · MADE FOR THE WORLD · THE TASTE OF PURITY · MONAGROW · </textPath></text></svg>
              <div className={styles.mouseLayer}><div data-pack className={styles.mainPack}><div className={styles.ingredientEntrance}><Image src={`/assets/hero-center-${product.ingredient}.png`} alt={`A wooden bowl of ${product.name.toLowerCase()}`} fill sizes="(max-width: 767px) 90vw, 43vw" priority={index === 0} unoptimized className={styles.packImage}/></div></div></div>
              <div className={styles.productShadow} aria-hidden="true"/>
            </div>
            <div className={`${styles.ingredientCluster} ${styles.clusterLeft}`} style={{ backgroundPosition: product.atlas }} aria-hidden="true"/>
            <div className={`${styles.ingredientCluster} ${styles.clusterRight}`} style={{ backgroundPosition: product.atlas }} aria-hidden="true"/>
            <button id={filterProduct ? `${filterProduct}-hero-pack` : undefined} data-side className={styles.sidePack} onClick={() => onOpenQuoteModal(activeQuoteNames[index])} aria-label={`Get a quote for Monagrow ${product.name}`}><span className={styles.packEntrance}><Image src={product.image} alt={`Monagrow ${product.name}, ${product.size} pack`} fill sizes="(max-width: 767px) 30vw, 21vw" priority={index === 0} className={styles.packImage}/></span></button>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <span className={styles.weight}>{product.size}</span>
              <button onClick={() => {
                if (isSingleProduct) {
                  document.getElementById(filterProduct === "rice" ? "basmati-rice" : "category-collection")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
                } else {
                  onOpenQuoteModal(activeQuoteNames[index]);
                }
              }}>Explore product ↗</button>
            </div>
            <span className={styles.sceneNumber} aria-hidden="true">{isSingleProduct ? "01 / 01" : `0${index + 1} / 04`}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
