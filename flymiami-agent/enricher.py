import requests

def find_email_hunter(domain: str, api_key: str) -> tuple[str, str]:
    if not api_key or api_key == "optional_hunter_key_here":
        return "", ""
    try:
        resp = requests.get(
            "https://api.hunter.io/v2/domain-search",
            params={"domain": domain, "api_key": api_key},
            timeout=10
        )
        data = resp.json().get("data", {}) or {}
        emails = data.get("emails", [])
        if emails:
            best = emails[0]
            name = f"{best.get('first_name') or ''} {best.get('last_name') or ''}".strip()
            return name, best.get("value", "")
    except Exception:
        pass
    return "", ""
