"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import styles from "./AboutMonagrow.module.css";

export default function AboutMonagrow() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultPlaybackRate = 1.7;
      videoRef.current.playbackRate = 1.7;
    }
  }, []);

  const handleApplySpeed = () => {
    if (videoRef.current && videoRef.current.playbackRate !== 1.7) {
      videoRef.current.playbackRate = 1.7;
    }
  };

  return (
    <section id="about-us" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.container}>
        <div className={styles.visual}>
          <video
            ref={videoRef}
            key="monagrow_showcase_video"
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = 1.7;
              e.currentTarget.playbackRate = 1.7;
            }}
            onPlay={handleApplySpeed}
            aria-label="Monagrow product showcase"
          >
            <source src="/Monagrow%20New.mp4" type="video/mp4" />
            <source src="/Monagrow New.mp4" type="video/mp4" />
            <source src="/monagrow-new.mp4" type="video/mp4" />
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
