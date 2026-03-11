# Exo 4 — Docker Compose + Déploiement

## URL de déploiement

> L'application est accessible à l'adresse : **http://\<IP_VPS\>**

---

## Lancer en local

### Prérequis

- [Docker](https://www.docker.com/) + Docker Compose installés

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/<ton-user>/DivProtocol-Exo.git
cd DivProtocol-Exo/exo4-devops

# 2. Copier le fichier d'environnement
cp .env.example .env
# Edite .env si tu veux changer les identifiants

# 3. Démarrer tous les services
docker compose up --build -d

# 4. Vérifier que tout est up
docker compose ps
```

L'application est ensuite accessible sur **http://localhost**.

### Arrêter

```bash
docker compose down          # stoppe les conteneurs
docker compose down -v       # stoppe ET supprime les volumes (données PostgreSQL effacées)
```

---

## Architecture

```
Client (navigateur)
       │
       ▼
 ┌─────────────┐   /*        ┌──────────────┐
 │    nginx    │ ──────────► │   frontend   │  (nginx:alpine — sert index.html)
 │  :80 (host) │             └──────────────┘
 │             │   /api/*    ┌──────────────┐    ┌──────────────┐
 │             │ ──────────► │     api      │ ──►│      db      │
 └─────────────┘             │ FastAPI:8000 │    │ Postgres:5432│
                             └──────────────┘    └──────────────┘
```

| Service    | Image              | Rôle                                    |
|------------|--------------------|-----------------------------------------|
| `nginx`    | `nginx:alpine`     | Reverse proxy — seul port exposé (80)   |
| `api`      | `python:3.12-slim` | Backend FastAPI (POST /greet, etc.)     |
| `frontend` | `nginx:alpine`     | Sert le fichier HTML statique           |
| `db`       | `postgres:16-alpine` | Base de données PostgreSQL            |

### Endpoints API

| Méthode | Route        | Description                                |
|---------|--------------|--------------------------------------------|
| GET     | `/health`    | Retourne `{ "status": "ok" }`              |
| GET     | `/ping`      | Retourne `{ "message": "pong" }`           |
| POST    | `/api/greet` | `{ "name": "..." }` → message de bienvenue |

---

## Ce que je ferais différemment en production

### 🔒 HTTPS
- Utiliser **Certbot + Let's Encrypt** pour générer un certificat SSL gratuit.
- Ajouter un bloc `server` en écoute sur le port 443 dans `nginx.conf`.
- Mettre en place le renouvellement automatique via un cron (`certbot renew`).

### 📊 Monitoring & Observabilité
- Ajouter **Prometheus + Grafana** (ou un service managé comme Datadog) pour surveiller les métriques (latence, taux d'erreur, usage CPU/RAM).
- Centraliser les logs avec **Loki** ou un équivalent.
- Configurer des alertes sur les erreurs 5xx.

### 💾 Backups
- Sauvegardes automatiques de la base PostgreSQL (ex. `pg_dump` planifié via cron + upload S3).
- Tester régulièrement la restauration.

### 🔐 Sécurité
- Remplacer `allow_origins=["*"]` dans FastAPI par la liste explicite des domaines autorisés.
- Utiliser un secret manager (ex. **HashiCorp Vault** ou le gestionnaire de secrets du cloud provider) plutôt qu'un fichier `.env` sur le serveur.
- Limiter les droits de l'utilisateur PostgreSQL (pas de superuser).

### 🚀 Scalabilité & Résilience
- Déployer sur un orchestrateur (Kubernetes ou au minimum **Docker Swarm**) pour gérer la haute disponibilité et le scaling horizontal.
- Utiliser un load balancer devant plusieurs instances de l'API.
- Mettre en place une base de données avec réplica en lecture.
