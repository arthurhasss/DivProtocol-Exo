"use client";

import { motion } from "framer-motion";

type CtaBannerProps = {
  /** Texte optionnel au-dessus des boutons */
  headline?: string;
};

export default function CtaBanner({ headline }: CtaBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        background: "#1F1926",
      }}
    >
      {headline && (
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "15px",
            fontWeight: 500,
            margin: 0,
            textAlign: "center",
          }}
        >
          {headline}
        </p>
      )}

      {/* boutons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          width: "100%",
          maxWidth: "780px",
        }}
      >
        {/* Demander une démo */}
        <a
          href="#contact"
          style={{
            flex: "1 1 180px",
            maxWidth: "260px",
            textAlign: "center",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.6)",
            padding: "14px 20px",
            fontSize: "0.925rem",
            fontWeight: 600,
            color: "#ffffff",
            textDecoration: "none",
            background: "transparent",
            transition: "background 0.2s, border-color 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.6)";
          }}
        >
          Demander une démo
        </a>

        {/* Commencer maintenant */}
        <a
          href="#discover"
          style={{
            flex: "1 1 180px",
            maxWidth: "260px",
            textAlign: "center",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.6)",
            padding: "14px 20px",
            fontSize: "0.925rem",
            fontWeight: 600,
            color: "#ffffff",
            textDecoration: "none",
            background: "transparent",
            transition: "background 0.2s, border-color 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.6)";
          }}
        >
          Commencer maintenant
        </a>

        {/* Appelez-nous */}
        <a
          href="tel:+33"
          style={{
            flex: "1 1 180px",
            maxWidth: "260px",
            textAlign: "center",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.6)",
            padding: "14px 20px",
            fontSize: "0.925rem",
            fontWeight: 600,
            color: "#ffffff",
            textDecoration: "none",
            background: "transparent",
            transition: "background 0.2s, border-color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.6)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          Appelez-nous
        </a>
      </div>
    </motion.div>
  );
}
