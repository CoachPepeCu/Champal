"use client";

export default function GlowButton({ href, children, className = "" }) {
  return (
    <span className="relative inline-block group/glow">
      <span
        className="absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover/glow:opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, var(--color-gold), var(--color-accent), var(--color-gold-light), var(--color-accent), var(--color-gold))",
        }}
      />
      <a
        href={href}
        className={`relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-light transition-colors duration-200 ${className}`}
      >
        {children}
      </a>
    </span>
  );
}
