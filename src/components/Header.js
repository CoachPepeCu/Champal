"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Académico", href: "#academico" },
  { label: "Admisiones", href: "#admisiones" },
  { label: "Vida Estudiantil", href: "#vida-estudiantil" },
  { label: "Comunidad", href: "#comunidad" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Image
              src="/logo-champal.svg"
              alt="Colegio Champal"
              width={140}
              height={60}
              priority
              className="h-10 w-auto"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-900 hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a
              href="#admisiones"
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-light transition-colors duration-200"
            >
              Agenda una visita
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-primary"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-neutral-100 bg-white"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#admisiones"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Agenda una visita
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
