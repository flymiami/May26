import os
import argparse
from datetime import date
import pandas as pd
from dotenv import load_dotenv
from rich.console import Console
from config import DEFAULT_QUERIES
from scraper import search_google, scrape_site
from enricher import find_email_hunter
from pitcher import evaluate_and_pitch

console = Console()
CSV_FILE = "outreach_leads.csv"
COLUMNS = ["date_added", "domain", "url", "relevance_score", "contact_name", "contact_email", "email_subject", "email_body", "status"]

def load_existing_domains() -> set:
    if os.path.exists(CSV_FILE):
        df = pd.read_csv(CSV_FILE)
        return set(df["domain"].dropna().str.lower())
    return set()

def main():
    parser = argparse.ArgumentParser(description="Flymiami.art Backlink & PR Outreach Agent")
    parser.add_argument("--query", type=str, default="", help="Custom Google search query")
    parser.add_argument("--limit", type=int, default=10, help="Results per query")
    parser.add_argument("--min-score", type=int, default=6, help="Minimum relevance score to save")
    args = parser.parse_args()

    load_dotenv()
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    serper_key = os.getenv("SERPER_API_KEY")
    hunter_key = os.getenv("HUNTER_API_KEY", "")

    placeholders = {"your_anthropic_key_here", "your_serper_key_here"}
    if not anthropic_key or not serper_key or {anthropic_key, serper_key} & placeholders:
        console.print("[bold red]Set real ANTHROPIC_API_KEY and SERPER_API_KEY in .env[/bold red]")
        return

    queries = [args.query] if args.query else DEFAULT_QUERIES
    seen_domains = load_existing_domains()
    new_rows = []

    for q in queries:
        console.print(f"\n[bold cyan]Searching:[/bold cyan] {q}")
        try:
            results = search_google(q, serper_key, num=args.limit)
        except Exception as e:
            console.print(f"  [red]Search failed: {e}[/red]")
            continue
        for item in results:
            domain = item["domain"]
            if domain in seen_domains:
                continue
            seen_domains.add(domain)
            console.print(f"  [dim]Inspecting {domain}...[/dim]")
            scraped = scrape_site(item["url"])
            if not scraped["ok"] or len(scraped["text"]) < 200:
                continue

            email = scraped["emails"][0] if scraped["emails"] else ""
            name = ""
            if not email:
                name, email = find_email_hunter(domain, hunter_key)

            try:
                pitch = evaluate_and_pitch(domain, item["url"], scraped, anthropic_key)
                score = int(pitch.get("relevance_score", 0))
                if score >= args.min_score:
                    console.print(f"  [bold green]✓ Match ({score}/10):[/bold green] {domain} ({email or 'No email found'})")
                    new_rows.append({
                        "date_added": str(date.today()),
                        "domain": domain,
                        "url": item["url"],
                        "relevance_score": score,
                        "contact_name": name,
                        "contact_email": email,
                        "email_subject": pitch["subject"],
                        "email_body": pitch["body"],
                        "status": "Draft"
                    })
            except Exception as e:
                console.print(f"  [yellow]Skipped {domain}: {e}[/yellow]")

    if new_rows:
        df_new = pd.DataFrame(new_rows, columns=COLUMNS)
        header = not os.path.exists(CSV_FILE)
        df_new.to_csv(CSV_FILE, mode="a", header=header, index=False)
        console.print(f"\n[bold green]Saved {len(new_rows)} qualified prospects to {CSV_FILE}![/bold green]")
    else:
        console.print("\n[yellow]No new qualified prospects found in this batch.[/yellow]")

if __name__ == "__main__":
    main()
