"use client";

import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import Solutions from "@/sections/Solutions";
import Confiance from "@/sections/Confiance";
import CtaBanner from "@/components/CtaBanner";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <main>
      <Hero />
      <Manifesto />
      <CtaBanner
        headline="Prêt à reprendre la propriété totale de vos données d'entreprise ?"
        background={isDark
          ? "linear-gradient(to bottom, #2D1155, #3A1570)"
          : "linear-gradient(to bottom, #E8E2FF, #F7F4FF)"}
      />
      <Solutions />
      <CtaBanner
        headline="Rejoignez les entreprises qui sécurisent déjà leurs données avec DIV Protocol"
        background={isDark
          ? "linear-gradient(to bottom, #4E1A8C, #6030A8)"
          : "linear-gradient(to bottom, #F7F4FF, #EDE6FF)"}
      />
      <Confiance />
    </main>
  );
}
