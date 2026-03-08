"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ---------- animation variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
  }),
};

/* ---------- floating data packets ---------- */
type Packet = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  size: number;
};

const LABELS = [
  "contrat_bail.pdf",
  "testament_martin.docx",
  "dossier_pénal_42.zip",
  "mandat_cession.pdf",
  "PV_audience.docx",
  "facture_honoraires.xlsx",
  "NDA_confidentiel.pdf",
  "extrait_kbis.pdf",
  "jugement_TGI.docx",
  "procuration_2024.pdf",
  "expertise_judiciaire.zip",
  "mise_en_demeure.pdf",
];

function makePackets(): Packet[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 100 + (i * 97) % 1240,
    y: 80 + (i * 61) % 640,
    vx: ((i % 3) - 1) * 0.35,
    vy: ((i % 2 === 0 ? 1 : -1)) * 0.25,
    label: LABELS[i % LABELS.length],
    size: 8 + (i % 4) * 2,
  }));
}

function AnimatedPackets() {
  const [packets, setPackets] = useState<Packet[]>(makePackets);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      setPackets((prev) =>
        prev.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;
          if (nx < 0 || nx > 1440) nvx = -nvx;
          if (ny < 0 || ny > 800) nvy = -nvy;
          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      

      {/* connection lines between packets */}
      {packets.map((p, i) =>
        i < packets.length - 1 ? (
          <line
            key={`l-${p.id}`}
            x1={p.x}
            y1={p.y}
            x2={packets[i + 1].x}
            y2={packets[i + 1].y}
            stroke="#5100FF"
            strokeWidth="0.5"
            opacity="0.2"
            strokeDasharray="6 4"
          />
        ) : null
      )}

      {/* data packets */}
      {packets.map((p) => (
        <g key={p.id}>
          {/* glow */}
          <circle cx={p.x} cy={p.y} r={p.size + 4} fill="#B8A2E6" opacity="0.1" />
          {/* document icon (replaces dot) */}
          <g transform={`translate(${p.x - 5}, ${p.y - 6.5})`} opacity="0.9">
            <path d="M0 0 L6 0 L10 4 L10 13 L0 13 Z" fill="#B8A2E6" />
            <path d="M6 0 L10 4 L6 4 Z" fill="#5100FF" opacity="0.5" />
            <line x1="2" y1="6" x2="8" y2="6" stroke="#1F1926" strokeWidth="1" opacity="0.6" />
            <line x1="2" y1="8" x2="8" y2="8" stroke="#1F1926" strokeWidth="1" opacity="0.6" />
            <line x1="2" y1="10" x2="5.5" y2="10" stroke="#1F1926" strokeWidth="1" opacity="0.6" />
          </g>
          {/* label (no emoji) */}
          <text
            x={p.x + 9}
            y={p.y + 4}
            fontSize="9"
            fill="#B8A2E6"
            opacity="0.65"
            fontFamily="monospace"
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* grid lines */}
      {Array.from({ length: 13 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 120}
          y1="0"
          x2={i * 120}
          y2="800"
          stroke="#B8A2E6"
          strokeWidth="0.3"
          opacity="0.12"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 114}
          x2="1440"
          y2={i * 114}
          stroke="#B8A2E6"
          strokeWidth="0.3"
          opacity="0.12"
        />
      ))}

      {/* "UNSECURED DATA" floating label */}
      <text
        x="50%"
        y="92%"
        textAnchor="middle"
        fontSize="11"
        fill="#B8A2E6"
        opacity="0.3"
        fontFamily="monospace"
        letterSpacing="6"
      >
      </text>
    </svg>
  );
}

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className="relative min-h-screen overflow-hidden font-sans"
      style={{ background: "linear-gradient(to bottom, #080510, #1B0D35)" }}
    >
      {/* ---------- animated background ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatedPackets />
      </div>

      {/* ---------- navbar ---------- */}
      <header className="relative z-20 flex flex-row items-center justify-between px-5 py-5 md:px-14 nav:px-20">
        {/* logo */}
        <a href="/" className="flex shrink-0 items-center gap-3">
          <img src="/logodiv.png" alt="DIV Protocol" style={{ height: "70px", width: "164.4px", objectFit: "contain" }} />
        </a>

        {/* nav links — desktop only */}
        <nav className="hidden nav:flex" style={{ gap: "3rem", alignItems: "center" }}>
          {["Solution", "Comment ça marche ?", "Tarifs", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: "rgba(253,247,255,0.8)", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FDF7FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,247,255,0.8)")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* right actions — desktop */}
        <div className="hidden nav:flex items-center" style={{ gap: "1rem" }}>
          <div className="flex items-center" style={{ gap: "0.4rem", color: "rgba(253,247,255,0.65)", fontSize: "0.875rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
            </svg>
            <span>FR</span>
          </div>
          <a
            href="tel:+33"
            className="flex items-center"
            style={{ gap: "0.5rem", borderRadius: "9999px", border: "1px solid #5100FF", padding: "0.6rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#5100FF", transition: "background 0.25s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(81,0,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Appelez-nous
          </a>
          <a
            href="#contact"
            style={{ borderRadius: "9999px", backgroundColor: "#FDF7FF", padding: "0.6rem 1.5rem", fontSize: "0.875rem", fontWeight: 600, color: "#1F1926", transition: "background 0.25s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FDF7FF")}
          >
            Nous contacter
          </a>
        </div>

        {/* burger button — mobile only */}
        <button
          className="nav:hidden flex flex-col justify-center items-center"
          style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer", gap: "5px", padding: 4 }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "opacity 0.25s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      {/* ---------- mobile drawer (left slide-in) ---------- */}
      {/* backdrop */}
      {menuOpen && (
        <div
          className="nav:hidden fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* drawer panel */}
      <div
        className="nav:hidden fixed top-0 right-0 z-40 flex flex-col h-full"
        style={{
          width: "280px",
          background: "#FDF7FF",
          boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          padding: "0",
        }}
      >
        {/* drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/logodiv.png" alt="DIV Protocol" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#1F1926", fontSize: "24px", lineHeight: 1 }}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* nav links */}
        <nav style={{ display: "flex", flexDirection: "column", padding: "12px 0", flex: 1 }}>
          {["Solution", "Comment ça marche ?", "Tarifs", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#1F1926", fontSize: "1rem", fontWeight: 500, padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* bottom actions */}
        <div style={{ padding: "20px 20px 32px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#888", fontSize: "0.875rem", marginBottom: "4px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
            </svg>
            <span>EN</span>
          </div>
          <a
            href="tel:+33"
            style={{ borderRadius: "9999px", border: "1px solid #5100FF", padding: "12px 20px", fontSize: "0.875rem", fontWeight: 500, color: "#5100FF", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5100FF">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Appelez-nous
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{ borderRadius: "9999px", backgroundColor: "#1F1926", padding: "12px 20px", fontSize: "0.875rem", fontWeight: 600, color: "#FDF7FF", textAlign: "center", textDecoration: "none" }}
          >
            Nous contacter
          </a>
        </div>
      </div>


      {/* ---------- hero content ---------- */}
      <div
        className="relative z-10 flex flex-col items-center px-6 pb-32 pt-24 text-center md:px-12 md:pt-36 lg:px-24 lg:pt-44"
      >
        {/* stat badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(81,0,255,0.15)",
            border: "1px solid rgba(81,0,255,0.4)",
            borderRadius: "9999px",
            padding: "10px 20px",
            color: "#B8A2E6",
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "#5100FF", fontWeight: 800, fontSize: "20px" }}>85%</span>
          des cabinets d'avocats exposent leurs dossiers sur le Cloud&nbsp;US
        </motion.div>

        {/* headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ color: "#FDF7FF", maxWidth: "52rem", fontWeight: 700, lineHeight: 1.15, fontSize: "clamp(28px, 4vw, 52px)" }}
          className="text-center"
        >
          Reprenez le contrôle de vos données
        </motion.h1>

       

        {/* CTA */}
        <motion.a
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          href="#discover"
          style={{
            marginTop: "64px",
            backgroundColor: "#5100FF",
            color: "#FDF7FF",
            borderRadius: "9999px",
            padding: "14px 32px",
            fontWeight: 600,
            fontSize: "16px",
            display: "inline-block",
            transition: "filter 0.25s, box-shadow 0.25s",
          }}
          whileHover={{ filter: "brightness(1.1)", boxShadow: "0 0 32px rgba(184,162,230,0.5)" }}
        >
          Découvrir DIV Protocol
        </motion.a>
      </div>
    </section>
  );
}
