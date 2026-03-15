import csv
import json
import logging
import os
import random
import re
import time
import uuid
from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.barreau-bordeaux.com/avocats/page/{page}/?nom&ville=107&nomCabinet&specialite"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
CSV_FILE = os.path.join(OUTPUT_DIR, "lawyers.csv")
JSON_FILE = os.path.join(OUTPUT_DIR, "rapport.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)




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



def parse_attorney_cards(html: str):
    soup = BeautifulSoup(html, "html.parser")
    records = []

    cards = soup.select(".card.as--team-mini")
    for card in cards:
        name_elem = card.select_one(".card-title")
        if not name_elem or not name_elem.get_text(strip=True):
            continue  # ignore les cartes vides
        full_name = name_elem.get_text(strip=True)
        

        email = ""
        email_elem = card.select_one('a[href^="mailto:"]')
        if email_elem:
            email = email_elem["href"].replace("mailto:", "").strip().lower()

        phone = ""
        phone_elem = card.select_one('.card-desc p')
        if phone_elem:
            phone = phone_elem.get_text(strip=True)

            profile_url =""
        link_elem = card.select_one("a.card-link")
        if link_elem:
            profile_url = link_elem["href"].strip().lower()

        records.append({
            "fullName": full_name,
            "specialties": [],
            "email": email,
            "phone": phone,
            "profile": profile_url
        })

    return records


def main():
    start_time = time.time()
    page = 1
    all_avocats = []
    seen_keys = set()
    scraped_at = datetime.now().astimezone().isoformat()
    stats = {
        "pagesScraped": 0,
        "totalScraped": 0,
        "totalValid": 0,
        "withEmail": 0,
        "withPhone": 0,
        "withSpecialty": 0,
    }
    skip_reasons = {
        "missingName": 0,
        "duplicate": 0,
        "invalidData": 0,
    }
    bar_assoc = "Bordeaux"

    logger.info("Démarrage du script de Scraping...")

    while True and stats["totalValid"] < 500:
        url = BASE_URL.format(page=page)
        html = fetch_page_with_backoff(url, params={})
        if not html:
            logger.info(f"Impossible de récupérer la page {page}. Fin du scraping.")
            break

        records = parse_attorney_cards(html)

        if not records:
            logger.info(f"Page {page} vide. La fin de la pagination a été atteinte.")
            break

        logger.info(f"Page {page} : {len(records)} avocat(s) trouvé(s).")
        logger.info(f"{stats['totalValid']} Récupérés | {skip_reasons['missingName']} erreurs | {skip_reasons['duplicate']} dupliqués")

        stats["pagesScraped"] += 1
        stats["totalScraped"] += len(records)

        for rec in records:
            name_clean = rec["fullName"].strip()
            email_clean = extract_email(rec["email"])
            phone_clean = format_phone(rec["phone"])
            profile_url = rec["profile"].strip()
            if not name_clean:
                skip_reasons["missingName"] += 1
                continue

            dedup_key = f"{name_clean.lower()}_{bar_assoc.lower()}"
            if dedup_key in seen_keys:
                skip_reasons["duplicate"] += 1
                continue

            seen_keys.add(dedup_key)

            lawyer_record = {
                "id": str(uuid.uuid4()),
                "fullName": name_clean,
                "barAssoc": bar_assoc,
                "specialties": json.dumps(rec["specialties"], ensure_ascii=False),
                "email": email_clean,
                "phone": phone_clean,
                "scrapedAt": scraped_at,
                "sourceUrl": profile_url
            }
            all_avocats.append(lawyer_record)
            stats["totalValid"] += 1
            if email_clean:
                stats["withEmail"] += 1
            if phone_clean:
                stats["withPhone"] += 1
            if rec["specialties"]:
                stats["withSpecialty"] += 1

        page += 1


    duration = time.time() - start_time
    minutes, seconds = divmod(int(duration), 60)
    duration_str = f"{minutes}min {seconds}s" if minutes else f"{seconds}s"

    total_skipped = sum(skip_reasons.values())
    rapport = {
        "barreau": bar_assoc,
        "scrapedAt": scraped_at,
        "duration": duration_str,
        "stats": {
            **stats,
            "totalSkipped": total_skipped,
        },
        "skipReasons": skip_reasons,
    }

    if all_avocats:
        fieldnames = ["id", "fullName", "barAssoc", "specialties", "email", "phone", "scrapedAt", "sourceUrl"]
        with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_avocats)

    with open(JSON_FILE, mode="w", encoding="utf-8") as json_file:
        json.dump(rapport, json_file, indent=2, ensure_ascii=False)

    logger.info(f"Scraping terminé en {duration_str} !")
    logger.info(f"Résultats générés dans : {OUTPUT_DIR}")
    logger.info(f"== RAPPORT ==\n{json.dumps(rapport, indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    main()
    
