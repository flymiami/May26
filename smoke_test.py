"""Import smoke test for the scrapegraphai install."""

from scrapegraphai.graphs import SmartScraperGraph, SearchGraph, ScriptCreatorGraph

print("scrapegraphai imports OK")
print(" - SmartScraperGraph:", SmartScraperGraph.__name__)
print(" - SearchGraph:", SearchGraph.__name__)
print(" - ScriptCreatorGraph:", ScriptCreatorGraph.__name__)
