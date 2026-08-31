import Image from "next/image";
import styles from "./PlanetaOrbital.module.css";

export default function PlanetaOrbital({
  active,
  label,
  texture,
  diameter,
  orbitRadius,
  orbitDuration,
  orbitArc,
  floatDuration,
  floatOffset,
  fontSize,
  glow = "rgb(80 190 255 / 16%)",
  emphasized = false,
  className = "",
}) {
  const letters = Array.from(label);
  const step = letters.length > 1 ? orbitArc / (letters.length - 1) : 0;

  return (
    <div
      className={`${styles.scene} ${active ? styles.active : ""} ${emphasized ? styles.emphasized : ""} ${className}`.trim()}
      style={{
        "--planet-diameter": diameter,
        "--planet-orbit-radius": orbitRadius,
        "--planet-orbit-duration": `${orbitDuration}s`,
        "--planet-float-duration": `${floatDuration}s`,
        "--planet-float-offset": floatOffset,
        "--planet-font-size": fontSize,
        "--planet-glow": glow,
      }}
      role="img"
      aria-label={label}
    >
      <span className={styles.planet} aria-hidden="true">
        <Image
          src={texture}
          alt=""
          fill
          sizes="(min-width: 1024px) 11vw, 56px"
          className={styles.texture}
        />
      </span>
      <span className={styles.ring} aria-hidden="true">
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={styles.letter}
            style={{ "--letter-angle": `${-orbitArc / 2 + index * step}deg` }}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
    </div>
  );
}
