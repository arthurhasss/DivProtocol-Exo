"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const words = [
  { text: "Dans" },
  { text: "un" },
  { text: "monde" },
  { text: "où" },
  { text: "vos" },
  { text: "données" },
  { text: "sensibles", highlight: true },
  { text: "peuvent" },
  { text: "disparaître," },
  { text: "nous" },
  { text: "avons" },
  { text: "créé" },
  { text: "DIV,", highlight: true },
  { text: "le" },
  { text: "drive" },
  { text: "souverain" },
  { text: "et" },
  { text: "sécurisé" },
  { text: "par" },
  { text: "la" },
  { text: "blockchain" },
  { text: "qui" },
  { text: "vous" },
  { text: "appartient" },
  { text: "POUR", highlight: true },
  { text: "TOUJOURS.", highlight: true },
];

const icons = [
  // Fichier PDF
  <svg key="pdf" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px", color: "#B8A2E6" }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
  </svg>,
  // Bouclier
  <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px", color: "#B8A2E6" }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  // Cadenas ouvert
  <svg key="lock" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px", color: "#B8A2E6" }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0" />
  </svg>,
];

export default function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        background: "linear-gradient(to bottom, #1B0D35, #2D1155)",
        padding: "100px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        ref={ref}
        style={{
          maxWidth: "820px",
          textAlign: "center",
        }}
      >
        {/* Icônes animées */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "32px", display: "flex", justifyContent: "center", gap: "16px" }}
        >
          {icons.map((icon, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              {icon}
            </motion.span>
          ))}
        </motion.div>

        {/* Texte mot par mot */}
        <p
          style={{
            fontSize: "clamp(22px, 3.5vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#FDF7FF",
            margin: 0,
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}
              style={{
                display: "inline-block",
                marginRight: "0.3em",
                color: word.highlight ? "#B8A2E6" : "#FDF7FF",
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </p>
      </motion.div>
    </section>
  );
}
