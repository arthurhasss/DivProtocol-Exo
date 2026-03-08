import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import Solutions from "@/sections/Solutions";
import Confiance from "@/sections/Confiance";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <CtaBanner
        headline="Prêt à reprendre le contrôle de vos données ?"
        background="linear-gradient(to bottom, #2D1155, #3A1570)"
      />
      <Solutions />
       <CtaBanner
        headline="Rejoignez les 850+ cabinets qui sécurisent déjà leurs dossiers avec DIV Protocol"
        background="linear-gradient(to bottom, #4E1A8C, #6030A8)"
      />
      <Confiance />
     
    </main>
  );
}
