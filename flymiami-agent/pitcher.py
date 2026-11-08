import json
import anthropic
from config import ARTIST_CONTEXT

MODEL = "claude-sonnet-5-5"

def evaluate_and_pitch(domain: str, url: str, scraped: dict, api_key: str) -> dict:
    client = anthropic.Anthropic(api_key=api_key)
    prompt = f"""You are an art PR strategist representing this artist:
{ARTIST_CONTEXT}

Analyze this target website to see if it is a legitimate art blog, design magazine, culture publication, or Miami lifestyle outlet where an artist feature, installation spotlight, or guest article makes sense.

Target Domain: {domain}
Target URL: {url}
Page Title: {scraped.get('title')}
Page Content Snippet: {scraped.get('text', '')[:2500]}

Respond ONLY with valid JSON using these exact keys:
{{
  "relevance_score": <integer 1-10, where 7+ means strong editorial/art/culture fit>,
  "reason": "<1 sentence why it fits or does not fit>",
  "subject": "<compelling, non-spammy email subject line>",
  "body": "<under 130 words. Warm, authentic pitch from the artist referencing something specific about their publication, pitching either a visual feature on the monumental UV-reactive rubber duck installations / Florence Biennale Installation Award / upcoming Miami Art Week North Bay Village show, or a contributed story on joyful public art. Include https://flymiami.art naturally.>"
}}"""

    msg = client.messages.create(
        model=MODEL,
        max_tokens=600,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = msg.content[0].text.strip()
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1:
        raw = raw[start:end + 1]
    return json.loads(raw)
