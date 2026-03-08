"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ---- chiffres clés ---- */
const stats = [
  { value: "10 000+", label: "dossiers sécurisés" },
  { value: "850+", label: "cabinets d'avocats" },
  { value: "99.99%", label: "disponibilité garantie" },
  { value: "0", label: "fuite de données" },
];

/* ---- comparatif ---- */
const comparison = [
  { feature: "Hébergement", before: "🇺🇸 Serveurs US (AWS, Google)", after: "🇫🇷 Datacenters certifiés HDS" },
  { feature: "Chiffrement", before: "Côté serveur (l'éditeur accède)", after: "Zero-knowledge — clé uniquement chez vous" },
  { feature: "RGPD", before: "Mise en conformité manuelle", after: "DPA intégré, exports CNIL en 1 clic" },
  { feature: "Secret professionnel", before: "Non garanti", after: "Architecture dédiée professions réglementées" },
  { feature: "Accès Cloud Act US", before: "Possible", after: "Impossible — juridiction FR uniquement" },
];

/* ---- témoignages ---- */
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
    quote: "Produit français, hébergement français, équipe réactive. Exactement ce qu'un cabinet comme le nôtre attendait.",
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
      style={{ textAlign: "center", flex: "1 1 140px" }}
    >
      <div style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: "#FDF7FF", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ color: "#B8A2E6", fontSize: "14px", marginTop: "8px", fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

export default function Confiance() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const compRef = useRef(null);
  const compInView = useInView(compRef, { once: true, margin: "-60px" });

  return (
    <section
      id="confiance"
      style={{
        background: "linear-gradient(to bottom, #1F1926, #0E0B14)",
        padding: "96px 0 120px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* ---- section title ---- */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
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
            Confiance & Preuves
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
            Ils nous font confiance.{" "}
            <span style={{ color: "#5100FF" }}>Voici pourquoi.</span>
          </h2>
        </motion.div>

        {/* ---- chiffres ---- */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "center",
            marginBottom: "80px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(184,162,230,0.12)",
            borderRadius: "20px",
            padding: "40px 32px",
          }}
        >
          {stats.map((s, i) => (
            <AnimatedStat key={i} value={s.value} label={s.label} index={i} />
          ))}
        </div>

        {/* ---- comparatif ---- */}
        <motion.div
          ref={compRef}
          initial={{ opacity: 0, y: 40 }}
          animate={compInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "80px" }}
        >
          <h3 style={{ color: "#FDF7FF", fontSize: "22px", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
            Dropbox / Google Drive vs.{" "}
            <span style={{ color: "#5100FF" }}>DIV Protocol</span>
          </h3>

          {/* table wrapper — scroll on mobile */}
          <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid rgba(184,162,230,0.12)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "540px" }}>
              <thead>
                <tr style={{ background: "rgba(81,0,255,0.15)" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#B8A2E6", fontSize: "13px", fontWeight: 600, width: "28%" }}>Critère</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#ff6b6b", fontSize: "13px", fontWeight: 600, width: "36%" }}>Solutions classiques</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#7fffb2", fontSize: "13px", fontWeight: 600, width: "36%" }}>DIV Protocol</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderTop: "1px solid rgba(184,162,230,0.07)",
                    }}
                  >
                    <td style={{ padding: "14px 20px", color: "rgba(253,247,255,0.7)", fontSize: "13px", fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: "14px 20px", color: "rgba(253,247,255,0.45)", fontSize: "13px" }}>{row.before}</td>
                    <td style={{ padding: "14px 20px", color: "rgba(253,247,255,0.9)", fontSize: "13px" }}>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ---- témoignages ---- */}
        <div style={{ marginBottom: "80px" }}>
          <h3 style={{ color: "#FDF7FF", fontSize: "22px", fontWeight: 700, marginBottom: "32px", textAlign: "center" }}>
            Ce que disent nos clients
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {testimonials.map((t, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  style={{
                    flex: "1 1 280px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(184,162,230,0.12)",
                    borderRadius: "16px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* quote marks */}
                  <span style={{ fontSize: "40px", color: "#5100FF", lineHeight: 1, opacity: 0.6 }}>"</span>
                  <p style={{ color: "rgba(253,247,255,0.8)", fontSize: "14px", lineHeight: 1.75, margin: 0, marginTop: "-16px", flex: 1 }}>
                    {t.quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#5100FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#FDF7FF",
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ color: "#FDF7FF", fontSize: "13px", fontWeight: 600 }}>{t.author}</div>
                      <div style={{ color: "#B8A2E6", fontSize: "12px" }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ---- CTA final ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center" }}
        >
          <p style={{ color: "rgba(253,247,255,0.55)", fontSize: "15px", marginBottom: "24px" }}>
            Prêt à sécuriser vos dossiers clients ?
          </p>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              backgroundColor: "#5100FF",
              color: "#FDF7FF",
              borderRadius: "9999px",
              padding: "16px 40px",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              transition: "filter 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.15)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(81,0,255,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "none";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Demander une démo gratuite
          </a>
        </motion.div>

      </div>
    </section>
  );
}
