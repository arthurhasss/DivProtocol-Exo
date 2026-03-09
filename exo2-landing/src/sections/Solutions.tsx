"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

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
    tag: "Hébergement souverain",
    title: "Vos données restent en Europe",
    problem: "Aujourd'hui, vos fichiers d'entreprise transitent par des serveurs américains soumis au Cloud Act — sans que vous le sachiez.",
    solution: "DIV Protocol héberge vos données sur une infrastructure multi-datacenters certifiée en Europe. Vous restez propriétaire à 100 % de vos données, à tout moment.",
    stat: "100% hébergement EU",
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
    problem: "Les solutions cloud grand public peuvent lire vos documents — et les autorités étrangères aussi. Vos données sensibles ne sont pas à l'abri.",
    solution: "Vos fichiers sont chiffrés avant de quitter votre appareil. Zéro connaissance : même nous n'avons jamais accès à vos fichiers. Les empreintes sont ancrées sur blockchain pour une traçabilité infalsifiable.",
    stat: "AES-256 + Blockchain",
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
    tag: "Conformité RGPD",
    title: "Conformité intégrée pour les entreprises",
    problem: "Une entreprise non conforme RGPD risque jusqu'à 4 % de son CA annuel en sanction. Les outils grand public ne suffisent plus.",
    solution: "DIV Protocol est conçu pour le B2B : contrôle des accès, audit API, conformité RGPD by design — vos données hébergées et protégées en Europe, sans configuration manuelle.",
    stat: "Conforme RGPD / EU",
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
  const { isDark } = useTheme();

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col gap-4 min-w-0 flex-1 basis-72 rounded-2xl p-8 transition-[border-color,box-shadow,background] duration-500"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
        border: isDark ? "1px solid rgba(184,162,230,0.15)" : "1px solid rgba(81,0,255,0.1)",
        backdropFilter: isDark ? "blur(8px)" : undefined,
        boxShadow: isDark ? undefined : "0 2px 16px rgba(81,0,255,0.06)",
      }}
      whileHover={{
        borderColor: "rgba(81,0,255,0.5)",
        boxShadow: "0 8px 40px rgba(81,0,255,0.15)",
      }}
    >
      {card.icon}

      <span
        className="self-start inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]"
        style={{
          color: isDark ? "#B8A2E6" : "#5100FF",
          background: "rgba(81,0,255,0.1)",
          border: isDark ? "1px solid rgba(81,0,255,0.3)" : "1px solid rgba(81,0,255,0.25)",
        }}
      >
        {card.tag}
      </span>

      <h3 className="text-xl font-bold leading-tight m-0" style={{ color: isDark ? "#FDF7FF" : "#1F1926" }}>
        {card.title}
      </h3>

      <div
        className="rounded-xl px-3.5 py-3"
        style={{
          background: isDark ? "rgba(255,60,60,0.07)" : "rgb(254,242,242)",
          border: isDark ? "1px solid rgba(255,60,60,0.15)" : "1px solid rgb(254,202,202)",
        }}
      >
        <p className="text-[13px] leading-relaxed m-0" style={{ color: isDark ? "rgba(253,247,255,0.5)" : "rgba(31,25,38,0.6)" }}>
          <span className="font-semibold" style={{ color: isDark ? "#ff6b6b" : "#ef4444" }}>❌ Problème — </span>
          {card.problem}
        </p>
      </div>

      <div
        className="flex-1 rounded-xl px-3.5 py-3"
        style={{
          background: isDark ? "rgba(81,0,255,0.07)" : "rgba(81,0,255,0.05)",
          border: isDark ? "1px solid rgba(81,0,255,0.2)" : "1px solid rgba(81,0,255,0.15)",
        }}
      >
        <p className="text-[13px] leading-relaxed m-0" style={{ color: isDark ? "rgba(253,247,255,0.8)" : "rgba(31,25,38,0.75)" }}>
          <span className="font-semibold" style={{ color: isDark ? "#B8A2E6" : "#5100FF" }}>✓ Solution — </span>
          {card.solution}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className="bg-electric-indigo rounded-full px-3.5 py-1 text-xs font-bold text-magnolia">
          {card.stat}
        </span>
      </div>
    </motion.div>
  );
}

export default function Solutions() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const { isDark } = useTheme();

  return (
    <section
      id="solution"
      className="overflow-hidden py-24 pb-28 transition-colors duration-500"
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #3A1570, #4E1A8C)"
          : "#F7F4FF",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block rounded-full px-[18px] py-1.5 text-xs font-semibold uppercase tracking-[0.08em] mb-5"
            style={{
              color: isDark ? "#B8A2E6" : "#5100FF",
              background: "rgba(81,0,255,0.1)",
              border: isDark ? "1px solid rgba(81,0,255,0.4)" : "1px solid rgba(81,0,255,0.25)",
            }}
          >
            Problème → Solution
          </span>
          <h2
            className="font-bold leading-tight mx-auto max-w-2xl"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", color: isDark ? "#FDF7FF" : "#1F1926" }}
          >
            Tout ce dont vos équipes ont besoin{" "}
            <span className="text-electric-indigo">pour travailler en sécurité</span>
          </h2>
          <p
            className="text-base leading-relaxed mt-4 max-w-[520px] mx-auto"
            style={{ color: isDark ? "rgba(253,247,255,0.55)" : "rgba(31,25,38,0.55)" }}
          >
            Les outils grand public ne sont pas conçus pour protéger les données sensibles de votre entreprise.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-6 items-stretch">
          {cards.map((card, i) => (
            <Card key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}