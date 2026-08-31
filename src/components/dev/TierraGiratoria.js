import styles from "./TierraGiratoria.module.css";

/**
 * Planeta Tierra experimental animado exclusivamente con CSS.
 *
 * `size` acepta un numero (pixeles) o cualquier longitud CSS valida.
 * `duration` acepta segundos como numero o un tiempo CSS (por ejemplo, "24s").
 */
export default function TierraGiratoria({
  size = 280,
  duration = 18,
  className = "",
  label = "Planeta Tierra girando",
}) {
  const earthSize = typeof size === "number" ? `${size}px` : size;
  const earthDuration =
    typeof duration === "number" ? `${duration}s` : duration;

  return (
    <div
      className={`${styles.earth} ${className}`.trim()}
      style={{
        "--earth-size": earthSize,
        "--earth-duration": earthDuration,
      }}
      role="img"
      aria-label={label}
    >
      <span className={styles.textureTrack} aria-hidden="true" />
    </div>
  );
}
