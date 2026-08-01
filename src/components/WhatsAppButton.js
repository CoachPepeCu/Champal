"use client";

import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "5218180001064";
const MESSAGE = "Hola, me gustaría más información sobre el Colegio Champal.";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/20"
      style={{ background: "#25D366" }}
    >
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#25D366", opacity: 0.35 }} />
      <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-white">
        <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.27-.1-.46-.15-.66.15-.2.3-.76.94-.93 1.14-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.2-.24-.57-.48-.5-.66-.5-.17-.01-.37-.01-.56-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.7-.7 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.12-.26-.2-.56-.34z" />
        <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.9.53 3.68 1.44 5.2L2 22l4.94-1.4A9.96 9.96 0 0012.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.15c-1.7 0-3.28-.5-4.6-1.36l-.33-.2-3.06.87.86-2.97-.21-.34a8.14 8.14 0 01-1.28-4.35c0-4.5 3.66-8.15 8.16-8.15 4.5 0 8.15 3.66 8.15 8.15 0 4.5-3.66 8.15-8.15 8.15z" />
      </svg>
    </motion.a>
  );
}
