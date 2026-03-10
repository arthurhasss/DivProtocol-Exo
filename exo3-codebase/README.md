# Documents API — Cabinet Juridique

API de gestion de documents juridiques construite avec NestJS + TypeORM + PostgreSQL.

---

## Diagnostic de l'état initial

### 🔴 Critique (Sécurité / Production)

| # | Problème | Gravité |
|---|----------|---------|
| C1 | Mot de passe DB hardcodé dans le code avec `// TODO: change before deploy lol` | **Critique** |
| C2 | `synchronize: true` activé en production — risque de perte de données | **Critique** |
| C3 | Toutes les erreurs retournées en HTTP **200** au lieu de 404 / 400 / 422 | **Critique** |

### 🟠 Haute (Maintenabilité / Architecture)

| # | Problème |
|---|----------|
| H1 | Tout dans un seul controller : validation + logique métier + accès DB |
| H2 | `any` partout — zéro typage TypeScript |
| H3 | Méthodes nommées `handle`, `handle2`, `handle3`, `handle5`, `process`, `doUpdate` |
| H4 | Endpoints non-REST : `/move`, `/find`, `/info` |
| H5 | `console.log` à la place d'un logger structuré |
| H6 | `PUT` pour une mise à jour partielle (sémantique incorrecte, devrait être `PATCH`) |

### 🟡 Moyenne (Qualité / Lisibilité)

| # | Problème |
|---|----------|
| M1 | Variables `r`, `d`, `x`, `z`, `tmp`, `ns`, `a`, `b`, `c`, `p`, `l` |
| M2 | Oneliners illisibles (3 opérations par ligne) |
| M3 | Validation type copiée-collée 3 fois |
| M4 | Deux helpers inutilisés (`checkDoc`, `validateType`) qui font la même chose |
| M5 | Tous les `catch` retournent `"something went wrong"` sans distinguer les cas |
| M6 | Stats avec clés `b`, `c`, `d` sans libellé |

### 🟢 Faible (Bonnes pratiques)

| # | Problème |
|---|----------|
| F1 | Zéro tests |
| F2 | `strict: false` en TypeScript |
| F3 | Pas de `ValidationPipe` global |
| F4 | Pas de `.env` / `.env.example` |
| F5 | Conflit de routing : `GET /find` et `GET /info` shadowés par `GET /:id` |

---

## Ce qui a été corrigé

- ✅ **Architecture** : Controller → Service séparés, DocumentsModule isolé
- ✅ **DTOs** : `CreateDocumentDto`, `UpdateDocumentDto`, `ChangeStatusDto`, `ListDocumentsDto` avec `class-validator`
- ✅ **TypeScript strict** : `strict: true`, zéro `any`
- ✅ **Enums** : `DocumentType`, `DocumentStatus`, `VALID_TRANSITIONS`
- ✅ **Workflow** : matrice de transitions dans `VALID_TRANSITIONS`, `UnprocessableEntityException` si invalide
- ✅ **HTTP codes corrects** : `NotFoundException` (404), `ForbiddenException` (403), `UnprocessableEntityException` (422)
- ✅ **Logger Pino** : `nestjs-pino` à la place des `console.log`
- ✅ **Secrets dans `.env`** : TypeORM chargé via `ConfigService`, jamais hardcodé
- ✅ **`synchronize: false`** en production
- ✅ **REST correct** : `PATCH` au lieu de `PUT`, `/status` au lieu de `/move`, `/search` et `/stats` au lieu de `/find` et `/info`
- ✅ **Tests** : 3 suites unitaires sur le service (transitions, types, suppression)

---

## Structure

```
src/
├── app.module.ts                  # ConfigModule + TypeORM async + Pino
├── main.ts                        # ValidationPipe global + Logger Pino
└── documents/
    ├── documents.module.ts
    ├── documents.controller.ts
    ├── documents.service.ts
    ├── documents.service.spec.ts  # Tests unitaires
    ├── document.entity.ts
    ├── enums/
    │   ├── document-type.enum.ts
    │   └── document-status.enum.ts
    └── dto/
        ├── create-document.dto.ts
        ├── update-document.dto.ts
        ├── change-status.dto.ts
        └── list-documents.dto.ts
```

---

## Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/documents` | Lister avec filtres (`status`, `type`, `owner`) + pagination |
| `GET` | `/documents/search?q=titre` | Recherche LIKE sur le titre |
| `GET` | `/documents/stats` | Stats par statut |
| `GET` | `/documents/:id` | Récupérer un document (404 si absent) |
| `POST` | `/documents` | Créer un document (status initial : `draft`) |
| `PATCH` | `/documents/:id` | Mettre à jour les métadonnées |
| `PATCH` | `/documents/:id/status` | Changer le statut (workflow enforced) |
| `DELETE` | `/documents/:id` | Supprimer (403 si `approved`) |

### Workflow des statuts

```
draft → review → approved → archived
                ↘ rejected → draft
```

---

## Setup

### Prérequis
- Node.js ≥ 18
- PostgreSQL

### Installation

```bash
# Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec vos identifiants PostgreSQL

npm install
npm run start:dev
```

### Tests

```bash
npm test          # Tests unitaires
npm run test:cov  # Avec couverture de code
```

### Build

```bash
npm run build     # Compile TypeScript strict
```

---

## Variables d'environnement

Voir `.env.example` pour la liste complète.

| Variable | Défaut | Description |
|----------|--------|-------------|
| `NODE_ENV` | `development` | Environnement (`development` / `production`) |
| `PORT` | `3000` | Port d'écoute |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_USER` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | _(vide)_ | Mot de passe PostgreSQL |
| `DB_NAME` | `documents_db` | Nom de la base |

> ⚠️ **Ne jamais commiter `.env`** — il est dans `.gitignore`.
