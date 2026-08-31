"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TierraGiratoria.module.css";

/**
 * Tierra decorativa animada exclusivamente con CSS.
 * `size` acepta un numero (pixeles) o cualquier longitud CSS valida.
 * `duration` acepta segundos como numero o un tiempo CSS (por ejemplo, "24s").
 */
export default function TierraGiratoria({
  size = 280,
  duration = 18,
  className = "",
}) {
  const earthRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const earthSize = typeof size === "number" ? `${size}px` : size;
  const earthDuration =
    typeof duration === "number" ? `${duration}s` : duration;

  useEffect(() => {
    const earth = earthRef.current;
    if (!earth) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(earth);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={earthRef}
      className={`${styles.earth} ${className}`.trim()}
      style={{
        "--earth-size": earthSize,
        "--earth-duration": earthDuration,
        "--earth-play-state": isVisible ? "running" : "paused",
      }}
      aria-hidden="true"
    >
      <span className={styles.textureTrack} />
    </span>
  );
}
