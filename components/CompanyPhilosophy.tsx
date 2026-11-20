"use client";

import { useEffect, useRef } from "react";
import OriginJourney from "./OriginJourney";
import styles from "./CompanyPhilosophy.module.css";

export default function CompanyPhilosophy() {
  const founderNote = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = founderNote.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const letter = root.querySelector<HTMLElement>("blockquote");
    if (!letter) return;
    const words = Array.from(letter.querySelectorAll<HTMLElement>("[data-note-word]"));
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (disposed) return;
      const bounds = letter.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1,
        (window.innerHeight * .85 - bounds.top) / (bounds.height + window.innerHeight * .3)));
      const revealedWords = scrollProgress * (words.length + 3);
      words.forEach((word, index) => {
        const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (revealedWords - index) / 3));
        word.style.opacity = String(.18 + progress * .82);
      });
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    schedule();
    document.fonts.ready.then(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      root.querySelectorAll<HTMLElement>("[data-note-word]").forEach(word => {
        word.style.removeProperty("opacity");
      });
    };
  }, []);
  return (
    <section id="philosophy" className={styles.section} aria-labelledby="origin-heading">
      <div className={styles.container}>
        <header ref={founderNote} className={styles.founderIntro}>
          <p className={styles.founderBadge}><span aria-hidden="true" />Monagrow Founder&apos;s Note</p>
          <h2 id="origin-heading" className={styles.founderTitle}>Good ingredients.<br /><em>Relationships that last.</em></h2>
          <figure className={styles.founderCard}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={styles.founderLetter}>
              <p data-note-text className={styles.revealParagraph}>{"At Monagrow, we believe exceptional ingredients begin with the people who grow them. Behind every grain, every bean, and every harvest is care that deserves to be carried forward.".split(" ").map((word, index) => <span key={index}><span data-note-word className={styles.revealWord}>{word}</span>{" "}</span>)}</p>
              <p data-note-text className={styles.revealParagraph}>{"Our purpose is to bring growers and businesses closer together. Through direct relationships, clear specifications, and thoughtful selection, we want to make sourcing feel simpler and more personal.".split(" ").map((word, index) => <span key={index}><span data-note-word className={styles.revealWord}>{word}</span>{" "}</span>)}</p>
              <p data-note-text className={styles.revealParagraph}>{"Whether it is Basmati rice, estate coffee, dry fruits, or sugar, our approach stays the same: respect the origin, pay attention to the details, and care for every lot from the first conversation to dispatch.".split(" ").map((word, index) => <span key={index}><span data-note-word className={styles.revealWord}>{word}</span>{" "}</span>)}</p>
              <p data-note-text className={styles.revealParagraph}>{"We see every order as the beginning of a relationship. Thank you for being part of the Monagrow journey. We look forward to growing together.".split(" ").map((word, index) => <span key={index}><span data-note-word className={styles.revealWord}>{word}</span>{" "}</span>)}</p>
            </blockquote>
            <figcaption className={styles.founderFooter}>
              <div className={styles.founderSignature}><strong>With gratitude,</strong><span>Founder, Monagrow</span></div>
              <span className={styles.founderPromise}><span aria-hidden="true" />Rooted in origin. Built on trust.</span>
            </figcaption>
          </figure>
        </header>
      </div>
      <OriginJourney />
    </section>
  );
}
