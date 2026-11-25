"use client";

import Link from "next/link";

import styles from "./AboutMonagrow.module.css";

export default function AboutMonagrow() {
  return (
    <section id="about-us" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.container}>
        <div className={styles.visual}>
          <video key="monagrow_showcase_video"
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Monagrow product showcase"
          >
            <source src="/Monagrow%201.mp4" type="video/mp4" />
            <source src="/Monagrow 1.mp4" type="video/mp4" />
            <source src="/monagrow-1.mp4" type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
        <div className={styles.content}>
          <h2 id="about-heading" className={styles.title}>Our Purpose</h2>
          <div className={styles.copy}>
            <p>Good ingredients. Lasting partnerships.</p>
            <p>We connect origin mills and growers with businesses around the world, bringing Basmati rice, estate coffee, dry fruits, and sugar closer to your customers.</p>
            <p>From the first sourcing conversation to the next shipment, we make wholesale trade easier to navigate.</p>
            <p>Our purpose is simple: dependable ingredients, direct relationships, and a partnership that grows with your business.</p>
          </div>
          <Link href="/about-us" className={styles.cta}>Learn More</Link>
        </div>
      </div>
    </section>
  );
}
