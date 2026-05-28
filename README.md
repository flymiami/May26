# ScrapeGraph AI install

[ScrapeGraph AI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) is a Python
web-scraping library that drives LLMs over an internal graph pipeline to
extract structured data from sites and local documents.

## Install

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Optional (only needed for graphs that drive a real browser):

```bash
playwright install
```

Verify the install:

```bash
python smoke_test.py
```

## Why the pins

`scrapegraphai==1.76.0` declares `langchain>=1.2.0` and `langchain-community>=0.4.0`,
but its own modules still import names that were removed in the langchain 1.x /
langchain-community 0.4.x line (e.g. `from langchain_community.chat_models import ChatOllama`,
`from langchain_core.tracers.langchain_v1 import LangChainTracerV1`). Until that
upstream mismatch is fixed, the langchain stack is pinned to the 0.3.x line in
`requirements.txt`, which is the combination that actually imports cleanly.

## Minimal usage

```python
from scrapegraphai.graphs import SmartScraperGraph

graph = SmartScraperGraph(
    prompt="List every article title and its URL.",
    source="https://example.com",
    config={
        "llm": {
            "api_key": "YOUR_OPENAI_API_KEY",
            "model": "openai/gpt-4o-mini",
        },
    },
)
print(graph.run())
```
