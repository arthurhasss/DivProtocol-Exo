import csv
import json
import logging
import os
import random
import re
import time
import uuid
from datetime import datetime

import requests
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
BASE_URL = "https://www.barreau-bordeaux.com/avocats/?nom=&ville=107&nomCabinet=&specialite="
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
CSV_FILE = os.path.join(OUTPUT_DIR, "lawyers.csv")
JSON_FILE = os.path.join(OUTPUT_DIR, "rapport.json")

# Création du dossier output/ s'il n'existe pas
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Configuration du Logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ==========================================
# 1. UTILITAIRES DE NORMALISATION (DONNÉES)
# ==========================================

def format_phone(phone: str) -> str:
    if not phone:
        return ""
    cleaned = re.sub(r'[^\d+]', '', phone)
    if cleaned.startswith("+33"):
        cleaned = "0" + cleaned[3:]
    if len(cleaned) == 10 and cleaned.startswith("0"):
        return f"+33 {cleaned[1]} {cleaned[2:4]} {cleaned[4:6]} {cleaned[6:8]} {cleaned[8:10]}"
    return phone.strip()

def extract_email(email: str) -> str:
    if not email:
        return ""
    return email.strip().lower()

# ==========================================
# 2. LOGIQUE DE SCRAPING & BACKOFF
# ==========================================

def fetch_page_with_backoff(url: str, params: dict, max_retries: int = 5):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
    }

    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(0.5, 0.8))
            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                return response.text

            if response.status_code == 429 or 500 <= response.status_code < 600:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(f"Retry {attempt+1} dans {wait_time:.2f}s")
                time.sleep(wait_time)
                continue

            response.raise_for_status()

        except requests.exceptions.RequestException as e:
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            logger.error(f"Erreur : {e}")
            time.sleep(wait_time)

    return ""

# ==========================================
# 3. EXTRACTION DU DOM & SÉLECTEURS CSS
# ==========================================

def parse_attorney_cards(html: str):
    soup = BeautifulSoup(html, "html.parser")
    records = []

    cards = soup.select(".card.as--team-mini")
    for card in cards:
        name_elem = card.select_one(".card-title")
        if not name_elem or not name_elem.get_text(strip=True):
            continue  # ignore les cartes vides
        full_name = name_elem.get_text(strip=True)

        link_elem = card.select_one(".card-link")
        profile_url = link_elem["href"] if link_elem else ""

        records.append({
            "fullName": full_name,
            "specialties": [],
            "email": "",
            "phone": "",
            "profile": profile_url
        })

    return records

# ==========================================
# 4. EXÉCUTION PRINCIPALE (DATA PIPELINE)
# ==========================================

def main():
    start_time = time.time()
    page = 0
    all_avocats = []
    seen_keys = set()
    stats = {
        "pages_scraped": 0,
        "total_validated": 0,
        "missing_data_errors": 0,
        "duplicates": 0
    }
    bar_assoc = "Montpellier"

    logger.info("Démarrage du script de Scraping...")

    while True:
        html = fetch_page_with_backoff(BASE_URL, params={"page": page})
        if not html:
            logger.info(f"Impossible de récupérer la page {page}. Fin du scraping.")
            break

        records = parse_attorney_cards(html)

        # CRITÈRE D'ARRÊT : pas de carte valide
        if not records:
            logger.info(f"Page {page} vide. La fin de la pagination a été atteinte.")
            break

        logger.info(f"Page {page} : {len(records)} avocat(s) trouvé(s).")
        stats["pages_scraped"] += 1

        for rec in records:
            name_clean = rec["fullName"].strip()
            email_clean = extract_email(rec["email"])
            phone_clean = format_phone(rec["phone"])

            if not name_clean:
                stats["missing_data_errors"] += 1
                continue

            dedup_key = f"{name_clean.lower()}_{bar_assoc.lower()}"
            if dedup_key in seen_keys:
                stats["duplicates"] += 1
                continue

            seen_keys.add(dedup_key)

            lawyer_record = {
                "id": str(uuid.uuid4()),
                "fullName": name_clean,
                "barAssoc": bar_assoc,
                "specialties": json.dumps(rec["specialties"], ensure_ascii=False),
                "email": email_clean,
                "phone": phone_clean,
                "scrapedAt": datetime.utcnow().isoformat() + "Z",
                "sourceUrl": f"{BASE_URL}?page={page}"
            }
            all_avocats.append(lawyer_record)
            stats["total_validated"] += 1

        page += 1

    # ==========================================
    # 5. EXPORT CSV & JSON
    # ==========================================

    duration = time.time() - start_time
    stats["duration_seconds"] = round(duration, 2)

    if all_avocats:
        fieldnames = ["id", "fullName", "barAssoc", "specialties", "email", "phone", "scrapedAt", "sourceUrl"]
        with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_avocats)

    with open(JSON_FILE, mode="w", encoding="utf-8") as json_file:
        json.dump(stats, json_file, indent=4, ensure_ascii=False)

    logger.info(f"Scraping terminé en {duration:.2f} secondes !")
    logger.info(f"Résultats générés dans : {OUTPUT_DIR}")
    logger.info(f"== RAPPORT ==\n{json.dumps(stats, indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    main()import csv
import json
import logging
import os
import random
import re
import time
import uuid
from datetime import datetime

import requests
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
BASE_URL = "https://www.barreau-bordeaux.com/avocats/?nom=&ville=107&nomCabinet=&specialite="
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
CSV_FILE = os.path.join(OUTPUT_DIR, "lawyers.csv")
JSON_FILE = os.path.join(OUTPUT_DIR, "rapport.json")

# Création du dossier output/ s'il n'existe pas
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Configuration du Logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ==========================================
# 1. UTILITAIRES DE NORMALISATION (DONNÉES)
# ==========================================

def format_phone(phone: str) -> str:
    if not phone:
        return ""
    cleaned = re.sub(r'[^\d+]', '', phone)
    if cleaned.startswith("+33"):
        cleaned = "0" + cleaned[3:]
    if len(cleaned) == 10 and cleaned.startswith("0"):
        return f"+33 {cleaned[1]} {cleaned[2:4]} {cleaned[4:6]} {cleaned[6:8]} {cleaned[8:10]}"
    return phone.strip()

def extract_email(email: str) -> str:
    if not email:
        return ""
    return email.strip().lower()

# ==========================================
# 2. LOGIQUE DE SCRAPING & BACKOFF
# ==========================================

def fetch_page_with_backoff(url: str, params: dict, max_retries: int = 5):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
    }

    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(0.5, 0.8))
            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                return response.text

            if response.status_code == 429 or 500 <= response.status_code < 600:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(f"Retry {attempt+1} dans {wait_time:.2f}s")
                time.sleep(wait_time)
                continue

            response.raise_for_status()

        except requests.exceptions.RequestException as e:
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            logger.error(f"Erreur : {e}")
            time.sleep(wait_time)

    return ""

# ==========================================
# 3. EXTRACTION DU DOM & SÉLECTEURS CSS
# ==========================================

def parse_attorney_cards(html: str):
    soup = BeautifulSoup(html, "html.parser")
    records = []

    cards = soup.select(".card.as--team-mini")
    for card in cards:
        name_elem = card.select_one(".card-title")
        if not name_elem or not name_elem.get_text(strip=True):
            continue  # ignore les cartes vides
        full_name = name_elem.get_text(strip=True)

        link_elem = card.select_one(".card-link")
        profile_url = link_elem["href"] if link_elem else ""

        records.append({
            "fullName": full_name,
            "specialties": [],
            "email": "",
            "phone": "",
            "profile": profile_url
        })

    return records

# ==========================================
# 4. EXÉCUTION PRINCIPALE (DATA PIPELINE)
# ==========================================

def main():
    start_time = time.time()
    page = 0
    all_avocats = []
    seen_keys = set()
    stats = {
        "pages_scraped": 0,
        "total_validated": 0,
        "missing_data_errors": 0,
        "duplicates": 0
    }
    bar_assoc = "Montpellier"

    logger.info("Démarrage du script de Scraping...")

    while True:
        html = fetch_page_with_backoff(BASE_URL, params={"page": page})
        if not html:
            logger.info(f"Impossible de récupérer la page {page}. Fin du scraping.")
            break

        records = parse_attorney_cards(html)

        # CRITÈRE D'ARRÊT : pas de carte valide
        if not records:
            logger.info(f"Page {page} vide. La fin de la pagination a été atteinte.")
            break

        logger.info(f"Page {page} : {len(records)} avocat(s) trouvé(s).")
        stats["pages_scraped"] += 1

        for rec in records:
            name_clean = rec["fullName"].strip()
            email_clean = extract_email(rec["email"])
            phone_clean = format_phone(rec["phone"])

            if not name_clean:
                stats["missing_data_errors"] += 1
                continue

            dedup_key = f"{name_clean.lower()}_{bar_assoc.lower()}"
            if dedup_key in seen_keys:
                stats["duplicates"] += 1
                continue

            seen_keys.add(dedup_key)

            lawyer_record = {
                "id": str(uuid.uuid4()),
                "fullName": name_clean,
                "barAssoc": bar_assoc,
                "specialties": json.dumps(rec["specialties"], ensure_ascii=False),
                "email": email_clean,
                "phone": phone_clean,
                "scrapedAt": datetime.utcnow().isoformat() + "Z",
                "sourceUrl": f"{BASE_URL}?page={page}"
            }
            all_avocats.append(lawyer_record)
            stats["total_validated"] += 1

        page += 1

    # ==========================================
    # 5. EXPORT CSV & JSON
    # ==========================================

    duration = time.time() - start_time
    stats["duration_seconds"] = round(duration, 2)

    if all_avocats:
        fieldnames = ["id", "fullName", "barAssoc", "specialties", "email", "phone", "scrapedAt", "sourceUrl"]
        with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_avocats)

    with open(JSON_FILE, mode="w", encoding="utf-8") as json_file:
        json.dump(stats, json_file, indent=4, ensure_ascii=False)

    logger.info(f"Scraping terminé en {duration:.2f} secondes !")
    logger.info(f"Résultats générés dans : {OUTPUT_DIR}")
    logger.info(f"== RAPPORT ==\n{json.dumps(stats, indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    main()