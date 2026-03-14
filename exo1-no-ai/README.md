# Exo 1 — Validation API (no-AI)

API Express minimaliste en TypeScript pour valider des **emails** et des **numéros SIREN**


## Méthode no-AI


### Démarche

1. **Lecture et compréhension des specs** — analyse des cas à couvrir (email jetable, format SIREN, algorithme de Luhn) avant d'écrire la moindre ligne de code.
2. **Architecture manuelle** — séparation claire des responsabilités :
   - `validators/` — logique de validation pure (regex, Luhn)
   - `services/` — orchestration et construction de la réponse métier
   - `routes/` — exposition HTTP via Express
3. **TDD partiel** — les tests unitaires ont guidé l'implémentation de `EmailService` et `SirenService` : les cas de test ont été écrits en premier, puis le code jusqu'à ce qu'ils passent tous.
4. **Normalisation des entrées** — trim + lowercase pour l'email, gestion des cas (email jetable, email avec espace à l'intérieur, email sans @), suppression des espaces pour le SIREN, gestion des cas(chaîne vide, caractères non numériques, mauvaise taille).



### Choix technologiques

- **Express.js** : C'est un des framework web Node.js qui était mentionné dans la cheatsheet et permet de monter rapidement une API REST fonctionnelle facilement.
- **TypeScript** : J'ai choisi de coder entièrement en TypeScript pour m'aligner sur les technologies que vous utilisez avec NestJS.
- **Jest** : Le framework de test de référence dans l'écosystème JavaScript/TypeScript. Il est facile à utiliser pour implémenter mes tests unitaires de manière claire et structurée.
## Endpoints

### `POST /validate/email`

Valide et normalise un email.

### `POST /validate/siren`

Valide un numéro SIREN via l'algorithme de Luhn.


### `GET /health`

Vérifier que le serveur est prêt

## Installation & lancement

```bash
npm install

# Lancer le serveur (port 3000)
npm run start

# Mode watch
npm run start:dev
```

---

## Tests

```bash
npm test
```

Les tests couvrent :
- **Email** : format valide, domaine jetable, espaces/majuscules, format invalide
- **SIREN** : Luhn OK, mauvais checksum, trop court/long, body vide, espaces internes, caractères non numériques
