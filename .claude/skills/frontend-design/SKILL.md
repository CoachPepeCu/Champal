---
name: frontend-design
description: Design system rules for building polished, agency-quality UI for this project. Use whenever generating or editing components, pages, or layouts.
---

# Frontend Design Skill — ViveChampal

Apply these rules to every component and page you build or edit. The goal is to avoid the generic "AI-generated" look and instead produce something that reads as designed by a professional agency.

## Typography scale
Use a consistent modular scale — do not pick random font sizes.
- Display: 3.5rem / 4rem (hero headlines)
- H1: 2.5rem
- H2: 1.875rem
- H3: 1.5rem
- Body: 1rem
- Small: 0.875rem
- Line height: 1.1–1.2 for headings, 1.5–1.7 for body text
- One font family for headings, one for body (max two families total)

## Spacing system
Use an 8px base grid for all margin, padding, and gap values (8, 16, 24, 32, 48, 64, 96, 128px). Never use arbitrary values like 13px or 22px.

## Color tokens
Define and reuse tokens instead of raw hex codes:
- `primary` — main brand color, used for CTAs and key accents
- `neutral-*` — a grayscale ramp (background, borders, muted text)
- `accent` — a secondary color for highlights, used sparingly
Avoid pure black (#000) and pure white (#fff) — use near-black/near-white neutrals for softer contrast.

## Component patterns
- Buttons: define default, hover, active, and disabled states explicitly
- Cards: consistent padding, border-radius, and shadow across all cards
- Forms: consistent label placement, input height, and focus states
- Sections: consistent vertical padding between page sections (use the spacing system)

## Motion (Framer Motion)
- Scroll-triggered fade/slide-in reveals for sections as they enter the viewport
- Staggered reveals for lists/grids of cards (children animate in sequence, not all at once)
- Smooth hover transitions on interactive elements (150–250ms ease-out)
- Avoid excessive or distracting motion — subtle and purposeful only

## Avoid the generic AI aesthetic
- No default centered-hero-with-gradient-blob unless it's genuinely the best fit
- No purple-to-blue gradient as a default choice — pick colors intentional to the brand
- No filler Lorem Ipsum in final output — ask for real copy or write realistic placeholder copy
- Vary section layouts (don't repeat the same centered-column pattern for every section)

## Performance
- Use `next/image` for all images (lazy loading, responsive sizing)
- Use `next/font` for font loading (avoid layout shift)
- Keep bundle size in mind — avoid unnecessary client-side JS for static content
