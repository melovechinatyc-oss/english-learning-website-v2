#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from urllib.request import urlretrieve

ROOT = Path(__file__).resolve().parents[1]
WORDS_FILE = ROOT / "public/data/high-frequency-5200.txt"
PUBLIC_META_FILE = ROOT / "public/data/high-frequency-5200-meta.json"
TS_META_FILE = ROOT / "src/lib/high-frequency-meta.ts"
CACHE_DIR = ROOT / ".cache"
ECDICT_CSV = CACHE_DIR / "ecdict.csv"
ECDICT_URL = "https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv"


def level_by_rank(rank: int, total: int):
  ratio = rank / max(total, 1)
  if ratio < 0.25:
    return "beginner"
  if ratio < 0.5:
    return "elementary"
  if ratio < 0.75:
    return "intermediate"
  return "advanced"


def normalize_translation(text: str):
  if not text:
    return ""
  text = text.replace("\\n", "；").replace("\n", "；").strip()
  parts = [p.strip() for p in text.split("；") if p.strip()]
  if not parts:
    return ""
  return parts[0][:80]


def load_words():
  words = []
  for line in WORDS_FILE.read_text(encoding="utf-8").splitlines():
    word = line.strip().lower()
    if word:
      words.append(word)
  return words[:5200]


def ensure_ecdict():
  CACHE_DIR.mkdir(parents=True, exist_ok=True)
  if not ECDICT_CSV.exists():
    print(f"Downloading ECDICT -> {ECDICT_CSV}")
    urlretrieve(ECDICT_URL, ECDICT_CSV)


def load_dict():
  mapping = {}
  with ECDICT_CSV.open("r", encoding="utf-8", newline="") as fp:
    reader = csv.DictReader(fp)
    for row in reader:
      word = (row.get("word") or "").strip().lower()
      if not word:
        continue
      translation = normalize_translation(row.get("translation") or "")
      phonetic = (row.get("phonetic") or "").strip()
      if translation:
        mapping[word] = {"chinese": translation, "ipa": phonetic}
  return mapping


def main():
  words = load_words()
  ensure_ecdict()
  d = load_dict()
  total = len(words)
  items = []
  for i, word in enumerate(words):
    info = d.get(word)
    if not info:
      info = d.get(word.replace("-", "")) or d.get(word.replace("'", ""))
    chinese = info["chinese"] if info else f"{word}（常用词）"
    ipa = info["ipa"] if info else ""
    items.append(
      {
        "word": word,
        "chinese": chinese,
        "ipa": ipa,
        "rank": i + 1,
        "level": level_by_rank(i, total),
      }
    )

  PUBLIC_META_FILE.parent.mkdir(parents=True, exist_ok=True)
  PUBLIC_META_FILE.write_text(
    json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8"
  )

  data_json = json.dumps(items, ensure_ascii=False, indent=2)
  ts = (
    "export type HighFrequencyMetaItem = {\n"
    "  word: string;\n  chinese: string;\n  ipa: string;\n  rank: number;\n"
    "  level: \"beginner\" | \"elementary\" | \"intermediate\" | \"advanced\";\n};\n\n"
    f"export const highFrequencyMeta: HighFrequencyMetaItem[] = {data_json} as const;\n\n"
    "export const highFrequencyMetaMap = Object.fromEntries(\n"
    "  highFrequencyMeta.map((item) => [item.word, item]),\n"
    ") as Record<string, HighFrequencyMetaItem>;\n"
  )
  TS_META_FILE.parent.mkdir(parents=True, exist_ok=True)
  TS_META_FILE.write_text(ts, encoding="utf-8")
  print(f"Generated {len(items)} high-frequency items.")


if __name__ == "__main__":
  main()
