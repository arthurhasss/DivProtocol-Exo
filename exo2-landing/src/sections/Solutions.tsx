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

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="feature-card"
      whileHover={{
        borderColor: "rgba(81,0,255,0.5)",
        boxShadow: "0 8px 40px rgba(81,0,255,0.15)",
      }}
    >
      {card.icon}

      <span className="card-tag">{card.tag}</span>

      <h3 className="card-title">{card.title}</h3>

      <div className="card-problem">
        <p className="card-text">
          <span className="font-semibold text-[#ff6b6b]">❌ Problème — </span>
          {card.problem}
        </p>
      </div>

      <div className="card-solution">
        <p className="card-text-main">
          <span className="font-semibold text-wisteria">✓ Solution — </span>
          {card.solution}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className="stat-chip">{card.stat}</span>
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
      className="section-solutions overflow-hidden py-24 pb-28 transition-colors duration-500"
    >
      <div className="section-container">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge">Problème → Solution</span>
     
          <h2 className="section-title mx-auto max-w-[640px]">
             Tout ce dont vos équipes ont besoin {" "}
            <span className="text-electric-indigo">pour travailler en sécurité.</span>
          </h2>
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