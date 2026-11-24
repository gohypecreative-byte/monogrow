"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./WholesaleCalculator.module.css";

const collection = [
  { name: "Basmati rice", note: "Extra long grain. Exceptional aroma.", image: "monagrow-rice-pack-v2.png" },
  { name: "Estate coffee", note: "Rich character, from origin to cup.", image: "monagrow-coffee-pack-v2.png" },
  { name: "Royal dry fruits", note: "A carefully selected collection.", image: "monagrow-mix-dryfruits-packaging.png" },
  { name: "Refined sugar", note: "Everyday sweetness, thoughtfully sourced.", image: "monagrow-sugar-pack-v2.png" },
];

export default function EstimateShowcase({ selectedProduct }: { selectedProduct: string | null }) {
  const [rotatingIndex, setActive] = useState(0);
  const productKeys = ["rice", "coffee", "dryfruit", "sugar"];
  const active = selectedProduct === null ? rotatingIndex : productKeys.indexOf(selectedProduct);
  const root = useRef<HTMLElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (selectedProduct !== null) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (root.current) observer.observe(root.current);
    const timer = window.setInterval(() => {
      if (visible && !paused.current && !document.hidden && !media.matches) {
        setActive(value => (value + 1) % collection.length);
      }
    }, 5000);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [selectedProduct]);

  return (
    <aside ref={root} className={styles.showcase} aria-label="Our product collection"
      onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) paused.current = false; }}>
      <header className={styles.showcaseHeading}>
        <h2 id="estimate-heading">Good ingredients.<br /><em>Your next order.</em></h2>
        <p>Choose your product. Plan the details.<br />Let’s grow your business together.</p>
      </header>
      <div className={styles.productStage}>
        {collection.map((product, index) => (
          <div key={product.name} className={styles.productSlide} data-active={index === active} aria-hidden={index !== active}>
            <div className={styles.packImage}><Image src={`/assets/${product.image}`} alt={product.name + " Monagrow packaging"} fill sizes="(max-width: 767px) 65vw, 32vw" /></div>
            <div className={styles.productCaption}><h3>{product.name}</h3><p>{product.note}</p></div>
          </div>
        ))}
      </div>
    </aside>
  );
}
