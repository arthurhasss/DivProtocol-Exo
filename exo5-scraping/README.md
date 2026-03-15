# Exo 5 — Scraping du Barreau de Bordeaux

Script Python qui scrape les fiches avocats du site [barreau-bordeaux.com](https://www.barreau-bordeaux.com) et exporte les données en CSV + un rapport JSON.

## Fonctionnement

Le script parcourt les pages de résultats (`/avocats/page/{n}/`) et extrait pour chaque avocat :

- Nom complet
- Email (depuis `mailto:`)
- Téléphone (depuis `tel:`)
- URL de la fiche profil
- Spécialités

Il s'arrête quand une page est vide ou qu'un seuil de 500 avocats validés est atteint.

## Installation

```bash
pip install requests beautifulsoup4
```

## Lancement

```bash
python main.py
```

## Output

### `output/lawyers.csv`

| Colonne | Description |
|---|---|
| `id` | UUID unique |
| `fullName` | Nom complet |
| `barAssoc` | Barreau (Bordeaux) |
| `specialties` | Spécialités (JSON) |
| `email` | Adresse email |
| `phone` | Téléphone formaté `+33 X XX XX XX XX` |
| `scrapedAt` | Horodatage de la session |
| `sourceUrl` | URL de la fiche profil |

### `output/rapport.json`

```json
{
  "barreau": "Bordeaux",
  "scrapedAt": "2026-03-15T14:32:10+01:00",
  "duration": "2min 34s",
  "stats": {
    "pagesScraped": 45,
    "totalScraped": 612,
    "totalValid": 589,
    "totalSkipped": 23,
    "withEmail": 145,
    "withPhone": 203,
    "withSpecialty": 312
  },
  "skipReasons": {
    "missingName": 12,
    "duplicate": 8,
    "invalidData": 3
  }
}
```

## Détails techniques

- **Pagination** : URL path-based (`/page/1/`, `/page/2/`…)
- **Retry avec backoff exponentiel** : jusqu'à 5 tentatives sur erreur 429 ou 5xx
- **Délai entre requêtes** : 0.5–0.8s aléatoire pour éviter le rate-limiting
- **Déduplication** : clé `nom_barreau` pour éviter les doublons inter-pages
- **Fuseau horaire** :  heure locale 
