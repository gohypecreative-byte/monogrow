"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { JOURNEY_STAGES } from "./journeyStages";
import styles from "./OriginJourney.module.css";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const number = (index: number) => String(index + 1).padStart(2, "0");

export default function OriginJourney() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLDivElement | null)[]>([]);
  const progressBar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    const root = track.current;
    const viewport = stage.current;
    if (!root || !viewport) return;
    const media = window.matchMedia("(min-width: 1000px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let current: number | undefined;
    let lastTime = 0;
    let lastActive = -1;
    const update = (time: number) => {
      frame = 0;
      if (!media.matches) return;
      const stickyTop = parseFloat(getComputedStyle(viewport).top) || 0;
      const range = Math.max(1, root.offsetHeight - viewport.offsetHeight);
      const target = clamp((stickyTop - root.getBoundingClientRect().top) / range) * (JOURNEY_STAGES.length - 1);
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      if (current === undefined) current = target;
      current += (target - current) * (1 - Math.exp(-elapsed / 110));
      if (Math.abs(target - current) < .001) current = target;
      images.current.forEach((image, index) => {
        if (!image) return;
        const local = index === 0 ? 1 : clamp(current! - index + 1);
        const eased = local * local * (3 - 2 * local);
        image.style.clipPath = `inset(${(1 - eased) * 100}% 0 0 0)`;
        image.style.setProperty("--photo-scale", String(1.04 - eased * .04));
      });
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${current / (JOURNEY_STAGES.length - 1)})`;
      const next = Math.round(current);
      if (next !== lastActive) { lastActive = next; setActive(next); }
      if (target !== current) frame = requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
      current = undefined;
      lastTime = 0;
      lastActive = -1;
      root.dataset.scroll = String(media.matches);
      setScrollEnabled(media.matches);
      images.current.forEach(image => {
        image?.style.removeProperty("clip-path");
        image?.style.removeProperty("--photo-scale");
      });
      progressBar.current?.style.removeProperty("transform");
      schedule();
    };
    configure();
    const navigation = document.querySelector<HTMLElement>(".monagrow-hero-nav");
    const measureNavigation = () => {
      root.style.setProperty("--journey-top", `${(navigation?.offsetHeight ?? 96) + 16}px`);
      schedule();
    };
    const resize = new ResizeObserver(measureNavigation);
    measureNavigation();
    resize.observe(root);
    resize.observe(viewport);
    if (navigation) resize.observe(navigation);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", configure);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", configure);
      delete root.dataset.scroll;
    };
  }, []);

  useEffect(() => {
    const viewport = stage.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        viewport.dataset.entered = "true";
        observer.disconnect();
      }
    }, { threshold: .2 });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

function jump(index: number) {
    if (scrollEnabled && track.current && stage.current) {
      const top = parseFloat(getComputedStyle(stage.current).top) || 0;
      const range = track.current.offsetHeight - stage.current.offsetHeight;
      window.scrollTo({ top: window.scrollY + track.current.getBoundingClientRect().top - top + index / (JOURNEY_STAGES.length - 1) * range, behavior: "smooth" });
    } else setActive(index);
  }

return (
    <div ref={track} className={styles.track}>
      <div ref={stage} className={styles.stage} aria-labelledby="journey-heading">
        <div className={styles.canvas}>
          <div className={styles.progress} aria-hidden="true"><span ref={progressBar} style={{ transform: `scaleX(${active / (JOURNEY_STAGES.length - 1)})` }} /></div>
          <header className={styles.heading}>
            <div>
              <h2 id="journey-heading">From harvest.<br /><em>To your business.</em></h2>
            </div>
          </header>
          <div className={styles.editorial}>
            <div className={styles.details}>
              <div className={styles.copyStack} id="journey-details">
                {JOURNEY_STAGES.map((entry, index) => (
                  <div key={entry.name} className={styles.activeCopy} data-current={active === index} aria-hidden={active !== index} inert={active !== index}>
                    <h3>{entry.title}</h3>
                    <p>{entry.copy}</p>

                  </div>
                ))}
              </div>
            </div>
            <nav className={styles.navigation} aria-label="Our sourcing journey">
              {JOURNEY_STAGES.map((entry, index) => (
                <button type="button" key={entry.name} aria-current={active === index ? "step" : undefined} aria-controls="journey-details" onClick={() => jump(index)}>
                  <span>{number(index)}</span>{entry.name}
                </button>
              ))}
            </nav>
          </div>

        </div>
        <div className={styles.imageStack}>
          {JOURNEY_STAGES.map((entry, index) => (
            <div key={entry.name} ref={element => { images.current[index] = element; }} className={styles.photo} data-current={active === index} aria-hidden={active !== index} style={{ zIndex: index } as CSSProperties}>
              <Image src={entry.image} alt={entry.alt} fill sizes="(max-width: 999px) 100vw, 40vw" className={styles.image} />
            </div>
          ))}
        </div>
        <div className={styles.introStrip} aria-hidden="true">
          {JOURNEY_STAGES.slice(0, 3).map((entry, index) => <div key={entry.name} style={{ "--column": index } as CSSProperties}><Image src={entry.image} alt="" fill sizes="30vw" /></div>)}
        </div>
      </div>
    </div>
  );
}
