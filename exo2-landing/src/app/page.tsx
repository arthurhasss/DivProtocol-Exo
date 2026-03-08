import Hero from "@/sections/Hero";
import Solutions from "@/sections/Solutions";
import Confiance from "@/sections/Confiance";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <CtaBanner headline="Rejoignez les 850+ cabinets qui sécurisent déjà leurs dossiers avec DIV Protocol" />
      <Solutions />
      <CtaBanner headline="Prêt à reprendre le contrôle de vos données ?" />
      <Confiance />
    </main>
  );
}
