"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Presentacion() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    if (started) return;
    setStarted(true);
    videoRef.current?.play();
  };

  const handleEnded = () => {
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => router.push("/"), 900);
    }, 2000);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-primary">
      {/* Fills any letterbox/pillarbox space around the video */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0a1730 0%, #172e56 45%, #2a4a7f 100%)",
        }}
      />

      <video
        ref={videoRef}
        src="/videos/vive-champal-reveal.mp4"
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {!started && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-10 inset-x-0 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={handleStart}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-sky-400/20 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-sky-400/30 transition-colors duration-200"
          >
            Haz clic para comenzar <span>→</span>
          </motion.button>
        </motion.div>
      )}

      {/* Exit transition overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-primary"
      />
    </div>
  );
}
