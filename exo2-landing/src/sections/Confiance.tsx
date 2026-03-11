"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10 000+", label: "dossiers sécurisés" },
  { value: "850+", label: "cabinets d'avocats" },
  { value: "99.99%", label: "disponibilité garantie" },
  { value: "0", label: "fuite de données" },
];

const testimonials = [
  {
    quote: "Depuis DIV Protocol, je peux enfin partager des pièces sensibles avec mes clients sans craindre une fuite. C'est devenu indispensable.",
    author: "Maître Sophie L.",
    role: "Avocate en droit pénal, Paris",
    initials: "SL",
  },
  {
    quote: "La conformité RGPD était un vrai casse-tête. Avec DIV, tout est intégré. Le DPA généré automatiquement nous a sauvé un audit.",
    author: "Cabinet Moreau & Associés",
    role: "Droit des affaires, Lyon",
    initials: "MA",
  },
  {
    quote: "Produit français, hébergement européen, équipe réactive. Exactement ce qu'un cabinet comme le nôtre attendait.",
    author: "Maître Jean-François R.",
    role: "Notaire, Bordeaux",
    initials: "JR",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
  }),
};

function AnimatedStat({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="text-center flex-[1_1_140px]"
    >
      <div
        className="font-extrabold leading-none text-magnolia"
        style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
      >
        {value}
      </div>
      <div className="text-sm mt-2 font-medium text-wisteria">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="testimonial-card"
    >
      <span className="text-[40px] text-electric-indigo leading-none opacity-60">"</span>
      <p className="card-text-main -mt-4 flex-1">{t.quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-electric-indigo flex items-center justify-center text-[13px] font-bold text-magnolia shrink-0">
          {t.initials}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-magnolia">{t.author}</div>
          <div className="text-[12px] text-wisteria">{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Confiance() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section
      id="confiance"
      className="section-confiance overflow-hidden pt-24 pb-[120px] transition-colors duration-500"
    >
      <div className="section-container">

        {}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-[72px]"
        >
          <span className="badge">Confiance &amp; Preuves</span>
          <h2 className="section-title mx-auto max-w-[640px]">
            Ils nous font confiance.{" "}
            <span className="text-electric-indigo">Voici pourquoi.</span>
          </h2>
        </motion.div>

        {}
        <div className="stats-panel mb-20">
          {stats.map((s, i) => (
            <AnimatedStat key={i} value={s.value} label={s.label} index={i} />
          ))}
        </div>

        {}
        <div className="mb-20">
          <h3 className="text-[22px] font-bold mb-8 text-center text-raisin ">
            Ce que disent nos clients
          </h3>
          <div className="flex flex-wrap gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="section-description text-[15px] mb-6">
            Prêt à sécuriser vos dossiers clients ?
          </p>
          <a href="#contact" className="btn-primary">
            Demander une démo gratuite
          </a>
        </motion.div>

      </div>
    </section>
  );
}


