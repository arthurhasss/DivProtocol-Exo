# Exo 2 — Landing Page (DIV Protocol)

Projet réalisé avec Next.js.

### Structure de la Landing Page

La page principale (`src/app/page.tsx`) est divisée en plusieurs sections (situées dans `src/sections/`) :
1. **Hero** : Titre d'accroche, statistique choc (inventée), et animation de data packets en SVG interactif.
2. **Manifesto** : Expositions de la vision de DIV Protocol (textes récupérés depuis le site officiel de Div Protocol).
3. **Solutions** : Grilles comparatives animées au comportement interactif lors du scroll ("Problème → Solution").
4. **Confiance** : Fausses évaluations clients (avis factices).

---

## Choix technologiques

- **[Next.js](https://nextjs.org/) (App Router)** : Le framework React par excellence pour des performances optimales et un référencement (SEO) de qualité, indispensable pour une landing page.
- **[Tailwind CSS](https://tailwindcss.com/)** : Utilisé pour l'implémentation du design system (conformément aux consignes), la gestion des grilles et le responsive design.
- **[Framer Motion](https://www.framer.com/motion/)** : Utilisé pour créer des animations fluides.

---

## Page déployée en ligne

[https://div-protocol-exo.vercel.app/](https://div-protocol-exo.vercel.app/)


## Installation & Lancement en local

Prérequis : `Node.js` (LTS recommandé) et `npm` (ou `yarn`, `pnpm`, `bun`).

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser la Landing Page.
