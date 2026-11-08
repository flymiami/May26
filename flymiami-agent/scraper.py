import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from config import BLACKLIST_DOMAINS

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

def search_google(query: str, api_key: str, num: int = 10) -> list[dict]:
    resp = requests.post(
        "https://google.serper.dev/search",
        headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
        json={"q": query, "num": num},
        timeout=15
    )
    resp.raise_for_status()
    results = []
    for item in resp.json().get("organic", []):
        link = item.get("link", "")
        domain = urlparse(link).netloc.replace("www.", "").lower()
        if domain and not any(domain == b or domain.endswith("." + b) for b in BLACKLIST_DOMAINS):
            results.append({"domain": domain, "url": link, "snippet": item.get("snippet", "")})
    return results

def scrape_site(url: str) -> dict:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=12)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", resp.text))
        clean_emails = [e for e in emails if not e.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"))]
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        text = " ".join(soup.get_text(separator=" ").split())[:3500]
        return {"title": title, "text": text, "emails": clean_emails, "ok": True}
    except Exception as e:
        return {"title": "", "text": "", "emails": [], "ok": False, "error": str(e)}
