"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(81,0,255,0.12)" />
        <path d="M20 8L10 12v9c0 6.6 4.5 12.8 10 14.6 5.5-1.8 10-8 10-14.6v-9L20 8z" fill="#5100FF" opacity="0.25" />
        <path d="M20 8L10 12v9c0 6.6 4.5 12.8 10 14.6 5.5-1.8 10-8 10-14.6v-9L20 8z" stroke="#5100FF" strokeWidth="1.5" fill="none" />
        <path d="M15 20l3 3 7-7" stroke="#5100FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tag: "Souveraineté",
    title: "Vos données restent en France",
    problem: "Aujourd'hui, vos fichiers clients transitent par des serveurs américains soumis au Cloud Act.",
    solution: "DIV Protocol héberge exclusivement sur des datacenters certifiés HDS en France. Vous restez propriétaire à 100 % de vos données.",
    stat: "100% hébergement FR",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(81,0,255,0.12)" />
        <rect x="13" y="19" width="14" height="10" rx="2" fill="#5100FF" opacity="0.2" stroke="#5100FF" strokeWidth="1.5" />
        <path d="M15 19v-3a5 5 0 0 1 10 0v3" stroke="#5100FF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="24" r="1.5" fill="#5100FF" />
      </svg>
    ),
    tag: "Zero-Knowledge",
    title: "Chiffrement de bout en bout",
    problem: "Les solutions cloud classiques peuvent lire vos documents — et les autorités étrangères aussi.",
    solution: "Architecture zero-knowledge : seul votre cabinet détient les clés de déchiffrement. Même nous, n'avons aucun accès à vos fichiers.",
    stat: "Clé AES-256 côté client",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(81,0,255,0.12)" />
        <rect x="11" y="12" width="18" height="18" rx="2" stroke="#5100FF" strokeWidth="1.5" fill="none" />
        <path d="M15 20h10M15 24h6" stroke="#5100FF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 16h5" stroke="#5100FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    tag: "RGPD & Secret pro",
    title: "Conformité intégrale",
    problem: "Un cabinet non conforme RGPD risque jusqu'à 4 % de son CA annuel en sanction. Le secret professionnel n'est pas négociable.",
    solution: "DIV Protocol est conçu pour les professions réglementées : journaux d'accès, DPA intégré, exports conformes CNIL en un clic.",
    stat: "Conforme RGPD / CNIL",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

function Card({ card, index }: { card: typeof cards[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        flex: "1 1 280px",
        minWidth: 0,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(184,162,230,0.15)",
        borderRadius: "20px",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backdropFilter: "blur(8px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      whileHover={{
        borderColor: "rgba(81,0,255,0.5)",
        boxShadow: "0 8px 40px rgba(81,0,255,0.15)",
      }}
    >
      {/* icon */}
      {card.icon}

      {/* tag */}
      <span
        style={{
          display: "inline-block",
          backgroundColor: "rgba(81,0,255,0.15)",
          border: "1px solid rgba(81,0,255,0.3)",
          borderRadius: "9999px",
          padding: "3px 12px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#B8A2E6",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          alignSelf: "flex-start",
        }}
      >
        {card.tag}
      </span>

      {/* title */}
      <h3 style={{ color: "#FDF7FF", fontSize: "20px", fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
        {card.title}
      </h3>

      {/* problem */}
      <div
        style={{
          background: "rgba(255,60,60,0.07)",
          border: "1px solid rgba(255,60,60,0.15)",
          borderRadius: "10px",
          padding: "12px 14px",
        }}
      >
        <p style={{ color: "rgba(253,247,255,0.5)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
          <span style={{ color: "#ff6b6b", fontWeight: 600 }}>❌ Problème — </span>
          {card.problem}
        </p>
      </div>

      {/* solution */}
      <div
        style={{
          background: "rgba(81,0,255,0.07)",
          border: "1px solid rgba(81,0,255,0.2)",
          borderRadius: "10px",
          padding: "12px 14px",
          flex: 1,
        }}
      >
        <p style={{ color: "rgba(253,247,255,0.8)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
          <span style={{ color: "#B8A2E6", fontWeight: 600 }}>✓ Solution — </span>
          {card.solution}
        </p>
      </div>

      {/* stat chip */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
        <span
          style={{
            backgroundColor: "#5100FF",
            borderRadius: "9999px",
            padding: "4px 14px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#FDF7FF",
          }}
        >
          {card.stat}
        </span>
      </div>
    </motion.div>
  );
}

export default function Solutions() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section
      id="solution"
      style={{
        background: "linear-gradient(to bottom, #3A1570, #4E1A8C)",
        padding: "96px 0 112px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: "rgba(81,0,255,0.15)",
              border: "1px solid rgba(81,0,255,0.4)",
              borderRadius: "9999px",
              padding: "6px 18px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#B8A2E6",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Problème → Solution
          </span>
          <h2
            style={{
              color: "#FDF7FF",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 auto",
              maxWidth: "640px",
            }}
          >
            Pourquoi choisir{" "}
            <span style={{ color: "#5100FF" }}>DIV Protocol</span>
          </h2>
          <p
            style={{
              color: "rgba(253,247,255,0.55)",
              fontSize: "16px",
              lineHeight: 1.7,
              marginTop: "16px",
              maxWidth: "520px",
              margin: "16px auto 0",
            }}
          >
            Les outils grand public ne sont pas conçus pour votre confidentialité professionnelle.
          </p>
        </motion.div>

        {/* cards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {cards.map((card, i) => (
            <Card key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
