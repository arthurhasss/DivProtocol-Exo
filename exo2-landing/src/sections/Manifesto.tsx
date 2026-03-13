"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const icons = [
  <svg key="pdf" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mx-1 text-wisteria">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
  </svg>,
  <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mx-1 text-wisteria">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg key="lock" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mx-1 text-wisteria">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0" />
  </svg>,
];

export default function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="discover" className="section-manifesto pt-[100px] pb-[220px] px-6 flex justify-center transition-colors duration-500">
      <motion.div ref={ref} className="max-w-[820px] text-center">

        {}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center gap-4"
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

        {}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="m-0 font-bold leading-[1.4] text-magnolia"
          style={{ fontSize: "clamp(22px, 3.5vw, 42px)" }}
        >
          Dans un monde où vos données{" "}
          <span className="text-wisteria">sensibles</span>{" "}
          peuvent disparaître, nous avons créé{" "}
          <span className="text-wisteria">DIV,</span>{" "}
          le drive souverain et sécurisé par la blockchain qui vous appartient{" "}
          <span className="text-wisteria">POUR TOUJOURS.</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
