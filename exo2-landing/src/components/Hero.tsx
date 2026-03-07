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
      {/* world map dots (simplified continents outline) */}
      <g opacity="0.08">
        {/* N America */}
        <ellipse cx="280" cy="300" rx="130" ry="90" fill="#B8A2E6" />
        {/* S America */}
        <ellipse cx="330" cy="520" rx="70" ry="110" fill="#B8A2E6" />
        {/* Europe */}
        <ellipse cx="700" cy="245" rx="70" ry="55" fill="#B8A2E6" />
        {/* Africa */}
        <ellipse cx="720" cy="440" rx="80" ry="110" fill="#B8A2E6" />
        {/* Asia */}
        <ellipse cx="1020" cy="270" rx="200" ry="110" fill="#B8A2E6" />
        {/* Oceania */}
        <ellipse cx="1180" cy="530" rx="70" ry="45" fill="#B8A2E6" />
      </g>

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
          <circle
            cx={p.x}
            cy={p.y}
            r={p.size + 4}
            fill="#B8A2E6"
            opacity="0.1"
          />
          {/* main dot */}
          <circle cx={p.x} cy={p.y} r={p.size / 2} fill="#B8A2E6" opacity="0.9" />
          {/* open lock icon hint */}
          <text
            x={p.x + p.size / 2 + 3}
            y={p.y + 4}
            fontSize="9"
            fill="#B8A2E6"
            opacity="0.65"
            fontFamily="monospace"
          >
            🔓 {p.label}
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
        ⚠ DONNÉES NON SÉCURISÉES — EXPOSÉES AU CLOUD US
      </text>
    </svg>
  );
}

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className="relative min-h-screen overflow-hidden font-sans"
      style={{ background: "linear-gradient(to bottom, #1F1926, #42137C)" }}
    >
      {/* ---------- animated background ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatedPackets />
      </div>

      {/* ---------- navbar ---------- */}
      <header className="relative z-20 flex flex-row items-center justify-between px-5 py-5 md:px-14 lg:px-20">
        {/* logo */}
        <a href="/" className="flex shrink-0 items-center gap-3">
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3L5 9v11c0 9.5 6.5 18.4 15 21 8.5-2.6 15-11.5 15-21V9L20 3z" fill="#5100FF" opacity="0.25" />
            <path d="M20 3L5 9v11c0 9.5 6.5 18.4 15 21 8.5-2.6 15-11.5 15-21V9L20 3z" stroke="#5100FF" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="flex flex-col leading-none">
            <span style={{ color: "#FDF7FF", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}>DIV</span>
            <span style={{ color: "#B8A2E6", fontSize: "1rem", fontWeight: 400 }}>Protocol</span>
          </div>
        </a>

        {/* nav links — desktop only */}
        <nav className="hidden lg:flex" style={{ gap: "3rem", alignItems: "center" }}>
          {["Solution", "Comment ça marche ?", "Tarifs", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: "rgba(253,247,255,0.8)", fontSize: "1.05rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FDF7FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,247,255,0.8)")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* right actions — desktop */}
        <div className="hidden lg:flex items-center" style={{ gap: "1rem" }}>
          <div className="flex items-center" style={{ gap: "0.4rem", color: "rgba(253,247,255,0.65)", fontSize: "1rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
            </svg>
            <span>FR</span>
          </div>
          <a
            href="tel:+33"
            className="flex items-center"
            style={{ gap: "0.5rem", borderRadius: "9999px", border: "1px solid #5100FF", padding: "0.6rem 1.25rem", fontSize: "1rem", fontWeight: 500, color: "#5100FF", transition: "background 0.25s" }}
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
            style={{ borderRadius: "9999px", backgroundColor: "#FDF7FF", padding: "0.6rem 1.5rem", fontSize: "1rem", fontWeight: 600, color: "#1F1926", transition: "background 0.25s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FDF7FF")}
          >
            Nous contacter
          </a>
        </div>

        {/* burger button — mobile only */}
        <button
          className="lg:hidden flex flex-col justify-center items-center"
          style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer", gap: "5px", padding: 4 }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "opacity 0.25s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#FDF7FF", borderRadius: 2, transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      {/* ---------- mobile menu drawer ---------- */}
      {menuOpen && (
        <div
          className="lg:hidden relative z-10 flex flex-col px-6 pb-6 pt-2"
          style={{ background: "rgba(31,25,38,0.97)", borderBottom: "1px solid rgba(184,162,230,0.15)" }}
        >
          {["Solution", "Comment ça marche ?", "Tarifs", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#FDF7FF", fontSize: "1.1rem", fontWeight: 500, padding: "0.85rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {item}
            </a>
          ))}
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a
              href="tel:+33"
              style={{ borderRadius: "9999px", border: "1px solid #5100FF", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: 500, color: "#5100FF", textAlign: "center", transition: "background 0.25s" }}
            >
              Appelez-nous
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              style={{ borderRadius: "9999px", backgroundColor: "#FDF7FF", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: 600, color: "#1F1926", textAlign: "center" }}
            >
              Nous contacter
            </a>
          </div>
        </div>
      )}


      {/* ---------- hero content ---------- */}
      <div
        className="relative z-10 flex flex-col items-center px-6 pb-32 pt-24 text-center md:px-12 md:pt-36 lg:px-24 lg:pt-44"
      >
        {/* stat-choc headline */}
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ color: "#FDF7FF", maxWidth: "56rem", fontWeight: 700, lineHeight: 1.15 }}
          className="text-3xl md:text-5xl lg:text-6xl"
        >
          Avocats&nbsp;:{" "}
          <span style={{ color: "#5100FF" }}>85%</span> des cabinets
          exposent leurs dossiers clients sur le Cloud&nbsp;US.
        </motion.h1>

        {/* solution text */}
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ color: "#5100FF", maxWidth: "42rem", marginTop: "1.5rem", lineHeight: 1.7, fontWeight: 600 }}
          className="text-lg md:text-xl"
        >
          Reprenez le contrôle de vos données avec une alternative{" "}
          <strong style={{ color: "#FDF7FF" }}>souveraine</strong>,{" "}
          <strong style={{ color: "#FDF7FF" }}>zero-knowledge</strong> et{" "}
          <strong style={{ color: "#FDF7FF" }}>conforme&nbsp;RGPD</strong>.
        </motion.p>

        {/* CTA */}
        <motion.a
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          href="#discover"
          style={{
            marginTop: "4rem",
            backgroundColor: "#B8A2E6",
            color: "#FDF7FF",
            borderRadius: "9999px",
            padding: "1rem 2.5rem",
            fontWeight: 600,
            fontSize: "1rem",
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
